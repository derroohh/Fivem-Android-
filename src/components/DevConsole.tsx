import React, { useState, useEffect, useRef } from "react";
import { Terminal, Command, Send, HelpCircle, X, ChevronDown } from "lucide-react";

interface DevConsoleProps {
  onExecuteCommand: (cmd: string) => string;
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  id: string;
  text: string;
  type: "info" | "success" | "error" | "command";
  time: string;
}

export default function DevConsole({ onExecuteCommand, isOpen, onClose }: DevConsoleProps) {
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", text: "[    0] Initializing CitizenFX companion subsystems...", type: "info", time: "09:16:57" },
    { id: "2", text: "[   15] Loading game-build asset structures for Android ARM64...", type: "info", time: "09:16:57" },
    { id: "3", text: "[   48] Found 12.42 GB cached high-res textures & meshes.", type: "success", time: "09:16:58" },
    { id: "4", text: "[  105] WebSocket channel handshaked successfully with cfx.re load-balancer.", type: "success", time: "09:16:58" },
    { id: "5", text: "[  148] Authenticating Cfx Client License with cached Discord token...", type: "info", time: "09:16:58" },
    { id: "6", text: "[  204] Login completed. User identified as Cfx_Android_Player", type: "success", time: "09:16:59" },
    { id: "7", text: "Ready. Type '/help' for a full breakdown of active platform cheat commands.", type: "info", time: "09:16:59" }
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const trimmed = inputVal.trim();
    const commandLog: LogEntry = {
      id: `cmd-${Date.now()}`,
      text: `> ${trimmed}`,
      type: "command",
      time: new Date().toLocaleTimeString()
    };

    setLogs(prev => [...prev, commandLog]);
    setInputVal("");

    // Execute through coordinator
    const responseText = onExecuteCommand(trimmed);

    setTimeout(() => {
      let logType: "info" | "success" | "error" = "info";
      if (responseText.toLowerCase().includes("error") || responseText.toLowerCase().includes("fail")) {
        logType = "error";
      } else if (responseText.toLowerCase().includes("success") || responseText.toLowerCase().includes("identif")) {
        logType = "success";
      }

      const responseLog: LogEntry = {
        id: `resp-${Date.now()}`,
        text: responseText,
        type: logType,
        time: new Date().toLocaleTimeString()
      };
      setLogs(prev => [...prev, responseLog]);
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div id="dev-console" className="fixed top-0 left-0 right-0 z-50 bg-[#070709]/98 border-b border-fivem-orange/40 shadow-2xl transition-all duration-300 max-h-[44vh] overflow-hidden flex flex-col font-mono text-xs">
      {/* Console Top Header */}
      <div className="bg-black p-3 border-b border-fivem-border/40 flex justify-between items-center text-[10px] text-gray-500 font-bold shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-fivem-orange animate-pulse" />
          <span className="text-white">CFX.RE MOBILE DEVELOPER CONSOLE (BUILD b115)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">FPS: 60.00 | PING: 21ms</span>
          <button 
            id="hide-dev-console"
            onClick={onClose} 
            className="text-gray-400 hover:text-red-400 font-sans transition-colors cursor-pointer"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Terminal logs list */}
      <div className="flex-grow overflow-y-auto p-4 space-y-1 bg-[#09090c] text-gray-300 h-44">
        {logs.map(log => (
          <div 
            id={`conlog-${log.id}`}
            key={log.id} 
            className={`leading-relaxed break-all ${
              log.type === "success" ? "text-emerald-400" :
              log.type === "error" ? "text-red-400 font-bold" :
              log.type === "command" ? "text-fivem-orange font-semibold" : "text-gray-300"
            }`}
          >
            <span className="text-gray-600 text-[10px] select-none mr-2">[{log.time}]</span>
            {log.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Console keyboard trigger form */}
      <form onSubmit={handleSubmit} className="bg-black/80 border-t border-fivem-border/60 p-2 flex items-center gap-2 shrink-0">
        <Command size={12} className="text-fivem-orange" />
        <input
          id="con-input"
          type="text"
          placeholder="Enter cheat code (e.g. /setuser Franklin, /ping 15, /help)..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-grow bg-transparent border-none outline-none text-white text-xs placeholder-gray-700 font-mono"
          autoFocus
        />
        <button 
          id="con-submit"
          type="submit" 
          className="text-[10px] bg-fivem-surface hover:bg-fivem-orange/20 border border-fivem-border px-2.5 py-1 text-gray-400 hover:text-white rounded transition-all cursor-pointer"
        >
          EXECUTE
        </button>
      </form>
    </div>
  );
}
