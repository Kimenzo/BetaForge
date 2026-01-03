"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  SimulationState,
  SimulationConfig,
  SimulationSequence,
  SimulationAction,
  Position,
} from "@/lib/simulation/types";
import {
  generateSimulationSequence,
  generateCursorPath,
  calculateSequenceDuration,
  getActionAtTime,
  getProgressAtTime,
} from "@/lib/simulation/engine";
import { AGENT_BEHAVIORS } from "@/lib/simulation/types";

interface UseSimulationReturn {
  state: SimulationState;
  sequence: SimulationSequence | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  seekTo: (progress: number) => void;
  totalDuration: number;
  elapsedTime: number;
}

const INITIAL_STATE: SimulationState = {
  status: "idle",
  currentActionIndex: -1,
  currentAction: null,
  cursor: {
    position: { x: 100, y: 100 },
    isClicking: false,
    isTyping: false,
    isVisible: false,
  },
  viewport: {
    width: 1280,
    height: 720,
    scrollX: 0,
    scrollY: 0,
  },
  highlightedElement: null,
  speed: 1,
  progress: 0,
};

export function useSimulation(config: SimulationConfig): UseSimulationReturn {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);
  const [sequence, setSequence] = useState<SimulationSequence | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const cursorPathRef = useRef<Position[]>([]);
  const cursorPathIndexRef = useRef<number>(0);

  // Initialize sequence when config changes
  useEffect(() => {
    const newSequence = generateSimulationSequence(
      config.agentId,
      config.agentName,
      config.targetUrl
    );
    setSequence(newSequence);
    
    // Reset state
    setState({
      ...INITIAL_STATE,
      viewport: {
        width: config.viewport?.width || 1280,
        height: config.viewport?.height || 720,
        scrollX: 0,
        scrollY: 0,
      },
      speed: config.speed || 1,
    });
    setElapsedTime(0);

    if (config.autoStart) {
      // Small delay to allow component to mount
      setTimeout(() => startSimulation(), 100);
    }
  }, [config.agentId, config.agentName, config.targetUrl]);

  const totalDuration = sequence ? calculateSequenceDuration(sequence) : 0;

  // Main animation loop
  const animate = useCallback(
    (timestamp: number) => {
      if (!sequence || state.status !== "running") return;

      const elapsed = (timestamp - startTimeRef.current) * state.speed;
      setElapsedTime(elapsed);

      // Get current action
      const currentAction = getActionAtTime(sequence, elapsed);
      const progress = getProgressAtTime(sequence, elapsed);

      // Update cursor position based on action
      let newCursorState = { ...state.cursor };
      
      if (currentAction) {
        const actionProgress =
          (elapsed - currentAction.timestamp) / currentAction.duration;

        // Handle different action types
        switch (currentAction.type) {
          case "click":
          case "double-click":
            if (currentAction.position) {
              // Move cursor to target
              if (cursorPathRef.current.length === 0 && actionProgress < 0.5) {
                const behavior = AGENT_BEHAVIORS[config.agentName] || AGENT_BEHAVIORS.Emma;
                cursorPathRef.current = generateCursorPath(
                  state.cursor.position,
                  currentAction.position,
                  behavior.movementStyle
                );
                cursorPathIndexRef.current = 0;
              }

              if (cursorPathRef.current.length > 0 && actionProgress < 0.7) {
                const pathProgress = actionProgress / 0.7;
                const pathIndex = Math.floor(
                  pathProgress * (cursorPathRef.current.length - 1)
                );
                newCursorState.position =
                  cursorPathRef.current[Math.min(pathIndex, cursorPathRef.current.length - 1)];
              } else {
                newCursorState.position = currentAction.position;
              }

              // Click animation
              newCursorState.isClicking = actionProgress > 0.7 && actionProgress < 0.9;
            }
            break;

          case "hover":
            if (currentAction.position) {
              if (cursorPathRef.current.length === 0) {
                const behavior = AGENT_BEHAVIORS[config.agentName] || AGENT_BEHAVIORS.Emma;
                cursorPathRef.current = generateCursorPath(
                  state.cursor.position,
                  currentAction.position,
                  behavior.movementStyle
                );
              }

              const pathIndex = Math.floor(
                actionProgress * (cursorPathRef.current.length - 1)
              );
              newCursorState.position =
                cursorPathRef.current[Math.min(pathIndex, cursorPathRef.current.length - 1)];
            }
            break;

          case "type":
            newCursorState.isTyping = true;
            newCursorState.isClicking = false;
            break;

          case "scroll":
            // Scroll doesn't need cursor movement
            newCursorState.isClicking = false;
            newCursorState.isTyping = false;
            break;

          default:
            newCursorState.isClicking = false;
            newCursorState.isTyping = false;
        }

        newCursorState.isVisible = true;
      }

      // Clear cursor path when action changes
      const actionIndex = sequence.actions.findIndex((a) => a.id === currentAction?.id);
      if (actionIndex !== state.currentActionIndex) {
        cursorPathRef.current = [];
        cursorPathIndexRef.current = 0;
      }

      // Check if simulation is complete
      if (elapsed >= totalDuration) {
        setState((prev) => ({
          ...prev,
          status: "completed",
          progress: 100,
          currentAction: null,
          currentActionIndex: -1,
          cursor: { ...prev.cursor, isClicking: false, isTyping: false },
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        cursor: newCursorState,
        currentAction,
        currentActionIndex: actionIndex,
        progress,
        highlightedElement: currentAction?.element?.selector || null,
      }));

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [sequence, state.status, state.speed, state.cursor, state.currentActionIndex, config.agentName, totalDuration]
  );

  const startSimulation = useCallback(() => {
    if (!sequence) return;

    setState((prev) => ({
      ...prev,
      status: "loading",
    }));

    // Brief loading state
    setTimeout(() => {
      startTimeRef.current = performance.now();
      setState((prev) => ({
        ...prev,
        status: "running",
        cursor: { ...prev.cursor, isVisible: true },
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 500);
  }, [sequence, animate]);

  const pauseSimulation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    pausedTimeRef.current = performance.now();
    setState((prev) => ({ ...prev, status: "paused" }));
  }, []);

  const resumeSimulation = useCallback(() => {
    if (state.status !== "paused") return;
    
    // Adjust start time to account for pause duration
    const pauseDuration = performance.now() - pausedTimeRef.current;
    startTimeRef.current += pauseDuration;
    
    setState((prev) => ({ ...prev, status: "running" }));
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [state.status, animate]);

  const stopSimulation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setState(INITIAL_STATE);
    setElapsedTime(0);
    cursorPathRef.current = [];
    cursorPathIndexRef.current = 0;
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed: Math.max(0.25, Math.min(4, speed)) }));
  }, []);

  const seekTo = useCallback(
    (progress: number) => {
      if (!sequence) return;
      
      const targetTime = (progress / 100) * totalDuration;
      setElapsedTime(targetTime);
      startTimeRef.current = performance.now() - targetTime / state.speed;
      
      const currentAction = getActionAtTime(sequence, targetTime);
      const actionIndex = currentAction
        ? sequence.actions.findIndex((a) => a.id === currentAction.id)
        : -1;

      setState((prev) => ({
        ...prev,
        progress,
        currentAction,
        currentActionIndex: actionIndex,
        cursor: {
          ...prev.cursor,
          position: currentAction?.position || prev.cursor.position,
        },
      }));
    },
    [sequence, totalDuration, state.speed]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    state,
    sequence,
    start: startSimulation,
    pause: pauseSimulation,
    resume: resumeSimulation,
    stop: stopSimulation,
    setSpeed,
    seekTo,
    totalDuration,
    elapsedTime,
  };
}
