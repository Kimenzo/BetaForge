// ========================
// Visual Simulation Types
// ========================

export type SimulationActionType =
  | "navigate"
  | "click"
  | "double-click"
  | "right-click"
  | "hover"
  | "scroll"
  | "type"
  | "select"
  | "drag"
  | "screenshot"
  | "wait"
  | "assert";

export interface Position {
  x: number;
  y: number;
}

export interface SimulationAction {
  id: string;
  type: SimulationActionType;
  timestamp: number;
  duration: number; // How long to perform this action (ms)
  position?: Position;
  endPosition?: Position; // For drag actions
  element?: {
    selector: string;
    tagName: string;
    text?: string;
    placeholder?: string;
    ariaLabel?: string;
  };
  value?: string; // For type actions
  scrollDelta?: { x: number; y: number }; // For scroll actions
  description: string; // Human-readable description
  agentThought?: string; // Agent's reasoning for this action
}

export interface SimulationSequence {
  id: string;
  agentId: string;
  agentName: string;
  actions: SimulationAction[];
  startTime: number;
  endTime?: number;
}

export type SimulationStatus =
  | "idle"
  | "loading"
  | "running"
  | "paused"
  | "completed"
  | "error";

export interface SimulationState {
  status: SimulationStatus;
  currentActionIndex: number;
  currentAction: SimulationAction | null;
  cursor: {
    position: Position;
    isClicking: boolean;
    isTyping: boolean;
    isVisible: boolean;
  };
  viewport: {
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
  };
  highlightedElement: string | null;
  speed: number; // 0.5x, 1x, 2x, etc.
  progress: number; // 0-100
  error?: string;
}

export interface SimulationConfig {
  targetUrl: string;
  agentId: string;
  agentName: string;
  viewport?: {
    width: number;
    height: number;
  };
  speed?: number;
  autoStart?: boolean;
}

export interface CursorStyle {
  type: "default" | "pointer" | "text" | "grab" | "grabbing" | "not-allowed";
  color: string;
}

// Events emitted during simulation
export type SimulationEventType =
  | "simulation:start"
  | "simulation:pause"
  | "simulation:resume"
  | "simulation:complete"
  | "simulation:error"
  | "action:start"
  | "action:complete"
  | "bug:found"
  | "screenshot:taken";

export interface SimulationEvent {
  type: SimulationEventType;
  timestamp: number;
  data?: Record<string, unknown>;
}

// Agent-specific simulation behaviors
export interface AgentBehaviorProfile {
  movementSpeed: "slow" | "normal" | "fast";
  movementStyle: "careful" | "direct" | "erratic";
  pauseBetweenActions: number; // ms
  typingSpeed: number; // chars per second
  scrollBehavior: "smooth" | "quick" | "page-by-page";
  focusAreas: string[]; // CSS selectors or element types to focus on
  avoidAreas: string[]; // Areas to avoid (e.g., ads)
}

// Predefined agent behaviors matching BetaForge personas
export const AGENT_BEHAVIORS: Record<string, AgentBehaviorProfile> = {
  Sarah: {
    movementSpeed: "slow",
    movementStyle: "careful",
    pauseBetweenActions: 1500,
    typingSpeed: 40,
    scrollBehavior: "smooth",
    focusAreas: ["button", "a", "input", "[role='button']", "form"],
    avoidAreas: [],
  },
  Marcus: {
    movementSpeed: "fast",
    movementStyle: "direct",
    pauseBetweenActions: 500,
    typingSpeed: 120,
    scrollBehavior: "quick",
    focusAreas: ["input[type='text']", "textarea", "[contenteditable]"],
    avoidAreas: [],
  },
  Ahmed: {
    movementSpeed: "normal",
    movementStyle: "careful",
    pauseBetweenActions: 2000,
    typingSpeed: 60,
    scrollBehavior: "smooth",
    focusAreas: ["[role]", "[aria-label]", "[tabindex]", "button", "a"],
    avoidAreas: [],
  },
  Lin: {
    movementSpeed: "normal",
    movementStyle: "direct",
    pauseBetweenActions: 800,
    typingSpeed: 80,
    scrollBehavior: "page-by-page",
    focusAreas: ["button", ".btn", "[role='button']", "nav"],
    avoidAreas: [],
  },
  Diego: {
    movementSpeed: "fast",
    movementStyle: "erratic",
    pauseBetweenActions: 300,
    typingSpeed: 150,
    scrollBehavior: "quick",
    focusAreas: ["form", "input", "button", "[onclick]"],
    avoidAreas: [],
  },
  Emma: {
    movementSpeed: "normal",
    movementStyle: "direct",
    pauseBetweenActions: 1000,
    typingSpeed: 70,
    scrollBehavior: "smooth",
    focusAreas: ["button", "a", "input", "img"],
    avoidAreas: [],
  },
};
