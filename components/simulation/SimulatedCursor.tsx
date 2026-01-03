"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Position, CursorStyle, SimulationActionType } from "@/lib/simulation/types";

interface SimulatedCursorProps {
  position: Position;
  isVisible: boolean;
  isClicking: boolean;
  isTyping: boolean;
  actionType?: SimulationActionType;
  color?: string;
  agentName?: string;
}

export function SimulatedCursor({
  position,
  isVisible,
  isClicking,
  isTyping,
  actionType,
  color = "#8B5CF6",
  agentName,
}: SimulatedCursorProps) {
  const [clickRipples, setClickRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleIdRef = useRef(0);

  // Add click ripple effect
  useEffect(() => {
    if (isClicking) {
      const newRipple = {
        id: rippleIdRef.current++,
        x: position.x,
        y: position.y,
      };
      setClickRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setClickRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }
  }, [isClicking, position.x, position.y]);

  const getCursorType = (): CursorStyle["type"] => {
    switch (actionType) {
      case "click":
      case "double-click":
      case "hover":
        return "pointer";
      case "type":
        return "text";
      case "drag":
        return isClicking ? "grabbing" : "grab";
      default:
        return "default";
    }
  };

  const cursorType = getCursorType();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Click ripple effects */}
          {clickRipples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div
                className="w-8 h-8 rounded-full border-2"
                style={{ borderColor: color }}
              />
            </motion.div>
          ))}

          {/* Main cursor */}
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{
              left: position.x,
              top: position.y,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: isClicking ? 0.85 : 1,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
              },
            }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {/* Cursor SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`-ml-1 -mt-1 drop-shadow-lg transition-transform ${
                isClicking ? "scale-90" : ""
              }`}
            >
              {cursorType === "pointer" ? (
                // Pointer finger cursor
                <g transform="translate(2, 0)">
                  <path
                    d="M10 2L10 14L14 10L18 10L10 2Z"
                    fill={color}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <circle cx="14" cy="14" r="3" fill={color} stroke="white" strokeWidth="1" />
                </g>
              ) : cursorType === "text" ? (
                // I-beam text cursor
                <g>
                  <line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="2" />
                  <line x1="8" y1="4" x2="16" y2="4" stroke={color} strokeWidth="2" />
                  <line x1="8" y1="20" x2="16" y2="20" stroke={color} strokeWidth="2" />
                </g>
              ) : cursorType === "grab" || cursorType === "grabbing" ? (
                // Hand cursor
                <g transform="translate(0, 2)">
                  <path
                    d="M8 12V8C8 7.45 8.45 7 9 7C9.55 7 10 7.45 10 8V12M10 8V5C10 4.45 10.45 4 11 4C11.55 4 12 4.45 12 5V8M12 8V5C12 4.45 12.45 4 13 4C13.55 4 14 4.45 14 5V8M14 8V6C14 5.45 14.45 5 15 5C15.55 5 16 5.45 16 6V14C16 17 14 19 11 19C8 19 6 17 6 14V10C6 9.45 6.45 9 7 9C7.55 9 8 9.45 8 10"
                    fill={cursorType === "grabbing" ? color : "white"}
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>
              ) : (
                // Default arrow cursor
                <path
                  d="M5 2L5 18L9 14L14 14L5 2Z"
                  fill={color}
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              )}
            </svg>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                className="absolute top-6 left-4 flex items-center gap-1 px-2 py-1 rounded-full bg-void-elevated/90 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
              </motion.div>
            )}

            {/* Agent name badge */}
            {agentName && (
              <motion.div
                className="absolute -top-6 left-0 whitespace-nowrap px-2 py-0.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: color }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {agentName}
              </motion.div>
            )}
          </motion.div>

          {/* Cursor trail effect */}
          <motion.div
            className="absolute pointer-events-none rounded-full opacity-20"
            style={{
              left: position.x - 8,
              top: position.y - 8,
              width: 16,
              height: 16,
              backgroundColor: color,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.1, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// Highlight overlay for elements being interacted with
interface ElementHighlightProps {
  selector: string;
  isActive: boolean;
  color?: string;
}

export function ElementHighlight({
  selector,
  isActive,
  color = "#8B5CF6",
}: ElementHighlightProps) {
  // In a real implementation, this would calculate the element's position
  // from the iframe. For now, we'll use a mock bounding box.
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute pointer-events-none rounded-lg"
          style={{
            border: `2px dashed ${color}`,
            backgroundColor: `${color}15`,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute -top-6 left-0 px-2 py-0.5 rounded text-xs font-mono text-white"
            style={{ backgroundColor: color }}
          >
            {selector}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SimulatedCursor;
