import type {
  SimulationAction,
  SimulationSequence,
  AgentBehaviorProfile,
  Position,
} from "./types";
import { AGENT_BEHAVIORS } from "./types";
import { generateId } from "@/lib/utils";

// ========================
// Simulation Engine
// ========================

/**
 * Generates realistic cursor movement waypoints using Bezier curves
 * to mimic human mouse movement patterns
 */
export function generateCursorPath(
  start: Position,
  end: Position,
  style: "careful" | "direct" | "erratic"
): Position[] {
  const points: Position[] = [];
  const distance = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );

  // More points for longer distances
  const numPoints = Math.max(10, Math.floor(distance / 20));

  // Generate control points for Bezier curve
  const controlPoints = generateControlPoints(start, end, style);

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const point = cubicBezier(
      t,
      start,
      controlPoints[0],
      controlPoints[1],
      end
    );

    // Add slight randomness for more human-like movement
    if (style === "erratic" && i > 0 && i < numPoints) {
      point.x += (Math.random() - 0.5) * 10;
      point.y += (Math.random() - 0.5) * 10;
    }

    points.push(point);
  }

  return points;
}

function generateControlPoints(
  start: Position,
  end: Position,
  style: "careful" | "direct" | "erratic"
): [Position, Position] {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  const variance = style === "careful" ? 50 : style === "erratic" ? 150 : 30;

  return [
    {
      x: midX + (Math.random() - 0.5) * variance,
      y: start.y + (end.y - start.y) * 0.3 + (Math.random() - 0.5) * variance,
    },
    {
      x: midX + (Math.random() - 0.5) * variance,
      y: start.y + (end.y - start.y) * 0.7 + (Math.random() - 0.5) * variance,
    },
  ];
}

function cubicBezier(
  t: number,
  p0: Position,
  p1: Position,
  p2: Position,
  p3: Position
): Position {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

/**
 * Generates typing animation with realistic timing
 */
export function generateTypingSequence(
  text: string,
  typingSpeed: number
): { char: string; delay: number }[] {
  const chars: { char: string; delay: number }[] = [];
  const baseDelay = 1000 / typingSpeed;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    let delay = baseDelay;

    // Add variance for more human-like typing
    delay *= 0.8 + Math.random() * 0.4;

    // Longer pauses after punctuation
    if (".!?".includes(char)) {
      delay *= 2;
    } else if (",;:".includes(char)) {
      delay *= 1.5;
    }

    // Occasional longer pauses (thinking)
    if (Math.random() < 0.05) {
      delay *= 3;
    }

    chars.push({ char, delay });
  }

  return chars;
}

/**
 * Predefined test scenarios that agents can run
 */
export interface TestScenario {
  id: string;
  name: string;
  description: string;
  actions: Omit<SimulationAction, "id" | "timestamp">[];
}

export const COMMON_TEST_SCENARIOS: TestScenario[] = [
  {
    id: "navigation-test",
    name: "Navigation Flow",
    description: "Test main navigation elements and page transitions",
    actions: [
      {
        type: "wait",
        duration: 1000,
        description: "Waiting for page to load...",
        agentThought: "I'll wait for the page to fully load before starting",
      },
      {
        type: "hover",
        duration: 500,
        position: { x: 100, y: 50 },
        element: { selector: "nav", tagName: "NAV", text: "Navigation" },
        description: "Inspecting navigation bar",
        agentThought: "Let me check the navigation structure",
      },
      {
        type: "click",
        duration: 300,
        position: { x: 200, y: 50 },
        element: { selector: "nav a", tagName: "A", text: "About" },
        description: "Clicking on About link",
        agentThought: "Testing navigation to About page",
      },
      {
        type: "wait",
        duration: 800,
        description: "Waiting for page transition...",
        agentThought: "Checking if the page loads correctly",
      },
      {
        type: "scroll",
        duration: 1500,
        scrollDelta: { x: 0, y: 500 },
        description: "Scrolling down to check content",
        agentThought: "Checking if content loads on scroll",
      },
    ],
  },
  {
    id: "form-test",
    name: "Form Interaction",
    description: "Test form inputs, validation, and submission",
    actions: [
      {
        type: "wait",
        duration: 1000,
        description: "Waiting for page to load...",
        agentThought: "Looking for form elements on the page",
      },
      {
        type: "click",
        duration: 200,
        position: { x: 300, y: 200 },
        element: {
          selector: "input[type='email']",
          tagName: "INPUT",
          placeholder: "Email",
        },
        description: "Clicking email input field",
        agentThought: "Testing the email input field",
      },
      {
        type: "type",
        duration: 2000,
        value: "test@example.com",
        element: { selector: "input[type='email']", tagName: "INPUT" },
        description: "Typing email address",
        agentThought: "Entering a valid email to test validation",
      },
      {
        type: "click",
        duration: 200,
        position: { x: 300, y: 280 },
        element: {
          selector: "input[type='password']",
          tagName: "INPUT",
          placeholder: "Password",
        },
        description: "Clicking password field",
        agentThought: "Moving to password field",
      },
      {
        type: "type",
        duration: 1500,
        value: "SecurePass123!",
        element: { selector: "input[type='password']", tagName: "INPUT" },
        description: "Typing password",
        agentThought: "Testing password input with mixed characters",
      },
      {
        type: "click",
        duration: 300,
        position: { x: 300, y: 360 },
        element: {
          selector: "button[type='submit']",
          tagName: "BUTTON",
          text: "Submit",
        },
        description: "Clicking submit button",
        agentThought: "Submitting the form to test validation",
      },
    ],
  },
  {
    id: "accessibility-test",
    name: "Accessibility Check",
    description: "Test keyboard navigation and screen reader elements",
    actions: [
      {
        type: "wait",
        duration: 1000,
        description: "Analyzing page structure...",
        agentThought: "Checking for proper heading hierarchy and ARIA labels",
      },
      {
        type: "hover",
        duration: 800,
        position: { x: 150, y: 100 },
        element: { selector: "h1", tagName: "H1", ariaLabel: "Main heading" },
        description: "Checking main heading",
        agentThought: "Verifying h1 is present and properly structured",
      },
      {
        type: "click",
        duration: 200,
        position: { x: 100, y: 200 },
        element: {
          selector: "[role='button']",
          tagName: "DIV",
          ariaLabel: "Menu button",
        },
        description: "Testing role='button' element",
        agentThought: "Checking if custom button has proper ARIA attributes",
      },
      {
        type: "hover",
        duration: 600,
        position: { x: 400, y: 300 },
        element: {
          selector: "img",
          tagName: "IMG",
          ariaLabel: "Product image",
        },
        description: "Checking image alt text",
        agentThought: "Verifying images have descriptive alt attributes",
      },
    ],
  },
  {
    id: "responsive-test",
    name: "Responsive Layout",
    description: "Test layout at different viewport sizes",
    actions: [
      {
        type: "wait",
        duration: 800,
        description: "Analyzing current layout...",
        agentThought: "Checking responsive breakpoints",
      },
      {
        type: "scroll",
        duration: 1200,
        scrollDelta: { x: 0, y: 300 },
        description: "Scrolling to check content flow",
        agentThought: "Verifying content adapts to mobile viewport",
      },
      {
        type: "click",
        duration: 300,
        position: { x: 350, y: 30 },
        element: {
          selector: ".hamburger-menu",
          tagName: "BUTTON",
          ariaLabel: "Menu",
        },
        description: "Opening mobile menu",
        agentThought: "Testing mobile navigation drawer",
      },
      {
        type: "hover",
        duration: 500,
        position: { x: 200, y: 150 },
        element: { selector: ".mobile-nav a", tagName: "A", text: "Home" },
        description: "Hovering mobile nav item",
        agentThought: "Checking mobile menu interactions",
      },
    ],
  },
  {
    id: "error-handling-test",
    name: "Error Handling",
    description: "Test application error states and edge cases",
    actions: [
      {
        type: "wait",
        duration: 500,
        description: "Preparing chaos tests...",
        agentThought: "I'm going to try to break things!",
      },
      {
        type: "click",
        duration: 200,
        position: { x: 300, y: 200 },
        element: { selector: "input", tagName: "INPUT" },
        description: "Clicking input field",
        agentThought: "Let me try some edge case inputs",
      },
      {
        type: "type",
        duration: 1500,
        value: "<script>alert('xss')</script>",
        element: { selector: "input", tagName: "INPUT" },
        description: "Testing XSS vulnerability",
        agentThought: "Testing for XSS vulnerabilities",
      },
      {
        type: "click",
        duration: 200,
        position: { x: 300, y: 280 },
        element: { selector: "button", tagName: "BUTTON", text: "Submit" },
        description: "Submitting malicious input",
        agentThought: "Checking if the app sanitizes inputs properly",
      },
      {
        type: "wait",
        duration: 1000,
        description: "Checking error handling...",
        agentThought: "Observing how the app handles invalid data",
      },
    ],
  },
];

/**
 * Generate a simulation sequence for a specific agent
 */
export function generateSimulationSequence(
  agentId: string,
  agentName: string,
  targetUrl: string,
  scenarioIds?: string[]
): SimulationSequence {
  const behavior = AGENT_BEHAVIORS[agentName] || AGENT_BEHAVIORS.Emma;

  // Select scenarios based on agent specialty
  const scenarios = selectScenariosForAgent(agentName, scenarioIds);

  // Build action list with proper timing
  let currentTime = 0;
  const actions: SimulationAction[] = [];

  // Initial navigation action
  actions.push({
    id: generateId(),
    type: "navigate",
    timestamp: currentTime,
    duration: 1500,
    description: `Navigating to ${targetUrl}`,
    agentThought: `Let me load the application and see what we're working with`,
  });
  currentTime += 1500 + behavior.pauseBetweenActions;

  // Add actions from selected scenarios
  for (const scenario of scenarios) {
    for (const baseAction of scenario.actions) {
      const action: SimulationAction = {
        ...baseAction,
        id: generateId(),
        timestamp: currentTime,
        duration: adjustDurationForBehavior(
          baseAction.duration,
          baseAction.type,
          behavior
        ),
      };

      actions.push(action);
      currentTime += action.duration + behavior.pauseBetweenActions;
    }
  }

  // Final screenshot
  actions.push({
    id: generateId(),
    type: "screenshot",
    timestamp: currentTime,
    duration: 500,
    description: "Capturing final state",
    agentThought: "Taking a screenshot of the final page state for the report",
  });

  return {
    id: generateId(),
    agentId,
    agentName,
    actions,
    startTime: Date.now(),
  };
}

function selectScenariosForAgent(
  agentName: string,
  scenarioIds?: string[]
): TestScenario[] {
  // If specific scenarios requested, use those
  if (scenarioIds && scenarioIds.length > 0) {
    return COMMON_TEST_SCENARIOS.filter((s) => scenarioIds.includes(s.id));
  }

  // Otherwise, select based on agent specialty
  const agentScenarios: Record<string, string[]> = {
    Sarah: ["navigation-test", "form-test"],
    Marcus: ["form-test", "navigation-test"],
    Ahmed: ["accessibility-test", "navigation-test"],
    Lin: ["responsive-test", "navigation-test"],
    Diego: ["error-handling-test", "form-test"],
    Emma: ["navigation-test", "form-test"],
  };

  const selectedIds = agentScenarios[agentName] || ["navigation-test"];
  return COMMON_TEST_SCENARIOS.filter((s) => selectedIds.includes(s.id));
}

function adjustDurationForBehavior(
  baseDuration: number,
  actionType: string,
  behavior: AgentBehaviorProfile
): number {
  const speedMultiplier = {
    slow: 1.5,
    normal: 1,
    fast: 0.6,
  }[behavior.movementSpeed];

  // Typing uses its own speed
  if (actionType === "type") {
    return baseDuration;
  }

  return Math.round(baseDuration * speedMultiplier);
}

/**
 * Calculate the estimated duration of a simulation sequence
 */
export function calculateSequenceDuration(
  sequence: SimulationSequence
): number {
  if (sequence.actions.length === 0) return 0;

  const lastAction = sequence.actions[sequence.actions.length - 1];
  return lastAction.timestamp + lastAction.duration;
}

/**
 * Get the action at a specific time in the sequence
 */
export function getActionAtTime(
  sequence: SimulationSequence,
  time: number
): SimulationAction | null {
  for (let i = sequence.actions.length - 1; i >= 0; i--) {
    const action = sequence.actions[i];
    if (
      time >= action.timestamp &&
      time <= action.timestamp + action.duration
    ) {
      return action;
    }
  }
  return null;
}

/**
 * Get progress percentage at a specific time
 */
export function getProgressAtTime(
  sequence: SimulationSequence,
  time: number
): number {
  const totalDuration = calculateSequenceDuration(sequence);
  if (totalDuration === 0) return 0;
  return Math.min(100, Math.round((time / totalDuration) * 100));
}
