// ========================
// BetaForge Type Definitions
// ========================

export type Platform = "web" | "mobile" | "desktop";
export type TestStatus = "queued" | "running" | "completed" | "failed";
export type BugSeverity = "critical" | "high" | "medium" | "low";
export type TriggerType = "manual" | "webhook" | "scheduled";

// Projects
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  platform: Platform[];
  accessUrl?: string;
  appPackage?: Buffer;
  createdAt: Date;
  updatedAt: Date;
  // Extended properties for UI
  status?: "active" | "testing" | "idle" | "error";
  stats?: {
    bugsFound: number;
    sessionsCount: number;
  };
}

// Test Sessions
export interface TestSession {
  id: string;
  projectId: string;
  status: TestStatus;
  triggerType: TriggerType;
  triggerMetadata?: Record<string, unknown>;
  startedAt?: Date;
  completedAt?: Date;
}

// Agent Personas
export interface AgentPersona {
  id: string;
  name: string;
  personalityTraits: string[];
  testingStrategy: string;
  systemPrompt: string;
  deviceConfig: DeviceConfig;
  enabled: boolean;
  // UI display properties
  color: string;
  specialization: string;
  description: string;
  traits: string[];
  environment: {
    os: string;
    browser: string;
  };
}

export interface DeviceConfig {
  os: string;
  browser: string;
  viewport: { width: number; height: number };
  userAgent?: string;
}

// Agent Executions
export interface AgentExecution {
  id: string;
  sessionId: string;
  agentPersona: string;
  status: TestStatus;
  environmentConfig: DeviceConfig;
  startedAt?: Date;
  completedAt?: Date;
  interactionLog: InteractionEvent[];
  screenshots: string[];
  screenRecording?: string;
}

export interface InteractionEvent {
  timestamp: Date;
  action: string;
  element?: string;
  value?: string;
  screenshot?: string;
}

// Bug Reports
export interface BugReport {
  id: string;
  projectId: string;
  executionId: string;
  severity: BugSeverity;
  title: string;
  description: string;
  reproductionSteps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  screenshots: string[];
  consoleErrors: ConsoleError[];
  networkLogs: NetworkLog[];
  environmentInfo: DeviceConfig;
  createdAt: Date;
}

export interface ConsoleError {
  type: "error" | "warning" | "log";
  message: string;
  source?: string;
  line?: number;
}

export interface NetworkLog {
  url: string;
  method: string;
  status: number;
  duration: number;
  error?: string;
}

// Agent Testing Output (from Claude)
export interface AgentTestOutput {
  bugs: AgentBugFinding[];
  generalFeedback: string;
}

export interface AgentBugFinding {
  severity: BugSeverity;
  title: string;
  description: string;
  reproductionSteps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  screenshotIds: string[];
}

// Real-time Events
export type AgentEventType =
  | "agent_started"
  | "agent_action"
  | "agent_screenshot"
  | "agent_bug_found"
  | "agent_completed"
  | "agent_failed"
  | "session_started"
  | "session_completed"
  | "session_failed";

export interface AgentEvent {
  type: AgentEventType;
  sessionId: string;
  agentId?: string;
  agentName: string;
  timestamp: Date;
  message?: string;
  progress?: number;
  data?: Record<string, unknown>;
}
