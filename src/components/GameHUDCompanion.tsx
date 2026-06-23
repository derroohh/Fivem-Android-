import React, { useState, useEffect, useRef } from "react";
import { 
  Wifi, 
  Cpu, 
  MapPin, 
  Coins, 
  Briefcase, 
  ShieldAlert, 
  MessageSquare, 
  Radio, 
  LogOut, 
  Send, 
  TrendingUp, 
  Navigation,
  Clock,
  UserCheck,
  CheckCircle,
  Bell,
  RefreshCw
} from "lucide-react";
import { Server } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface GameHUDCompanionProps {
  server: Server;
  settingsPing: number;
  userName: string;
  avatarUrl: string;
  onDisconnect: () => void;
  isOfflineMode?: boolean;
}

interface InGameNotice {
  id: string;
  title: string;
  text: string;
  time: string;
  type: "police" | "economy" | "system" | "admin";
}

interface MiniMapPoint {
  x: number;
  y: number;
  name: string;
  type: string;
}

const GTA_MINIMAP_POINTS: MiniMapPoint[] = [
  { x: 231, y: 154, name: "Legion Square Main Plaza", type: "hub" },
  { x: 412, y: 84, name: "Los Santos Police Department", type: "police" },
  { x: 192, y: 310, name: "Tuner Drift Custom Shop", type: "tuner" },
  { x: 89, y: 440, name: "Vinewood Luxury Hideout", type: "home" },
  { x: 504, y: 220, name: "Pacific Standard bank Vault", type: "bank" }
];

const MOCK_GAME_CHATS = [
  { id: "gc-1", sender: "Admin_Tony", content: "[OOC] Please respect character rules. Serious civil limits strictly enforced today.", time: "09:17" },
  { id: "gc-2", sender: "AE86_Takahashi", content: "[Twitter] Anyone buying a customized drift tuned RX7? Meet at Legion Square tuner shop.", time: "09:18" },
  { id: "gc-3", sender: "LSPD_Hutch", content: "[Dispatch] Code 10-31 Active: High speed pursuit near Vinewood Boulevard. Officers stay clear.", time: "09:18" }
];

const LOADING_STEPS_ONLINE = [
  "Connecting to cfx.re load-balancer gateway ...",
  "Sending secure Cfx.re mobile authentication tokens ...",
  "Handshaking voice server VOIP channels ...",
  "Synchronizing client download state: 412 custom server scripts ...",
  "Streaming texture directory maps (124/491 MB downloaded) ...",
  "Parsing customized GTA V physics curves indices ...",
  "Streaming texture directory maps (380/491 MB downloaded) ...",
  "Spawning personal character profile model in Los Santos ..."
];

const LOADING_STEPS_OFFLINE = [
  "Initializing local Vulkan GPU shaders pipeline...",
  "Allocating system RAM heap for offline sandbox execution...",
  "Mounting local game packaging /sdcard/Android/obb/ (12.42 GB)...",
  "Verifying base.obb map tiles & asset hash indexes...",
  "Inlining offline cheats trainer structures (native C++)...",
  "Spawning high-performance loopback graphics backbuffer...",
  "Locking frames pacing to matching Android screen Hertz...",
  "Launching offline singleplayer Los Santos emulator..."
];

export default function GameHUDCompanion({ 
  server, 
  settingsPing, 
  userName, 
  avatarUrl, 
  onDisconnect,
  isOfflineMode = false
}: GameHUDCompanionProps) {
  const steps = isOfflineMode ? LOADING_STEPS_OFFLINE : LOADING_STEPS_ONLINE;
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStepText, setLoadingStepText] = useState(steps[0]);
  const [connectionPhase, setConnectionPhase] = useState<"loading" | "connected">("loading");

  // In-Game dashboard states
  const [activeTab, setActiveTab] = useState<"telemetry" | "map" | "economy" | "chat">("telemetry");
  const [pingValue, setPingValue] = useState(isOfflineMode ? 0 : server.ping + settingsPing);
  const [playerCash, setPlayerCash] = useState(4825);
  const [playerBank, setPlayerBank] = useState(892000);
  const [activeCoords, setActiveCoords] = useState({ x: 231, y: 154 });
  const [activeCoordsName, setActiveCoordsName] = useState(GTA_MINIMAP_POINTS[0].name);
  const [sessionPlaytime, setSessionPlaytime] = useState(0);

  // In-game chats
  const [gameChatInput, setGameChatInput] = useState("");
  const [gameChats, setGameChats] = useState(MOCK_GAME_CHATS);

  // In-game system alerts & dispatches
  const [notices, setNotices] = useState<InGameNotice[]>([
    { id: "n-1", title: isOfflineMode ? "Sandbox Loaded" : "Wage Received", text: isOfflineMode ? "Offline Trainer engine initialized successfully. Press keys to inject cheats." : "+ $1,250 earned from completing mechanic task flow.", time: "Just now", type: isOfflineMode ? "system" : "economy" },
    { id: "n-2", title: isOfflineMode ? "OBB Directory Verified" : "Police Dispatch Alerts", text: isOfflineMode ? "All storage files present. External assets verified successfully." : "Code 3 bank vault intrusion warning triggered in Pacific Vault.", time: "1 min ago", type: isOfflineMode ? "system" : "police" },
    { id: "n-3", title: isOfflineMode ? "Offline Cheat Engine" : "Server Announcement", text: isOfflineMode ? "Ready. Local CPU temperature: 38°C. GPU usage: 42% @ 60 FPS stable." : "Restarting game client thread segments shortly for routine CDN hot-fix.", time: "5 min ago", type: "system" }
  ]);

  const gameChatRef = useRef<HTMLDivElement>(null);

  // Loading process simulation on initial connect
  useEffect(() => {
    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const additive = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(prev + additive, 100);
        
        // Update text labels incrementally based on progress percentages
        const currentStep = Math.floor((next / 100) * steps.length);
        if (currentStep < steps.length && currentStep !== stepIndex) {
          stepIndex = currentStep;
          setLoadingStepText(steps[currentStep]);
        }

        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setConnectionPhase("connected");
          }, 800);
        }
        return next;
      });
    }, 180);

    return () => clearInterval(progressInterval);
  }, [steps]);

  // Playtime Timer counts seconds in background
  useEffect(() => {
    if (connectionPhase !== "connected") return;
    const interval = setInterval(() => {
      setSessionPlaytime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [connectionPhase]);

  // Dynamic Ping fluctuation simulation
  useEffect(() => {
    if (connectionPhase !== "connected") return;
    const interval = setInterval(() => {
      setPingValue(prev => {
        const variance = Math.floor(Math.random() * 5) - 2;
        return Math.max(server.ping + settingsPing + variance, 5);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [connectionPhase, server.ping, settingsPing]);

  // Dispatch warnings generation ticker
  useEffect(() => {
    if (connectionPhase !== "connected") return;
    const interval = setInterval(() => {
      const dispatchAlerts = [
        { title: "Crime Notice", text: "High-speed drift evasion vehicle reported near Vinewood Blvd. Drifters spotted.", type: "police" },
        { title: "Market Index Update", text: "Car dealership restocked 12 new high performance custom tuners.", type: "system" },
        { title: "Tax Assessment", text: "Direct fee debited: -$150 local residence utility costs.", type: "economy" },
        { title: "Cfx System Notice", text: "Resource garbage collection performed: Freed up 412MB memory.", type: "system" }
      ];

      const selectAlert = dispatchAlerts[Math.floor(Math.random() * dispatchAlerts.length)];
      const newNotice: InGameNotice = {
        id: `notice-${Date.now()}`,
        title: selectAlert.title,
        text: selectAlert.text,
        time: "Just now",
        type: selectAlert.type as any
      };

      setNotices(prev => [newNotice, ...prev.slice(0, 4)]);
    }, 15000);

    return () => clearInterval(interval);
  }, [connectionPhase]);

  // Scroll in-game chats
  useEffect(() => {
    gameChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gameChats, activeTab]);

  const handleSendGameChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameChatInput.trim()) return;

    const myGameMsg = {
      id: `gcm-${Date.now()}`,
      sender: userName || "MobileGamer",
      content: gameChatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGameChats(prev => [...prev, myGameMsg]);
    const chattedValue = gameChatInput;
    setGameChatInput("");

    // Simulate in-game players auto replies to user input
    setTimeout(() => {
      let responseOption = "Lmao crazy timing!";
      if (chattedValue.startsWith("/")) {
        responseOption = `[Local Server Client Response] Command executed successfully: ${chattedValue}`;
      } else {
        const clientResponses = [
          `NoPixel_Lover: Yo ${userName || "MobileGamer"}, nice to see you logged on phone!`,
          "Drift_God_101: Tandem tonight? Legion tuner parking lot.",
          "Cop_Underwood: Clear Legion square, patrol speed enforced.",
          "AE86_Takahashi: Selling tuner suspension setups! DMs open."
        ];
        responseOption = clientResponses[Math.floor(Math.random() * clientResponses.length)];
      }

      const responder = responseOption.split(": ")[0];
      const textContent = responseOption.includes(": ") ? responseOption.split(": ")[1] : responseOption;

      const newBotMsg = {
        id: `gcm-bot-${Date.now()}`,
        sender: responder,
        content: textContent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setGameChats(prev => [...prev, newBotMsg]);
    }, 1200);
  };

  const engageJobShift = () => {
    const cashGain = Math.floor(Math.random() * 800) + 400;
    setPlayerCash(prev => prev + cashGain);
    
    const jobNotice: InGameNotice = {
      id: `shift-earn-${Date.now()}`,
      title: "Job Shift Completed",
      text: `Earned + $${cashGain.toLocaleString()} from delivering tuning components across Legion Square!`,
      time: "Just now",
      type: "economy"
    };
    setNotices(prev => [jobNotice, ...prev]);
  };

  const triggerGpsTeleport = (point: MiniMapPoint) => {
    setActiveCoords({ x: point.x, y: point.y });
    setActiveCoordsName(point.name);

    const gpsNotice: InGameNotice = {
      id: `gps-tp-${Date.now()}`,
      title: "GPS Coordinate Set",
      text: `Routing remote character GPS coordinates to: ${point.name}`,
      time: "Just now",
      type: "system"
    };
    setNotices(prev => [gpsNotice, ...prev]);
  };

  const formatPlaytime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. RENDER LOADING CINEMATIC
  if (connectionPhase === "loading") {
    return (
      <div id="loading-companion-screen" className="fixed inset-0 z-50 bg-[#070709] bg-radial from-fivem-surface/40 to-fivem-dark flex flex-col justify-between p-6 md:p-12 scanlines text-white select-none">
        {/* Loading header details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-4xl text-fivem-orange font-bold font-display glow-orange">Cfx</span>
            <span className="h-6 w-px bg-fivem-border" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">Mobile Ingress Gateway</span>
          </div>
          <span className="text-[10px] font-mono text-gray-500">BUILD b3095 // FOR ANDROID COPILOT</span>
        </div>

        {/* Dynamic game graphics loading area */}
        <div className="my-auto max-w-xl mx-auto text-center space-y-6">
          <div className="w-24 h-24 rounded-2xl bg-black/40 border border-fivem-border p-2.5 flex items-center justify-center mx-auto glow-border animate-bounce">
            {server.iconUrl ? (
              <img src={server.iconUrl} alt="" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-3xl">📡</span>
            )}
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold font-display uppercase tracking-tight">Connecting to server</h2>
            <h1 className="text-xl md:text-2xl font-mono font-bold text-fivem-orange truncate max-w-md mx-auto">{server.shortName}</h1>
          </div>

          {/* GTA V-style Loading progress state bar */}
          <div className="space-y-3 pt-4">
            <div className="w-full h-1 bg-fivem-border/60 rounded-full overflow-hidden">
              <div 
                id="loading-progress-bar"
                style={{ width: `${loadingProgress}%` }} 
                className="h-full bg-fivem-orange transition-all duration-300 shadow-[0_0_10px_rgb(255,94,26)]"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span className="text-gray-400 font-semibold truncate max-w-[80%]">{loadingStepText}</span>
              <span className="text-fivem-orange font-bold">{loadingProgress}%</span>
            </div>
          </div>
        </div>

        {/* Loading footer details & Cancel Connection key */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-fivem-border/40 pt-6">
          <p className="text-[10px] text-gray-500 font-mono text-center md:text-left">
            Licensed by Grand Theft Auto V Cfx.re community hub. All rights reserved. Code #832C94.
          </p>
          <button
            id="abort-connection"
            onClick={onDisconnect}
            className="px-5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/30 border border-red-500/35 hover:border-red-500 text-red-400 hover:text-white text-xs font-mono transition-all font-bold cursor-pointer uppercase"
          >
            Cancel Handshake
          </button>
        </div>
      </div>
    );
  }

  // 2. RENDER STUNNING CONNECTED COMPANION INTERFACE
  return (
    <div id="companion-hud-screen" className="fixed inset-0 z-40 bg-[#09090c] flex flex-col h-screen select-none text-white scanlines">
      {/* 2a. Top Telemetry Header Panel */}
      <div className="bg-black/80 border-b border-fivem-border/60 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button 
            id="companion-disconnect-btn"
            onClick={onDisconnect} 
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            title="Disconnect Connection"
          >
            <LogOut size={14} />
          </button>
          <div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/30">
              CONNECTED
            </span>
            <h1 className="text-xs md:text-sm font-bold truncate max-w-[12rem] md:max-w-xs">{server.shortName} mobile co-pilot</h1>
          </div>
        </div>

        {/* Server metrics HUD */}
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1">
            <Clock size={11} className="text-fivem-orange" />
            <span>PLAY TIME:</span>
            <span className="text-white font-bold">{formatPlaytime(sessionPlaytime)}</span>
          </div>

          {isOfflineMode ? (
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold font-mono">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse inline-block select-none mr-1" />
              <span>OFFLINE STANDALONE [0ms LOOPBACK]</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Wifi size={11} className={pingValue < 25 ? "text-emerald-400" : "text-yellow-400"} />
              <span>PING:</span>
              <span className={`font-bold ${pingValue < 25 ? "text-emerald-400" : "text-gray-300"}`}>{pingValue}ms</span>
            </div>
          )}
        </div>
      </div>

      {/* 2b. Split Layout: Main Dashboard (Left) & Active Dispatch Notices logs (Right / Top for Mobile) */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Navigation-driven dashboard panels */}
        <div className="flex-grow flex flex-col overflow-hidden border-r border-fivem-border/40">
          
          {/* Internal Hub tabs */}
          <div className="flex bg-black/40 border-b border-fivem-border/40 p-2 gap-1.5 shrink-0">
            <button
              id="hud-tab-telemetry"
              onClick={() => setActiveTab("telemetry")}
              className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                activeTab === "telemetry" ? "bg-fivem-orange/15 text-fivem-orange border border-fivem-orange/30 font-extrabold" : "text-gray-400 hover:text-white"
              }`}
            >
              <Cpu size={12} />
              Telemetry Status
            </button>
            <button
              id="hud-tab-map"
              onClick={() => setActiveTab("map")}
              className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                activeTab === "map" ? "bg-fivem-orange/15 text-fivem-orange border border-fivem-orange/30 font-extrabold" : "text-gray-400 hover:text-white"
              }`}
            >
              <MapPin size={12} />
              GPS Map
            </button>
            <button
              id="hud-tab-economy"
              onClick={() => setActiveTab("economy")}
              className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                activeTab === "economy" ? "bg-fivem-orange/15 text-fivem-orange border border-fivem-orange/30 font-extrabold" : "text-gray-400 hover:text-white"
              }`}
            >
              <Coins size={12} />
              Finances & Job
            </button>
            <button
              id="hud-tab-chat"
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                activeTab === "chat" ? "bg-fivem-orange/15 text-fivem-orange border border-fivem-orange/30 font-extrabold" : "text-gray-400 hover:text-white"
              }`}
            >
              <MessageSquare size={12} />
              In-game Chat proxy
            </button>
          </div>

          {/* TAB CONTENTS CONTAINER */}
          <div className="flex-grow p-4 md:p-6 overflow-y-auto bg-black/10">
            
            {/* Panel 1: Telemetry specs and live script diagnostics */}
            {activeTab === "telemetry" && (
              <div id="telemetry-panel" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-4 rounded-xl border border-fivem-border/60">
                    <span className="text-[10px] text-gray-500 block uppercase font-mono font-bold">Client Socket status</span>
                    <span className={`text-sm font-bold font-mono block mt-1 ${isOfflineMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {isOfflineMode ? "OFFLINE_SANDBOX" : "SECURE_ACTIVE_LINK"}
                    </span>
                  </div>
                  <div className="glass-panel p-4 rounded-xl border border-fivem-border/60">
                    <span className="text-[10px] text-gray-500 block uppercase font-mono font-bold">Render Engine State</span>
                    <span className="text-sm font-bold font-mono text-white block mt-1">
                      {isOfflineMode ? "VULKAN_1.3_60HZ" : "128 HZ STATE"}
                    </span>
                  </div>
                  <div className="glass-panel p-4 rounded-xl border border-fivem-border/60">
                    <span className="text-[10px] text-gray-500 block uppercase font-mono font-bold">Voice Network</span>
                    <span className={`text-sm font-bold font-mono block mt-1 ${isOfflineMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {isOfflineMode ? "LOCAL_LOOPBACK" : "VOIP_READY"}
                    </span>
                  </div>
                  <div className="glass-panel p-4 rounded-xl border border-fivem-border/60">
                    <span className="text-[10px] text-gray-500 block uppercase font-mono font-bold">Loaded scripts</span>
                    <span className="text-sm font-bold font-mono text-orange-400 block mt-1">
                      {isOfflineMode ? "TRAINER_ACTIVE" : "412 ACTIVE RES"}
                    </span>
                  </div>
                </div>

                {/* Simulated APK Trainer HUD cheat codes injector if offline */}
                {isOfflineMode && (
                  <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#120a02] to-[#1e1302] space-y-4 shadow-xl">
                    <h3 className="text-xs font-mono font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-2 border-b border-fivem-border/20 pb-2.5">
                      <Coins size={14} />
                      🛠️ Standalone Offline Trainer HUD Menu
                    </h3>
                    <p className="text-[11px] text-gray-400">Inject cheats and parameters directly into the Vulkan local sandbox runtime memory:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id="cheat-cash-inject"
                        onClick={() => {
                          setPlayerCash(prev => prev + 500000);
                          const tNotice = {
                            id: `n-${Date.now()}`,
                            title: "Trainer Injection",
                            text: "Successfully injected $500,000 cash directly into emulated RAM heap.",
                            time: "Just now",
                            type: "economy" as any
                          };
                          setNotices(prev => [tNotice, ...prev]);
                        }}
                        className="p-2.5 rounded-lg bg-black/45 hover:bg-black/70 border border-amber-500/20 hover:border-amber-400 text-[10px] font-mono text-amber-300 text-left transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span>Spawn $500k cash</span>
                        <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1 rounded-sm uppercase">RAM</span>
                      </button>
                      
                      <button
                        id="cheat-spawn-car"
                        onClick={() => {
                          const tNotice = {
                            id: `n-${Date.now()}`,
                            title: "Vehicle Spawned",
                            text: "Injected customized Pfister Comet sports engine at local vector coordinates.",
                            time: "Just now",
                            type: "system" as any
                          };
                          setNotices(prev => [tNotice, ...prev]);
                        }}
                        className="p-2.5 rounded-lg bg-black/45 hover:bg-black/70 border border-amber-500/20 hover:border-amber-400 text-[10px] font-mono text-amber-300 text-left transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span>Spawn Pfister Comet</span>
                        <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1 rounded-sm uppercase font-bold">CAR</span>
                      </button>

                      <button
                        id="cheat-set-weather"
                        onClick={() => {
                          const tNotice = {
                            id: `n-${Date.now()}`,
                            title: "Weather Altered",
                            text: "Forced sandbox simulation sky state to: [Golden hour / Cinematic sunset].",
                            time: "Just now",
                            type: "system" as any
                          };
                          setNotices(prev => [tNotice, ...prev]);
                        }}
                        className="p-2.5 rounded-lg bg-black/45 hover:bg-black/70 border border-amber-500/20 hover:border-amber-400 text-[10px] font-mono text-amber-300 text-left transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span>Set Golden Hour Sky</span>
                        <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1 rounded-sm uppercase">SKY</span>
                      </button>

                      <button
                        id="cheat-infinite-armour"
                        onClick={() => {
                          const tNotice = {
                            id: `n-${Date.now()}`,
                            title: "Cheat Activated",
                            text: "Secured maximum carbon bulletproof Kevlar armor state (Continuous loop active).",
                            time: "Just now",
                            type: "admin" as any
                          };
                          setNotices(prev => [tNotice, ...prev]);
                        }}
                        className="p-2.5 rounded-lg bg-black/45 hover:bg-black/70 border border-amber-500/20 hover:border-amber-400 text-[10px] font-mono text-amber-300 text-left transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span>Toggle Infinite Armor</span>
                        <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1 rounded-sm uppercase font-bold">GOD</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="glass-panel p-5 rounded-2xl border border-fivem-border/70 space-y-4">
                  <h3 className="text-xs font-mono font-extrabold text-fivem-orange uppercase tracking-widest flex items-center gap-2 border-b border-fivem-border/40 pb-2.5">
                    <Cpu size={14} />
                    Mobile Client Performance Metrics
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Simulation thread allocation:</span>
                      <span className="text-white">Active ({isOfflineMode ? "4 hardware threads allocated" : "8 threads"})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Memory usage:</span>
                      <span className="text-white">{isOfflineMode ? "914 MB (Vulkan textures optimal)" : "1,242 MB (Buffered)"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">GPU Texture Draw speed:</span>
                      <span className="text-emerald-400 font-bold">60.00 FPS CONST</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Cfx license status:</span>
                      <span className="text-emerald-400">
                        {isOfflineMode ? "OFFLINE_VERIFIED (/sdcard/Android)" : "AUTHENTICATED (Cfx License #32a19b)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated diagnostic chart log */}
                <div className="p-4 bg-black/40 border border-fivem-border/60 rounded-xl font-mono text-[10px] text-green-500 h-32 overflow-y-auto">
                  {isOfflineMode ? (
                    <>
                      <div>[Offline Launcher Thread] Initialized successfully as Standalone APK Sandbox local loopback...</div>
                      <div>[Offline Launcher Thread] Bypassing online cfx.re load-balancer router checks (Local mounter bypass).</div>
                      <div>[Offline Launcher Thread] Mounted 12.42 GB files system pack: /sdcard/Android/obb/com.fivem.offline/</div>
                      <div>[Offline Launcher Thread] Successfully linked internal trainer_hud cheat structure.</div>
                      <div>[Offline Launcher Thread] Loopback speed locked at 0ms latency render. Ready to play!</div>
                    </>
                  ) : (
                    <>
                      <div>[Client HUD] Connected successfully to network thread index #{server.id.substring(0, 5)}</div>
                      <div>[Client HUD] Handshaking VOIP local server routing channels (128bit encryption keys)...</div>
                      <div>[Client HUD] Successfully loaded 412 server script modifications.</div>
                      <div>[Client HUD] Telemetry sync rate locked at 25ms interval.</div>
                      <div>[Client HUD] Live GPS tracking ready at vector grid.</div>
                      <div>[Client HUD] Standard dispatch alerts synced: Ready listening.</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Panel 2: Interactive GTA style mini map coordinate router */}
            {activeTab === "map" && (
              <div id="map-panel" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  
                  {/* Circular Map Visual */}
                  <div className="md:col-span-1 justify-center flex">
                    <div className="relative w-44 h-44 rounded-full border-4 border-gray-800 bg-[#1e2025] glow-border overflow-hidden flex items-center justify-center shadow-2xl bg-linear-to-b from-[#1b263b] via-[#0d1b2a] to-[#01080f]">
                      {/* Grid cross lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />
                      <div className="absolute w-px h-full bg-red-500/25 left-1/2 -translate-x-1/2" />
                      <div className="absolute h-px w-full bg-red-500/25 top-1/2 -translate-y-1/2" />

                      {/* Radar Sweep Animation overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/0 to-emerald-500/10 origin-bottom-left rotate-45 animate-[spin_4s_linear_infinite]" />

                      {/* Floating Mock map points overlay */}
                      {GTA_MINIMAP_POINTS.map((point) => (
                        <div 
                          key={point.name}
                          style={{ 
                            left: `${45 + (point.x - 231) / 5}%`, 
                            top: `${45 + (point.y - 154) / 5}%` 
                          }}
                          className={`absolute w-2.5 h-2.5 rounded-full ring-2 ring-white transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 ${
                            point.type === "police" ? "bg-blue-500 ring-blue-300" :
                            point.type === "tuner" ? "bg-orange-500 ring-orange-300 animate-ping" :
                            point.type === "home" ? "bg-emerald-500 ring-emerald-300" : "bg-red-500 ring-red-300"
                          }`}
                          title={point.name}
                        />
                      ))}

                      {/* Character Current Position Icon */}
                      <Navigation size={18} className="text-fivem-orange fill-fivem-orange transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
                    </div>
                  </div>

                  {/* Character Position Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="glass-panel p-4 rounded-xl border border-fivem-border/60">
                      <span className="text-[10px] text-gray-500 block uppercase font-mono font-bold">GPS Coordinates Locator</span>
                      <span className="text-sm font-bold text-white block mt-1 font-mono">X: {activeCoords.x}.00 | Y: {activeCoords.y}.00</span>
                      <span className="text-xs text-gray-400 font-sans block mt-1">Zone: <span className="text-fivem-orange font-semibold">{activeCoordsName}</span></span>
                    </div>

                    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-xs leading-relaxed text-red-300">
                      ⚠️ <span className="font-bold">CAUTION:</span> Police Department warns of active high speed drift racing gangs near Tuner Shop zones. Obey passive sandbox traffic rules.
                    </div>
                  </div>
                </div>

                {/* Target waypoint picker buttons list */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 font-mono">Select Map waypoint Teleport Coordinates:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {GTA_MINIMAP_POINTS.map(pt => {
                      const isActivePoint = pt.x === activeCoords.x;
                      return (
                        <button
                          id={`gps-btn-${pt.name.toLowerCase().replace(/ /g, "-")}`}
                          key={pt.name}
                          onClick={() => triggerGpsTeleport(pt)}
                          className={`text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                            isActivePoint 
                              ? "bg-fivem-orange/15 border-fivem-orange text-fivem-orange font-semibold" 
                              : "bg-black/20 border-fivem-border hover:border-gray-600"
                          }`}
                        >
                          <div>
                            <div className="text-gray-200 text-xs font-bold">{pt.name}</div>
                            <div className="text-[10px] text-gray-500">[{pt.x}, {pt.y}]</div>
                          </div>
                          <Navigation size={13} className={`transform rotate-45 ${isActivePoint ? "text-fivem-orange" : "text-gray-600"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Panel 3: Economy management and Job simulators */}
            {activeTab === "economy" && (
              <div id="economy-panel" className="space-y-6">
                {/* Visual bank balance logs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-950/20 to-emerald-900/10 border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
                    <span className="text-[10px] text-emerald-400 block uppercase font-mono font-extrabold">Citizen Coin Wallet</span>
                    <span className="text-2xl font-mono font-bold text-white block mt-1.5">${playerCash.toLocaleString()}</span>
                    <Coins className="text-emerald-500/20 absolute -right-6 -bottom-6" size={80} />
                  </div>

                  <div className="bg-linear-to-br from-indigo-950/20 to-indigo-900/10 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden">
                    <span className="text-[10px] text-indigo-400 block uppercase font-mono font-extrabold">Maze Bank Savings Account</span>
                    <span className="text-2xl font-mono font-bold text-white block mt-1.5">${playerBank.toLocaleString()}</span>
                    <TrendingUp className="text-indigo-500/25 absolute -right-6 -bottom-6" size={80} />
                  </div>
                </div>

                {/* Job information */}
                <div className="glass-panel p-5 rounded-2xl border border-fivem-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="bg-fivem-orange/10 p-3 rounded-xl border border-fivem-orange/20 shrink-0">
                      <Briefcase className="text-fivem-orange" size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-mono">Current Server Occupation</span>
                      <h4 className="text-sm font-extrabold text-white">Tuner Custom Suspension Mechanic</h4>
                      <p className="text-xs text-gray-400 mt-0.5">WAGES FLAT-RATE: <span className="text-emerald-400 font-bold">$1,250 / shifts</span></p>
                    </div>
                  </div>

                  <button
                    id="hud-job-shift"
                    onClick={engageJobShift}
                    className="w-full sm:w-auto bg-fivem-orange hover:bg-fivem-orange-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer uppercase font-mono"
                  >
                    🚀 Run Faction Task Shift
                  </button>
                </div>

                {/* Investment box */}
                <div className="p-4 bg-black/20 border border-fivem-border/40 rounded-xl space-y-2 text-xs">
                  <h4 className="font-bold text-gray-300 font-mono uppercase tracking-widest flex items-center gap-1.5"><TrendingUp size={12} /> Financial Sandbox Advice</h4>
                  <p className="text-gray-400 leading-relaxed text-[11px]">
                    To unlock premium high speed V8 muscle cars in eclipse.cfx.re, perform daily mechanic shifts, invest surplus wallet profits in the local stock market index, or coordinate vehicle smuggling loops with your friends on Global chat!
                  </p>
                </div>
              </div>
            )}

            {/* Panel 4: Live In-game server Chat Proxy */}
            {activeTab === "chat" && (
              <div id="game-chat-panel" className="flex flex-col h-[52vh] bg-black/20 rounded-2xl border border-fivem-border/60 overflow-hidden">
                {/* proxy message logs */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3 font-mono text-[11px]">
                  {gameChats.map((msg) => (
                    <div 
                      id={`gchat-${msg.id}`}
                      key={msg.id} 
                      className="leading-relaxed bg-black/30 p-2 border-l-2 border-fivem-orange/70 rounded-r-lg"
                    >
                      <span className="text-gray-500 mr-1.5 flex items-center gap-1 inline-flex">
                        <Clock size={9} />
                        [{msg.time}]
                      </span>
                      <span className="text-fivem-orange font-bold mr-1">{msg.sender}:</span>
                      <span className="text-gray-200">{msg.content}</span>
                    </div>
                  ))}
                  <div ref={gameChatRef} />
                </div>

                {/* Proxy typed submission */}
                <form onSubmit={handleSendGameChat} className="p-2 border-t border-fivem-border/40 bg-black/40 flex items-center gap-2">
                  <div className="text-gray-600 font-bold px-1 select-none text-xs">💬 PROXY:</div>
                  <input
                    id="game-chat-box"
                    type="text"
                    placeholder="Type to in-game server players (e.g. /ooc hello world, help)..."
                    value={gameChatInput}
                    onChange={(e) => setGameChatInput(e.target.value)}
                    className="flex-grow bg-transparent border-none outline-none text-xs text-white placeholder-gray-700 font-mono"
                  />
                  <button 
                    id="game-chat-proxy-submit"
                    type="submit"
                    className="p-1.5 rounded-lg bg-fivem-orange hover:bg-fivem-orange-hover text-white transition-colors cursor-pointer"
                  >
                    <Send size={12} />
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

        {/* Right Columns: Active in-game alert dispatches logs panel */}
        <div id="dispatch-alerts-sidebar" className="w-full md:w-80 bg-black/40 p-4 shrink-0 flex flex-col overflow-y-auto border-t md:border-t-0 border-fivem-border/40 space-y-4 max-h-60 md:max-h-full">
          <div className="flex items-center justify-between border-b border-fivem-border/40 pb-2 shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-widest text-fivem-orange font-mono flex items-center gap-1">
              <Bell size={12} className="text-fivem-orange animate-pulse" />
              Live HUD Dispatch notices
            </span>
            {notices.length > 0 && (
              <button 
                id="clear-dispatch"
                onClick={() => setNotices([])} 
                className="text-[9px] uppercase font-extrabold text-gray-500 hover:text-white transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2 flex-grow overflow-y-auto pr-1">
            <AnimatePresence>
              {notices.length > 0 ? (
                notices.map((nt) => (
                  <motion.div
                    id={`notice-${nt.id}`}
                    key={nt.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                      nt.type === "police" ? "bg-red-950/15 border-red-500/25 text-red-200" :
                      nt.type === "economy" ? "bg-emerald-950/15 border-emerald-500/25 text-emerald-200" :
                      nt.type === "admin" ? "bg-fuchsia-950/15 border-fuchsia-500/25 text-fuchsia-200" :
                      "bg-gray-950/20 border-fivem-border text-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[10px] uppercase tracking-wider">{nt.title}</span>
                      <span className="text-[9px] text-gray-500">{nt.time}</span>
                    </div>
                    <p className="text-[10px] leading-relaxed">{nt.text}</p>
                  </motion.div>
                ))
              ) : (
                <div id="no-dispatches" className="text-center py-8 text-gray-600 text-[10px] font-mono">
                  📡 Listening for active dispatch reports from {server.shortName}...
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
