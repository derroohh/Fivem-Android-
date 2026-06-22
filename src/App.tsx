import React, { useState, useEffect } from "react";
import { 
  Compass, 
  Newspaper, 
  MessageSquare, 
  Sliders, 
  Terminal, 
  Activity, 
  ServerIcon, 
  Sparkles,
  Users,
  Layers,
  ChevronDown,
  Info
} from "lucide-react";
import { ClientSettings, Server } from "./types";
import HomeFeed from "./components/HomeFeed";
import ServerBrowser from "./components/ServerBrowser";
import SocialCenter from "./components/SocialCenter";
import SettingsPanel from "./components/SettingsPanel";
import DevConsole from "./components/DevConsole";
import GameHUDCompanion from "./components/GameHUDCompanion";

const DEFAULT_SETTINGS: ClientSettings = {
  userName: "Cfx_Android_Player",
  avatarId: "avatar-franklin",
  bgTheme: "gradient",
  volume: 75,
  uiSounds: true,
  limitFPS: true,
  fpsLimit: 60,
  devConsoleEnabled: true,
  simulatedPingOffset: 15
};

const AVATAR_MAP: Record<string, string> = {
  "avatar-trevor": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
  "avatar-franklin": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
  "avatar-michael": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
  "avatar-cybercop": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  "avatar-drifter": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "servers" | "social" | "settings">("home");
  const [settings, setSettings] = useState<ClientSettings>(DEFAULT_SETTINGS);
  
  // Persistent server bookmarks and history logs
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  
  // Terminal developer console state
  const [consoleOpen, setConsoleOpen] = useState(false);
  
  // Connected server state - launches full immersive simulation GameHUD
  const [activeConnectedServer, setActiveConnectedServer] = useState<Server | null>(null);

  // Load configuration options on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("fivem_settings");
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedFavorites = localStorage.getItem("fivem_favorites");
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

      const savedHistory = localStorage.getItem("fivem_history");
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error("Local storage sync error: ", e);
    }
  }, []);

  // Save Settings when mutated
  const handleSaveSettings = (newSettings: ClientSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem("fivem_settings", JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
    playTickBeep(newSettings.uiSounds, newSettings.volume);
  };

  // Synchronize Favorite listings
  const handleToggleFavorite = (serverId: string) => {
    let nextFavorites;
    if (favorites.includes(serverId)) {
      nextFavorites = favorites.filter(id => id !== serverId);
    } else {
      nextFavorites = [...favorites, serverId];
    }
    setFavorites(nextFavorites);
    try {
      localStorage.setItem("fivem_favorites", JSON.stringify(nextFavorites));
    } catch (e) {
      console.error(e);
    }
    playTickBeep(settings.uiSounds, settings.volume);
  };

  // Keyboard shortcut for developer console tilde key (~)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "Tilde") {
        e.preventDefault();
        if (settings.devConsoleEnabled) {
          setConsoleOpen(prev => !prev);
          playTickBeep(settings.uiSounds, settings.volume);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings.devConsoleEnabled, settings.uiSounds, settings.volume]);

  // Synthesize digital physical audio clicks
  const playTickBeep = (enabled = settings.uiSounds, volume = settings.volume) => {
    if (!enabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1250, audioCtx.currentTime); // High pitch gaming click
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.07);
      
      gainNode.gain.setValueAtTime((volume / 100) * 0.06, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (err) {
      // safe fallback for browser security blockers
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    playTickBeep(settings.uiSounds, settings.volume);
  };

  // Initiate dynamic connecting sequences
  const handleConnectServer = (server: Server) => {
    setActiveConnectedServer(server);
    playTickBeep(settings.uiSounds, settings.volume);

    // Save/append to client history safely
    const nextHistory = [server.id, ...history.filter(id => id !== server.id)].slice(0, 8);
    setHistory(nextHistory);
    try {
      localStorage.setItem("fivem_history", JSON.stringify(nextHistory));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisconnect = () => {
    setActiveConnectedServer(null);
    playTickBeep(settings.uiSounds, settings.volume);
  };

  // Command interpreter for Dev Terminal Console Code triggers
  const handleExecuteConsoleCommand = (cmdText: string): string => {
    const args = cmdText.trim().split(" ");
    const primaryCmd = args[0].toLowerCase();

    if (primaryCmd === "/help" || primaryCmd === "help") {
      return "AVAILABLE CODES:\n  /setuser [name] - Changes Cfx profile tag\n  /ping [offset]  - Set latent connection additive offset\n  /clear          - Flush console logs logs\n  /connect [ip]   - Forcibly dial IP Address endpoint port";
    }

    if (primaryCmd === "/setuser" || primaryCmd === "setuser") {
      if (args.length < 2) return "Error: Must specify nickname. e.g. /setuser Franklin";
      const newNick = args.slice(1).join(" ");
      handleSaveSettings({ ...settings, userName: newNick });
      return `Success: Cfx nickname updated to: '${newNick}'`;
    }

    if (primaryCmd === "/ping" || primaryCmd === "ping") {
      if (args.length < 2) return "Error: Specify variance value. e.g. /ping 25";
      const pOffset = parseInt(args[1]);
      if (isNaN(pOffset)) return "Error: Value must be a valid integer offset.";
      handleSaveSettings({ ...settings, simulatedPingOffset: pOffset });
      return `Success: Baseline simulated ping offset is now +${pOffset}ms`;
    }

    if (primaryCmd === "/connect" || primaryCmd === "connect") {
      if (args.length < 2) return "Error: Forcibly specify IP target. e.g. /connect 192.168.1.100:30120";
      const targetIp = args[1];
      
      const directConnectServer: Server = {
        id: `con-direct-${Date.now()}`,
        name: `Forced IP Connection Client`,
        shortName: targetIp,
        description: `Console override connector triggered. Dialing target port endpoint ${targetIp}.`,
        players: 1,
        maxPlayers: 120,
        ping: 20,
        tags: ["Command Code"],
        owner: "CONSOLE",
        region: "Local Client Override",
        iconUrl: "",
        bannerUrl: "",
        upvotes: 0,
        gameBuild: "b3095 (Chop Shop)",
        ipAddress: targetIp
      };

      setConsoleOpen(false);
      handleConnectServer(directConnectServer);
      return `Establishing connection to: ${targetIp}... Console closing.`;
    }

    if (primaryCmd === "/clear" || primaryCmd === "clear") {
      return "Command clears list (Auto-executed)";
    }

    return `Command code unrecognized: '${primaryCmd}'. Type '/help' for options.`;
  };

  const activeAvatarUrl = AVATAR_MAP[settings.avatarId] || AVATAR_MAP["avatar-franklin"];

  // Mapping theme background string presets to rich visual gradient elements
  const getThemeBackgroundStyles = () => {
    if (settings.bgTheme === "sunset") {
      return "bg-gradient-to-tr from-[#16001a] via-[#0b0c10] to-[#250d03]";
    }
    if (settings.bgTheme === "cyberpunk") {
      return "bg-[radial-gradient(circle_at_bottom,rgba(0,180,216,0.1)_0%,rgba(7,9,18,1)_100%)]";
    }
    if (settings.bgTheme === "carbon") {
      return "bg-[#090a0c]";
    }
    if (settings.bgTheme === "gta") {
      return "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.65)_0%,rgba(10,11,14,1)_100%)] bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-blend-soft-light";
    }
    // Default gradient
    return "bg-radial from-[#181920] to-[#0a0a0d]";
  };

  // If a server connection is active: Launch HUD overlay directly
  if (activeConnectedServer) {
    return (
      <GameHUDCompanion 
        server={activeConnectedServer}
        settingsPing={settings.simulatedPingOffset}
        userName={settings.userName}
        avatarUrl={activeAvatarUrl}
        onDisconnect={handleDisconnect}
      />
    );
  }

  return (
    <div className={`min-h-screen text-gray-100 flex flex-col select-none relative transition-all duration-700 ${getThemeBackgroundStyles()}`}>
      
      {/* Official Cfx client background radial ambient glow */}
      <div className="absolute inset-0 opacity-25 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(circle at 50% -10%, #f34235 0%, transparent 60%)" }} />

      {/* 1. TOP HEADER PANEL */}
      <header className="bg-black/60 border-b border-fivem-border/40 p-4 sticky top-0 z-30 backdrop-blur-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Logo element resembling Cfx */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => handleTabChange("home")}>
            <span className="text-3xl font-extrabold font-display text-fivem-orange glow-orange tracking-tight">Cfx</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-fivem-orange/10 border border-fivem-orange/30 text-fivem-orange font-bold uppercase tracking-wider">
              Android Launcher
            </span>
          </div>
        </div>

        {/* Header Right utilities */}
        <div className="flex items-center gap-3.5">
          {/* Active stats */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>241,502 players active on web</span>
          </div>

          {/* Developer console trigger key if activated */}
          {settings.devConsoleEnabled && (
            <button
              id="dev-console-trigger-header"
              onClick={() => setConsoleOpen(prev => !prev)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                consoleOpen 
                  ? "bg-fivem-orange/20 border-fivem-orange text-fivem-orange" 
                  : "bg-fivem-surface border-fivem-border hover:border-gray-500 text-gray-400 hover:text-white"
              }`}
              title="Open console (~)"
            >
              <Terminal size={14} />
            </button>
          )}

          {/* Profile mini status badge - links to Settings navigation */}
          <button 
            id="header-profile-sync"
            onClick={() => handleTabChange("settings")}
            className="flex items-center gap-2.5 p-1 px-2.5 bg-fivem-surface hover:bg-fivem-surface/80 rounded-xl border border-fivem-border transition-all cursor-pointer text-left shrink-0"
          >
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-fivem-border bg-black">
              <img src={activeAvatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] font-bold text-white truncate max-w-[5rem]">{settings.userName}</div>
              <div className="text-[8px] text-gray-500 font-mono">Cfx License Valid</div>
            </div>
          </button>
        </div>
      </header>

      {/* Retro Dev Console Drawer insertion */}
      <DevConsole 
        isOpen={consoleOpen && settings.devConsoleEnabled} 
        onClose={() => setConsoleOpen(false)}
        onExecuteCommand={handleExecuteConsoleCommand}
      />

      {/* 2. CENTRAL ROUTER DISPLAY CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === "home" && (
          <HomeFeed 
            onNavigateToServers={() => handleTabChange("servers")}
            onNavigateToSocial={() => handleTabChange("social")}
            activePlayersCount={241502}
            activeServersCount={8432}
          />
        )}

        {activeTab === "servers" && (
          <ServerBrowser 
            onConnect={handleConnectServer}
            favorites={favorites}
            history={history}
            toggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === "social" && (
          <SocialCenter 
            userName={settings.userName}
            avatarId={settings.avatarId}
            onJoinServerByShortName={(shortName) => {
              // Reconnect by matching shortname
              const customDirect: Server = {
                id: `server-join-friend-${Date.now()}`,
                name: `${shortName} Session`,
                shortName: shortName,
                description: `Joining live active Cfx friend multiplayer lobby context matching: ${shortName}`,
                players: 21,
                maxPlayers: 120,
                ping: 18,
                tags: ["Multiplayer", "Sync"],
                owner: "Cfx Friend",
                region: "Global Sync",
                iconUrl: "",
                bannerUrl: "",
                upvotes: 11,
                gameBuild: "b3095 (Chop Shop)",
                ipAddress: "friend.cfx.re:30120"
              };
              handleConnectServer(customDirect);
            }}
          />
        )}

        {activeTab === "settings" && (
          <SettingsPanel 
            settings={settings}
            onChangeSettings={handleSaveSettings}
          />
        )}
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION UTILITY BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-black/85 border-t border-fivem-border/60 p-2 py-3 backdrop-blur-lg flex justify-around items-center max-w-lg mx-auto rounded-t-3xl shadow-2xl">
        <button
          id="nav-btn-home"
          onClick={() => handleTabChange("home")}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === "home" ? "text-fivem-orange font-semibold" : "text-gray-400 hover:text-white"
          }`}
        >
          <Newspaper size={18} className={activeTab === "home" ? "stroke-2" : "stroke-1"} />
          <span className="text-[10px] tracking-tight">Main Hub</span>
        </button>

        <button
          id="nav-btn-servers"
          onClick={() => handleTabChange("servers")}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === "servers" ? "text-fivem-orange font-semibold" : "text-gray-400 hover:text-white"
          }`}
        >
          <Compass size={18} className={activeTab === "servers" ? "stroke-2" : "stroke-1"} />
          <span className="text-[10px] tracking-tight">Servers</span>
        </button>

        <button
          id="nav-btn-social"
          onClick={() => handleTabChange("social")}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === "social" ? "text-fivem-orange font-semibold" : "text-gray-400 hover:text-white"
          }`}
        >
          <MessageSquare size={18} className={activeTab === "social" ? "stroke-2" : "stroke-1"} />
          <span className="text-[10px] tracking-tight">Social CRM</span>
        </button>

        <button
          id="nav-btn-settings"
          onClick={() => handleTabChange("settings")}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === "settings" ? "text-fivem-orange font-semibold" : "text-gray-400 hover:text-white"
          }`}
        >
          <Sliders size={18} className={activeTab === "settings" ? "stroke-2" : "stroke-1"} />
          <span className="text-[10px] tracking-tight">Settings</span>
        </button>
      </nav>
    </div>
  );
}
