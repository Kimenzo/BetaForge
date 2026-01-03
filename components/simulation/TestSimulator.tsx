"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Settings,
  ChevronDown,
  Bug,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Zap,
  Eye,
  Clock,
  MousePointer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulatedCursor } from "./SimulatedCursor";
import { useSimulation } from "@/lib/hooks/useSimulation";
import type { SimulationConfig, SimulationAction } from "@/lib/simulation/types";
import { AGENTS } from "@/lib/agents";

interface TestSimulatorProps {
  targetUrl: string;
  agentId: string;
  agentName: string;
  onBugFound?: (bug: { title: string; description: string }) => void;
  onComplete?: () => void;
  onClose?: () => void;
}

export function TestSimulator({
  targetUrl,
  agentId,
  agentName,
  onBugFound,
  onComplete,
  onClose,
}: TestSimulatorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const config: SimulationConfig = {
    targetUrl,
    agentId,
    agentName,
    viewport: { width: 1280, height: 720 },
    autoStart: false,
  };

  const {
    state,
    sequence,
    start,
    pause,
    resume,
    stop,
    setSpeed,
    seekTo,
    totalDuration,
    elapsedTime,
  } = useSimulation(config);

  const agent = AGENTS.find((a) => a.name === agentName);
  const agentColor = agent?.color || "#8B5CF6";

  // Handle completion
  useEffect(() => {
    if (state.status === "completed" && onComplete) {
      onComplete();
    }
  }, [state.status, onComplete]);

  // Format time display
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (state.status === "idle" || state.status === "completed") {
      start();
    } else if (state.status === "running") {
      pause();
    } else if (state.status === "paused") {
      resume();
    }
  };

  const handleRestart = () => {
    stop();
    setTimeout(() => start(), 100);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Speed options
  const speedOptions = [0.5, 1, 1.5, 2, 4];

  return (
    <div
      ref={containerRef}
      className={`relative bg-void-black rounded-2xl overflow-hidden border border-white/10 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-void-elevated/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${agentColor}20` }}
          >
            {agent?.name === "Sarah"
              ? "🔍"
              : agent?.name === "Marcus"
              ? "⚡"
              : agent?.name === "Ahmed"
              ? "♿"
              : agent?.name === "Lin"
              ? "📱"
              : agent?.name === "Diego"
              ? "🔥"
              : "✨"}
          </div>
          <div>
            <h3 className="font-medium text-ghost-white">{agentName}</h3>
            <p className="text-xs text-phantom-gray">{agent?.specialization}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
              state.status === "running"
                ? "bg-electric-cyan/20 text-electric-cyan"
                : state.status === "paused"
                ? "bg-ember-orange/20 text-ember-orange"
                : state.status === "completed"
                ? "bg-quantum-green/20 text-quantum-green"
                : state.status === "error"
                ? "bg-crimson-red/20 text-crimson-red"
                : "bg-phantom-gray/20 text-phantom-gray"
            }`}
          >
            {state.status === "running" && (
              <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-pulse" />
            )}
            {state.status === "loading" && <Loader2 className="w-3 h-3 animate-spin" />}
            {state.status.charAt(0).toUpperCase() + state.status.slice(1)}
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-phantom-gray hover:text-ghost-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex">
        {/* Simulation viewport */}
        <div className="flex-1 relative">
          {/* Preview container */}
          <div
            className="relative bg-gray-900 overflow-hidden"
            style={{
              aspectRatio: "16/9",
            }}
          >
            {/* Loading overlay */}
            <AnimatePresence>
              {(state.status === "idle" || state.status === "loading") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-void-black/90 backdrop-blur-sm"
                >
                  {state.status === "loading" ? (
                    <>
                      <Loader2 className="w-12 h-12 text-neural-bright animate-spin mb-4" />
                      <p className="text-ghost-white font-medium">Loading simulation...</p>
                      <p className="text-phantom-gray text-sm mt-1">
                        Preparing {agentName}&apos;s test environment
                      </p>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6"
                        style={{ backgroundColor: `${agentColor}20` }}
                      >
                        {agent?.name === "Sarah"
                          ? "🔍"
                          : agent?.name === "Marcus"
                          ? "⚡"
                          : agent?.name === "Ahmed"
                          ? "♿"
                          : agent?.name === "Lin"
                          ? "📱"
                          : agent?.name === "Diego"
                          ? "🔥"
                          : "✨"}
                      </div>
                      <h3 className="text-xl font-bold text-ghost-white mb-2">
                        Ready to Test
                      </h3>
                      <p className="text-phantom-gray text-center max-w-sm mb-6">
                        Watch as {agentName} explores your application with realistic
                        interactions
                      </p>
                      <Button
                        onClick={start}
                        className="bg-neural hover:bg-neural-bright text-void-black font-medium px-6"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Simulation
                      </Button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Iframe with the target app */}
            <iframe
              ref={iframeRef}
              src={targetUrl}
              title={`Preview of ${targetUrl}`}
              className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
                state.status !== "idle" && state.status !== "loading" ? "opacity-100" : "opacity-30"
              }`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeError(true)}
            />

            {/* Iframe error fallback */}
            {iframeError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-void-black/95">
                <AlertCircle className="w-12 h-12 text-ember-orange mb-4" />
                <p className="text-ghost-white font-medium">Unable to load preview</p>
                <p className="text-phantom-gray text-sm mt-1 max-w-sm text-center">
                  The target URL may have X-Frame-Options restrictions. The simulation will
                  continue with a placeholder view.
                </p>
              </div>
            )}

            {/* Cursor overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <SimulatedCursor
                position={state.cursor.position}
                isVisible={state.cursor.isVisible}
                isClicking={state.cursor.isClicking}
                isTyping={state.cursor.isTyping}
                actionType={state.currentAction?.type}
                color={agentColor}
                agentName={state.status === "running" ? agentName : undefined}
              />

              {/* Element highlight */}
              {state.highlightedElement && state.currentAction?.position && (
                <motion.div
                  className="absolute rounded-lg pointer-events-none"
                  style={{
                    left: state.currentAction.position.x - 50,
                    top: state.currentAction.position.y - 20,
                    width: 150,
                    height: 40,
                    border: `2px dashed ${agentColor}`,
                    backgroundColor: `${agentColor}10`,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                />
              )}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-void-elevated">
              <motion.div
                className="h-full bg-gradient-to-r from-neural to-electric-cyan"
                style={{ width: `${state.progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Controls bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-void-elevated/50 border-t border-white/5">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-lg hover:bg-white/10 text-ghost-white transition-colors"
                title={state.status === "running" ? "Pause" : "Play"}
              >
                {state.status === "running" ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              {/* Restart */}
              <button
                onClick={handleRestart}
                className="p-2 rounded-lg hover:bg-white/10 text-phantom-gray hover:text-ghost-white transition-colors"
                title="Restart simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Time display */}
              <span className="text-sm text-phantom-gray ml-2">
                {formatTime(elapsedTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Speed selector */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-phantom-gray hover:text-ghost-white transition-colors text-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {state.speed}x
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-full right-0 mb-2 py-2 bg-void-elevated rounded-lg border border-white/10 shadow-xl min-w-[100px]"
                    >
                      {speedOptions.map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            setSpeed(speed);
                            setShowSettings(false);
                          }}
                          className={`w-full px-4 py-1.5 text-left text-sm hover:bg-white/10 transition-colors ${
                            state.speed === speed
                              ? "text-neural-bright"
                              : "text-phantom-gray"
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mute toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg hover:bg-white/10 text-phantom-gray hover:text-ghost-white transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-white/10 text-phantom-gray hover:text-ghost-white transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action panel sidebar */}
        <div className="w-80 border-l border-white/5 bg-void-elevated/30 flex flex-col">
          {/* Current action display */}
          <div className="p-4 border-b border-white/5">
            <h4 className="text-xs font-medium text-phantom-gray uppercase tracking-wider mb-3">
              Current Action
            </h4>
            <AnimatePresence mode="wait">
              {state.currentAction ? (
                <motion.div
                  key={state.currentAction.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass rounded-xl p-4 border border-white/5"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${agentColor}20` }}
                    >
                      {state.currentAction.type === "click" && (
                        <MousePointer className="w-4 h-4" style={{ color: agentColor }} />
                      )}
                      {state.currentAction.type === "type" && (
                        <span style={{ color: agentColor }}>⌨️</span>
                      )}
                      {state.currentAction.type === "scroll" && (
                        <span style={{ color: agentColor }}>📜</span>
                      )}
                      {state.currentAction.type === "hover" && (
                        <Eye className="w-4 h-4" style={{ color: agentColor }} />
                      )}
                      {state.currentAction.type === "navigate" && (
                        <span style={{ color: agentColor }}>🌐</span>
                      )}
                      {state.currentAction.type === "wait" && (
                        <Clock className="w-4 h-4" style={{ color: agentColor }} />
                      )}
                      {state.currentAction.type === "screenshot" && (
                        <span style={{ color: agentColor }}>📸</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ghost-white">
                        {state.currentAction.description}
                      </p>
                      {state.currentAction.element && (
                        <p className="text-xs text-phantom-gray mt-1 font-mono truncate">
                          {state.currentAction.element.selector}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Agent thought bubble */}
                  {state.currentAction.agentThought && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-xs text-phantom-gray italic">
                        💭 &quot;{state.currentAction.agentThought}&quot;
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 text-phantom-gray text-sm"
                >
                  {state.status === "completed"
                    ? "Test completed!"
                    : "Waiting to start..."}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action timeline */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="text-xs font-medium text-phantom-gray uppercase tracking-wider mb-3">
              Action Timeline
            </h4>
            <div className="space-y-2">
              {sequence?.actions.map((action, index) => {
                const isPast = index < state.currentActionIndex;
                const isCurrent = index === state.currentActionIndex;

                return (
                  <div
                    key={action.id}
                    className={`flex items-start gap-2 py-2 px-3 rounded-lg transition-all ${
                      isCurrent
                        ? "bg-white/10 border border-white/10"
                        : isPast
                        ? "opacity-50"
                        : "opacity-30"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isPast
                          ? "bg-quantum-green/20"
                          : isCurrent
                          ? "bg-electric-cyan/20"
                          : "bg-white/5"
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-3 h-3 text-quantum-green" />
                      ) : isCurrent ? (
                        <motion.div
                          className="w-2 h-2 rounded-full bg-electric-cyan"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-phantom-gray" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs truncate ${
                          isCurrent ? "text-ghost-white" : "text-phantom-gray"
                        }`}
                      >
                        {action.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bug findings (would be populated during test) */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-phantom-gray uppercase tracking-wider">
                Findings
              </h4>
              <span className="text-xs text-ember-orange flex items-center gap-1">
                <Bug className="w-3 h-3" />0 bugs
              </span>
            </div>
            <p className="text-xs text-phantom-gray/60 text-center py-3">
              No issues found yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestSimulator;
