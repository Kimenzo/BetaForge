import Anthropic from "@anthropic-ai/sdk";
import type {
  AgentPersona,
  AgentExecution,
  AgentEvent,
  AgentTestOutput,
  TestSession,
  BugReport,
} from "./types";
import { getEnabledAgents } from "./agents";
import { generateId } from "./utils";

// Multi-Database Architecture imports
// "GenAI apps don't run on one database - they run on a mix of databases"
import { getAgentMemoryStore } from "./datastores/agent-memory-store";
import { getKnowledgeBase } from "./datastores/knowledge-base";
import { getCacheStore } from "./datastores/cache-store";
import { getVectorStore } from "./datastores/vector-store";
import type { AgentContext } from "./datastores/types";

// ========================
// Agent Orchestrator
// ========================

export interface OrchestratorConfig {
  projectId: string;
  targetUrl: string;
  agents?: AgentPersona[];
  onEvent?: (event: AgentEvent) => void;
}

export class AgentOrchestrator {
  private anthropic: Anthropic;
  private config: OrchestratorConfig;
  private executions: Map<string, AgentExecution> = new Map();

  constructor(config: OrchestratorConfig) {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.config = config;
  }

  /**
   * Deploy all enabled agents to test the application
   */
  async deployAgents(): Promise<TestSession> {
    const agents = this.config.agents || getEnabledAgents();
    const sessionId = generateId();

    const session: TestSession = {
      id: sessionId,
      projectId: this.config.projectId,
      status: "running",
      triggerType: "manual",
      startedAt: new Date(),
    };

    // Emit session started event
    this.emitEvent({
      type: "agent_started",
      sessionId,
      agentName: "System",
      timestamp: new Date(),
      data: { agentCount: agents.length },
    });

    // Run agents in parallel (or sequentially for resource management)
    const results = await Promise.allSettled(
      agents.map((agent) => this.runSingleAgent(sessionId, agent))
    );

    // Update session status
    const allSucceeded = results.every((r) => r.status === "fulfilled");
    session.status = allSucceeded ? "completed" : "failed";
    session.completedAt = new Date();

    this.emitEvent({
      type: "session_completed",
      sessionId,
      agentName: "System",
      timestamp: new Date(),
      data: { status: session.status },
    });

    return session;
  }

  /**
   * Run a single agent to test the application
   * Uses multi-database architecture for enhanced context:
   * - Agent Memory Store: Previous session learnings
   * - Knowledge Base: Testing patterns and best practices  
   * - Cache Store: Session state management
   * - Vector Store: Semantic bug deduplication
   */
  async runSingleAgent(
    sessionId: string,
    agent: AgentPersona
  ): Promise<AgentExecution> {
    const executionId = generateId();
    const execution: AgentExecution = {
      id: executionId,
      sessionId,
      agentPersona: agent.name,
      status: "running",
      environmentConfig: agent.deviceConfig,
      startedAt: new Date(),
      interactionLog: [],
      screenshots: [],
    };

    this.executions.set(executionId, execution);

    // Cache the execution state for real-time access
    const cacheStore = getCacheStore();
    await cacheStore.set(`execution:${executionId}`, execution, { 
      ttlSeconds: 3600,
      namespace: 'sessions' 
    });

    this.emitEvent({
      type: "agent_started",
      sessionId,
      agentName: agent.name,
      timestamp: new Date(),
    });

    try {
      // Retrieve agent context from memory store (cross-session learning)
      const memoryStore = getAgentMemoryStore();
      const agentContext = await memoryStore.buildAgentContext(
        agent.id,
        this.config.projectId,
        sessionId,
        `Testing ${this.config.targetUrl}`
      );

      // Build the system prompt with agent persona AND context
      const systemPrompt = await this.buildEnhancedSystemPrompt(agent, agentContext);

      // Use Claude to explore and test the application
      const testOutput = await this.executeAgentTesting(
        agent,
        systemPrompt,
        execution
      );

      // Process findings into bug reports
      const bugReports = await this.processBugFindings(executionId, testOutput, agent);

      // Store learnings in agent memory for future sessions
      await this.storeAgentLearnings(agent, sessionId, testOutput, bugReports);

      execution.status = "completed";
      execution.completedAt = new Date();

      // Update cached state
      await cacheStore.set(`execution:${executionId}`, execution, { 
        ttlSeconds: 3600,
        namespace: 'sessions' 
      });

      this.emitEvent({
        type: "agent_completed",
        sessionId,
        agentName: agent.name,
        timestamp: new Date(),
        data: { bugsFound: bugReports.length },
      });

      return execution;
    } catch (error) {
      execution.status = "failed";
      execution.completedAt = new Date();

      this.emitEvent({
        type: "agent_failed",
        sessionId,
        agentName: agent.name,
        timestamp: new Date(),
        data: { error: String(error) },
      });

      throw error;
    }
  }

  /**
   * Build the full system prompt for an agent
   */
  private buildSystemPrompt(agent: AgentPersona): string {
    return `${agent.systemPrompt}

TARGET URL: ${this.config.targetUrl}

TESTING INSTRUCTIONS:
1. Explore the application thoroughly as your persona would
2. Document every bug, issue, or UX problem you find
3. Take note of the steps to reproduce each issue
4. Provide specific, actionable feedback

OUTPUT FORMAT:
After testing, provide your findings as a JSON object:
{
  "bugs": [
    {
      "severity": "critical" | "high" | "medium" | "low",
      "title": "Brief bug description",
      "description": "Detailed explanation of the issue",
      "reproductionSteps": ["Step 1", "Step 2", ...],
      "expectedBehavior": "What should happen",
      "actualBehavior": "What actually happened",
      "screenshotIds": []
    }
  ],
  "generalFeedback": "Overall impressions and UX suggestions"
}`;
  }

  /**
   * Build enhanced system prompt with context from multi-database architecture
   * Combines agent persona with:
   * - Short-term memories (current session)
   * - Long-term memories (learned patterns)
   * - Knowledge base (testing best practices)
   */
  private async buildEnhancedSystemPrompt(
    agent: AgentPersona,
    context: AgentContext
  ): Promise<string> {
    const memoryStore = getAgentMemoryStore();
    const knowledgeBase = getKnowledgeBase();

    // Get relevant knowledge for this agent's testing approach
    const relevantKnowledge = await knowledgeBase.getContextualKnowledge({
      platform: agent.deviceConfig.os,
      agentPersona: agent.name,
      currentAction: agent.testingStrategy,
    });

    // Format context for the prompt
    const contextSection = memoryStore.formatContextForPrompt({
      ...context,
      relevantKnowledge,
    });

    const basePrompt = this.buildSystemPrompt(agent);

    return `${basePrompt}

${contextSection ? `\n## CONTEXT FROM PREVIOUS SESSIONS\n${contextSection}` : ""}

## LEARNING GUIDANCE
As you test, take note of patterns you discover. Your learnings will be stored
and used in future sessions to improve testing efficiency. Focus on:
- Recurring bug patterns specific to this application
- UX issues that align with your testing persona
- Platform-specific quirks on ${agent.deviceConfig.os}/${agent.deviceConfig.browser}`;
  }

  /**
   * Store agent learnings after testing for future sessions
   * This enables agents to get smarter over time
   */
  private async storeAgentLearnings(
    agent: AgentPersona,
    sessionId: string,
    testOutput: AgentTestOutput,
    bugReports: BugReport[]
  ): Promise<void> {
    const memoryStore = getAgentMemoryStore();
    const knowledgeBase = getKnowledgeBase();
    const vectorStore = getVectorStore();

    // Store reflection about the session
    if (testOutput.generalFeedback) {
      await memoryStore.reflect(
        agent.id,
        this.config.projectId,
        `Session ${sessionId} feedback: ${testOutput.generalFeedback}`
      );
    }

    // Learn bug patterns and add to knowledge base
    for (const bug of bugReports) {
      // Store in agent memory
      await memoryStore.learnBugPattern(agent.id, this.config.projectId, {
        title: bug.title,
        description: bug.description,
        symptoms: bug.reproductionSteps.slice(0, 3),
        category: bug.severity,
      });

      // Add to knowledge base for all agents
      await knowledgeBase.learnFromBug(
        bug.title,
        bug.description,
        bug.reproductionSteps
      );

      // Index in vector store for semantic deduplication
      await vectorStore.upsertDocument({
        id: bug.id,
        content: `${bug.title} ${bug.description} ${bug.reproductionSteps.join(" ")}`,
        metadata: {
          type: "bug-report",
          projectId: this.config.projectId,
          severity: bug.severity,
          agentId: agent.id,
        },
        createdAt: new Date(),
      });
    }

    // Record the testing action
    await memoryStore.recordAction(
      agent.id,
      this.config.projectId,
      sessionId,
      `Tested ${this.config.targetUrl}`,
      `Found ${bugReports.length} bugs`
    );
  }

  /**
   * Execute agent testing using Claude
   * In production, this integrates with Playwright for actual browser control
   */
  private async executeAgentTesting(
    agent: AgentPersona,
    systemPrompt: string,
    execution: AgentExecution
  ): Promise<AgentTestOutput> {
    // This is a simplified version. In production, you would:
    // 1. Launch a Playwright browser with the agent's device config
    // 2. Use Claude's computer use capability to control the browser
    // 3. Stream actions back in real-time
    // 4. Capture screenshots and videos

    const response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Please test the application at ${this.config.targetUrl}. 
                   
Simulate exploring the application as ${agent.name} would. Describe what you would test, what issues you might find based on your persona, and provide your findings in the specified JSON format.

Focus on:
- ${agent.testingStrategy}

Remember to stay in character as ${agent.name}: ${agent.personalityTraits.join(", ")}.`,
        },
      ],
    });

    // Parse the response to extract bug findings
    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response format");
    }

    // Try to extract JSON from the response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // If no JSON found, create a default output
      return {
        bugs: [],
        generalFeedback: content.text,
      };
    }

    try {
      return JSON.parse(jsonMatch[0]) as AgentTestOutput;
    } catch {
      return {
        bugs: [],
        generalFeedback: content.text,
      };
    }
  }

  /**
   * Process agent findings into structured bug reports
   * Uses vector store for semantic deduplication - avoids reporting
   * bugs that are very similar to already known issues
   */
  private async processBugFindings(
    executionId: string,
    output: AgentTestOutput,
    agent: AgentPersona
  ): Promise<BugReport[]> {
    const vectorStore = getVectorStore();
    const bugReports: BugReport[] = [];

    for (const bug of output.bugs) {
      // Check for semantic duplicates using vector similarity
      const searchContent = `${bug.title} ${bug.description}`;
      const similarBugs = await vectorStore.findSimilarBugs(searchContent, this.config.projectId, {
        topK: 3,
        threshold: 0.85, // High threshold for duplicate detection
      });

      // Skip if we found a very similar bug already
      const isDuplicate = similarBugs.some((result) => result.similarity > 0.9);
      if (isDuplicate) {
        console.log(`[Orchestrator] Skipping duplicate bug: ${bug.title}`);
        continue;
      }

      bugReports.push({
        id: generateId(),
        projectId: this.config.projectId,
        executionId,
        severity: bug.severity,
        title: bug.title,
        description: bug.description,
        reproductionSteps: bug.reproductionSteps,
        expectedBehavior: bug.expectedBehavior,
        actualBehavior: bug.actualBehavior,
        screenshots: bug.screenshotIds,
        consoleErrors: [],
        networkLogs: [],
        environmentInfo: agent.deviceConfig,
        createdAt: new Date(),
      });
    }

    return bugReports;
  }

  /**
   * Emit an event to the configured handler
   */
  private emitEvent(event: AgentEvent): void {
    if (this.config.onEvent) {
      this.config.onEvent(event);
    }
  }
}

/**
 * Create a new orchestrator instance
 */
export function createOrchestrator(config: OrchestratorConfig): AgentOrchestrator {
  return new AgentOrchestrator(config);
}
