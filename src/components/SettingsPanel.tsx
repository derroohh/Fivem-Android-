import React from "react";
import { 
  User, 
  Sparkles, 
  Volume2, 
  Image, 
  Cpu, 
  Sliders, 
  Smartphone, 
  ShieldCheck, 
  HelpCircle,
  Hash,
  Database
} from "lucide-react";
import { ClientSettings } from "../types";

interface SettingsPanelProps {
  settings: ClientSettings;
  onChangeSettings: (newSettings: ClientSettings) => void;
}

const AVATAR_OPTIONS = [
  { id: "avatar-trevor", name: "Trevor P.", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
  { id: "avatar-franklin", name: "Franklin C.", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" },
  { id: "avatar-michael", name: "Michael dS.", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
  { id: "avatar-cybercop", name: "LSPD Colonel", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
  { id: "avatar-drifter", name: "Drift Queen", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" }
];

const THEME_OPTIONS = [
  { id: "gradient", name: "Standard Charcoal", desc: "Original Cfx graphite with orange accents" },
  { id: "sunset", name: "Sunset Horizon", desc: "Glowing neon orange & violet gradient backdrop" },
  { id: "cyberpunk", name: "Cyber Neon", desc: "Bright cyan-blue grid accents and dark glow" },
  { id: "carbon", name: "Carbon Noir", desc: "Highly optimized deep stealth textured gray" },
  { id: "gta", name: "Vinewood Lights", desc: "Scenic blurred downtown skyline ambiance" }
];

export default function SettingsPanel({ settings, onChangeSettings }: SettingsPanelProps) {
  const updateSetting = <K extends keyof ClientSettings>(key: K, value: ClientSettings[K]) => {
    onChangeSettings({
      ...settings,
      [key]: value
    });
  };

  return (
    <div id="settings-screen" className="space-y-6 pb-24">
      {/* 1. Cfx Profile Configuration */}
      <div className="glass-panel rounded-2xl border border-fivem-border p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-fivem-orange flex items-center gap-2 mb-3">
          <User size={16} />
          Cfx.re Account Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-mono" htmlFor="cfx-username">Cfx.re Username</label>
            <input 
              id="cfx-username"
              type="text" 
              value={settings.userName} 
              onChange={(e) => updateSetting("userName", e.target.value)}
              className="w-full bg-black/40 border border-fivem-border rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-fivem-orange font-mono"
            />
            <p className="text-[10px] text-gray-500">This is your main identifier across servers and community feeds</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-mono">Mobile Handle Color</label>
            <div className="flex gap-2 items-center h-10">
              <span className="w-3.5 h-3.5 rounded-full bg-fivem-orange inline-block shadow-md" />
              <span className="text-xs text-mono text-gray-300">Signature Orange (Verified Cfx)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Avatar Picker */}
        <div className="space-y-2 pt-2">
          <label className="text-xs text-gray-400 font-mono block">Grand Theft Auto Character Photo</label>
          <div className="flex gap-3 flex-wrap">
            {AVATAR_OPTIONS.map(opt => {
              const isSelected = settings.avatarId === opt.id;
              return (
                <button
                  id={`avatar-select-${opt.id}`}
                  key={opt.id}
                  onClick={() => updateSetting("avatarId", opt.id)}
                  className={`relative p-1 rounded-xl transition-all border ${
                    isSelected 
                      ? "border-fivem-orange bg-fivem-orange/10 scale-105" 
                      : "border-fivem-border bg-black/10 hover:border-gray-500"
                  }`}
                >
                  <img src={opt.url} alt="" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 bg-fivem-orange text-white text-[8px] font-extrabold px-1 rounded-full border border-fivem-surface">
                      ACTIVE
                    </span>
                  )}
                  <span className="text-[9px] block text-center text-gray-400 pt-1 font-mono">{opt.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Visual launcher UI Theme Switcher */}
      <div className="glass-panel rounded-2xl border border-fivem-border p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-fivem-orange flex items-center gap-2 mb-3">
          <Image size={16} />
          Active Themes & Styles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {THEME_OPTIONS.map(opt => {
            const isSelected = settings.bgTheme === opt.id;
            return (
              <button
                id={`theme-btn-${opt.id}`}
                key={opt.id}
                onClick={() => updateSetting("bgTheme", opt.id as any)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected 
                    ? "bg-fivem-orange/10 border-fivem-orange/70 shadow-lg" 
                    : "bg-black/20 border-fivem-border hover:border-gray-600 hover:bg-black/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{opt.name}</span>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-fivem-orange inline-block" />
                  )}
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Audio & Click sound effects settings */}
      <div className="glass-panel rounded-2xl border border-fivem-border p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-fivem-orange flex items-center gap-2 mb-3">
          <Volume2 size={16} />
          Audio & Feedback
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Mechanical Click Sounds</span>
              <span className="text-[10px] text-gray-400 block">Trigger high-fidelity click sound signals when navigating tabs</span>
            </div>
            <input 
              id="ui-sounds-toggle"
              type="checkbox" 
              checked={settings.uiSounds}
              onChange={(e) => updateSetting("uiSounds", e.target.checked)}
              className="w-4 h-4 text-fivem-orange rounded accent-fivem-orange"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Sound Level</span>
              <span className="text-white font-mono font-bold">{settings.volume}%</span>
            </div>
            <input 
              id="settings-volume"
              type="range" 
              min="0" 
              max="100" 
              value={settings.volume}
              onChange={(e) => updateSetting("volume", parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-fivem-orange"
            />
          </div>
        </div>
      </div>

      {/* 4. Performance & Android Emulation Metrics */}
      <div className="glass-panel rounded-2xl border border-fivem-border p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-fivem-orange flex items-center gap-2 mb-3">
          <Cpu size={16} />
          Emulator Allocation & Engine Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Frame Rate Limiter</span>
              <span className="text-[10px] text-gray-400 block">Target constant FPS state to lower mobile temperature index</span>
            </div>
            <input 
              id="limit-fps-toggle"
              type="checkbox" 
              checked={settings.limitFPS}
              onChange={(e) => updateSetting("limitFPS", e.target.checked)}
              className="w-4 h-4 text-fivem-orange rounded accent-fivem-orange"
            />
          </div>

          {settings.limitFPS && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-mono">Max Dynamic Frame Rate</span>
                <span className="text-white font-mono font-bold">{settings.fpsLimit} FPS</span>
              </div>
              <input 
                id="settings-limit"
                type="range" 
                min="30" 
                max="120" 
                step="5"
                value={settings.fpsLimit}
                onChange={(e) => updateSetting("fpsLimit", parseInt(e.target.value))}
                className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-fivem-orange"
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t border-fivem-border/40 pt-4">
            <div>
              <span className="text-xs font-semibold text-white block">Developer console (b115)</span>
              <span className="text-[10px] text-gray-400 block">Enables debug command system terminal accessible by swipe up</span>
            </div>
            <input 
              id="dev-console-toggle"
              type="checkbox" 
              checked={settings.devConsoleEnabled}
              onChange={(e) => updateSetting("devConsoleEnabled", e.target.checked)}
              className="w-4 h-4 text-fivem-orange rounded accent-fivem-orange"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Emulated Connection Latency Additive</span>
              <span className="text-white font-mono font-bold">+{settings.simulatedPingOffset} ms</span>
            </div>
            <input 
              id="settings-ping"
              type="range" 
              min="0" 
              max="150" 
              step="5"
              value={settings.simulatedPingOffset}
              onChange={(e) => updateSetting("simulatedPingOffset", parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-fivem-orange"
            />
          </div>
        </div>
      </div>

      {/* 5. Emulation Specs Info panel */}
      <div className="bg-black/40 rounded-2xl border border-fivem-border/60 p-4 text-xs space-y-2">
        <h4 className="font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
          <Database size={13} className="text-fivem-orange" />
          Client Information System
        </h4>
        <div className="grid grid-cols-2 gap-y-1.5 font-mono text-gray-400 text-[10px]">
          <div>PLATFORM SPEC:</div>
          <div className="text-white text-right">Android ARM64-v8a</div>
          <div>EMULATION CORES:</div>
          <div className="text-white text-right">8 Cores (HyperThreaded)</div>
          <div>Cfx CLIENT SDK:</div>
          <div className="text-white text-right">v2.4.9-Beta (API 34)</div>
          <div>CACHED ASSETS:</div>
          <div className="text-orange-400 text-right font-bold">12.42 GB verified</div>
        </div>
      </div>
    </div>
  );
}
