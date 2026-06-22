import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Users, 
  Send, 
  Smile, 
  Search, 
  Video, 
  MoreVertical,
  Volume2,
  Tv,
  Star,
  Activity,
  Play
} from "lucide-react";
import { Friend, ChatMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface SocialCenterProps {
  userName: string;
  avatarId: string;
  onJoinServerByShortName: (shortName: string) => void;
}

const INITIAL_FRIENDS: Friend[] = [
  {
    id: "friend-cfx-dev",
    username: "Cfx_Dev_01",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    status: "online",
    tagline: "Refactoring the streaming CDN. Keep RP real.",
    activity: "Coding server scripts"
  },
  {
    id: "friend-nopixel-fan",
    username: "NoPixel_Fan",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
    status: "playing",
    tagline: "Looking for a serious mafia group...",
    activity: "NoPixel 4.0"
  },
  {
    id: "friend-gta-master",
    username: "x_GTA_Master_x",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    status: "playing",
    tagline: "AE86 is life. Tuning is art.",
    activity: "SA Drift Club"
  },
  {
    id: "friend-officer-dan",
    username: "LSPD_Officer_Dan",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    status: "idle",
    tagline: "To protect and serve. Code 3 active.",
    activity: "Eclipse RP"
  },
  {
    id: "friend-rox",
    username: "GamerGirl_Rox",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    status: "offline",
    tagline: "Probably tweaking suspension damping angles.",
  }
];

const INITIAL_GLOBAL_CHAT: ChatMessage[] = [
  {
    id: "gmsg-1",
    sender: "Midnight_Rider",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    senderColor: "#38bdf8",
    content: "Did anyone catch NoPixel yesterday? The bank heist escape was absolute madness! Cop squad got completely juked.",
    timestamp: "09:10"
  },
  {
    id: "gmsg-2",
    sender: "LoverGamer_RP",
    senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    senderColor: "#f472b6",
    content: "Is there any active Drift server that has full handling controls loaded? Looking for custom tandem events.",
    timestamp: "09:12"
  },
  {
    id: "gmsg-3",
    sender: "Cfx_Dev_01",
    senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    senderColor: "#fbbf24",
    content: "Working on mobile browser handshake protocols today. Sync speed should get sliced by 20% by next refresh.",
    timestamp: "09:14"
  },
  {
    id: "gmsg-4",
    sender: "Hardcore_Gamer",
    senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    senderColor: "#34d399",
    content: "True! And the connection stability on phones is incredible. I can literally manage my gang inventory while in bed.",
    timestamp: "09:15"
  }
];

const CONTEXTUAL_BOT_REPLIES: Record<string, string[]> = {
  global: [
    "I literally code server scripts for breakfast, tell me your build!",
    "No way! Is that Cfx mobile client actually synchronized in real-time? That's legendary.",
    "Eclipse RP has 380 players queue right now. Need that VIP access code lmao.",
    "Try typing /help into the developer terminal, there are some hidden client logs there.",
    "Any group looking for civilian RP lawyers? Have my legal case documents typed out.",
    "The suspension on drift cars is too soft by default, adjust rear spring load by 0.15.",
    "Is anyone else experiencing 15ms ping on mobile? Rebuilding standard cache helped.",
    "Wait, can you connect directly via terminal IP on android too? That's crazy handy."
  ],
  "Cfx_Dev_01": [
    "Yeah, I am testing the compression headers. Try checking the developer console for logs.",
    "The client build runs b3095 directly. If you hit script timeouts, drop variables in local storage.",
    "We are planning visual enhancements for sunset theme. Let me know what you think!",
    "Awesome. Let me check the CDN status from the LS hub."
  ],
  "NoPixel_Fan": [
    "Bro koil is streaming right now. He is talking about adding customized mobile dispatch alerts!",
    "The police chases on NoPixel are so tactical. Air-1 helicopter tracking is supreme.",
    "Did you complete the lock-pick training in custom-mechanics yet? Hard manual timing.",
    "I am saving up upvotes to sponsor our tuner server. Hit the like button too!"
  ],
  "x_GTA_Master_x": [
    "AE86 handling file is tweaked to perfection. Check the street racing channel.",
    "Never slam the handbrake mid-drift. Feint entry, then feather standard gas triggers.",
    "Let's tandem later! I'm active on SA Drift Club. Use direct join from friends bar.",
    "My current drift score record is 2.4 Million in Mt. Chiliad downhill."
  ],
  "LSPD_Officer_Dan": [
    "Code 3 high-speed pursuit on Great Ocean Highway! We need immediate Spike Strip deployment.",
    "Eclipse RP LSPD academy starts at 8 PM. Prepare your civilian speech files.",
    "Remember to lock your cruiser doors, standard hoodlums keep stealing shotguns.",
    "Respect the chain of command, recruit! Or you're scrubbing dispatch boards today."
  ]
};

const BOT_NICKNAME_COLORS = ["#34d399", "#f472b6", "#c084fc", "#38bdf8", "#fbbf24", "#f87171", "#a7f3d0"];

const BOT_AVATARS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
];

const BOT_NAMES = ["RP_King", "GTA_Coyote", "SaltyCop", "Drift_Queen", "CfxClientTester", "NoPixel_Watcher"];

export default function SocialCenter({ userName, avatarId, onJoinServerByShortName }: SocialCenterProps) {
  const [socialTab, setSocialTab] = useState<"chat" | "friends" | "dm">("chat");
  const [globalMessages, setGlobalMessages] = useState<ChatMessage[]>(INITIAL_GLOBAL_CHAT);
  const [globalInput, setGlobalInput] = useState("");
  
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [selectedFriendForDM, setSelectedFriendForDM] = useState<Friend | null>(null);
  
  const [dms, setDms] = useState<Record<string, ChatMessage[]>>({
    "friend-cfx-dev": [
      { id: "dm-1", sender: "Cfx_Dev_01", senderAvatar: INITIAL_FRIENDS[0].avatarUrl, content: "Hey! Welcome to the FiveM Android client companion.", timestamp: "Yesterday" },
      { id: "dm-2", sender: "You", senderAvatar: "", content: "Thanks! Is the server list real-time?", timestamp: "Yesterday", isMe: true },
      { id: "dm-3", sender: "Cfx_Dev_01", senderAvatar: INITIAL_FRIENDS[0].avatarUrl, content: "Absolutely. Standard websocket pulls maintain player counts perfectly.", timestamp: "Yesterday" }
    ],
    "friend-nopixel-fan": [
      { id: "dm-b1", sender: "NoPixel_Fan", senderAvatar: INITIAL_FRIENDS[1].avatarUrl, content: "Yo! Ready to grind the lockpicking skills later?", timestamp: "10:30" }
    ],
    "friend-gta-master": [
      { id: "dm-g1", sender: "x_GTA_Master_x", senderAvatar: INITIAL_FRIENDS[2].avatarUrl, content: "Did you download the new Skyline tire config?", timestamp: "Monday" }
    ]
  });
  const [dmInput, setDmInput] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const dmEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages, socialTab]);

  useEffect(() => {
    dmEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedFriendForDM, dms, socialTab]);

  const handleSendGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalInput.trim()) return;

    const myMsg: ChatMessage = {
      id: `msg-me-${Date.now()}`,
      sender: userName || "AndroidCfxUser",
      senderAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${userName}`,
      senderColor: "#ff5e1a",
      content: globalInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setGlobalMessages(prev => [...prev, myMsg]);
    const writtenInput = globalInput;
    setGlobalInput("");

    // Simulate active players chat reply
    setTimeout(() => {
      const randomBotIdx = Math.floor(Math.random() * BOT_NAMES.length);
      const randomAvatarIdx = Math.floor(Math.random() * BOT_AVATARS.length);
      const randomColorIdx = Math.floor(Math.random() * BOT_NICKNAME_COLORS.length);
      
      let replyText = "We should connect up soon!";
      
      // Context replies
      if (writtenInput.toLowerCase().includes("pixel")) {
        replyText = "Seriously NoPixel is unmatched in serious economy rules.";
      } else if (writtenInput.toLowerCase().includes("drift")) {
        replyText = "Tandem drifting is amazing. Set rear camber to -3.5 degrees for maximum control.";
      } else if (writtenInput.toLowerCase().includes("ping") || writtenInput.toLowerCase().includes("lag")) {
        replyText = "Cfx servers are extremely optimized, my mobile ping is stable at 24ms.";
      } else {
        const botOptions = CONTEXTUAL_BOT_REPLIES.global;
        replyText = botOptions[Math.floor(Math.random() * botOptions.length)];
      }

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: BOT_NAMES[randomBotIdx],
        senderAvatar: BOT_AVATARS[randomAvatarIdx],
        senderColor: BOT_NICKNAME_COLORS[randomColorIdx],
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setGlobalMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const handleSendDM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmInput.trim() || !selectedFriendForDM) return;

    const friendId = selectedFriendForDM.id;
    const myMsg: ChatMessage = {
      id: `dm-me-${Date.now()}`,
      sender: "You",
      senderAvatar: "",
      content: dmInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setDms(prev => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), myMsg]
    }));
    
    const textChatted = dmInput;
    setDmInput("");

    // Setup simulated targeted bot replies
    setTimeout(() => {
      const friendReplies = CONTEXTUAL_BOT_REPLIES[selectedFriendForDM.username] || [
        "Yeah absolutely! Let me know when you join.",
        "Check local server build details too.",
        "Catch you online shortly, code 10-4!"
      ];
      const botResponse = friendReplies[Math.floor(Math.random() * friendReplies.length)];
      
      const botMsg: ChatMessage = {
        id: `dm-bot-${Date.now()}`,
        sender: selectedFriendForDM.username,
        senderAvatar: selectedFriendForDM.avatarUrl,
        content: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setDms(prev => ({
        ...prev,
        [friendId]: [...(prev[friendId] || []), botMsg]
      }));
    }, 1500);
  };

  const openDMChatWithFriend = (friend: Friend) => {
    setSelectedFriendForDM(friend);
    setSocialTab("dm");
  };

  return (
    <div id="social-screen" className="pb-24">
      {/* Social Tab Navigation */}
      <div className="flex border-b border-fivem-border/60 mb-6 bg-fivem-surface/40 p-1.5 rounded-2xl">
        <button
          id="social-tab-general-chat"
          onClick={() => setSocialTab("chat")}
          className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            socialTab === "chat" 
              ? "bg-fivem-orange text-white shadow-lg" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <MessageSquare size={14} />
          Cfx Global Chat
        </button>

        <button
          id="social-tab-friends-list"
          onClick={() => setSocialTab("friends")}
          className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            socialTab === "friends" 
              ? "bg-fivem-orange text-white shadow-lg" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Users size={14} />
          Friends List 
          <span className="bg-black/30 text-emerald-400 px-1.5 py-0.5 rounded-md text-[10px] font-mono">
            {friends.filter(f => f.status !== "offline").length}
          </span>
        </button>

        <button
          id="social-tab-dm-simulator"
          onClick={() => setSocialTab("dm")}
          className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            socialTab === "dm" 
              ? "bg-fivem-orange text-white shadow-lg" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <MessageSquare size={14} className="fill-current" />
          Direct Messages
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {socialTab === "chat" && (
        <div id="cfx-global-chat-panel" className="glass-panel rounded-2xl border border-fivem-border flex flex-col h-[65vh] overflow-hidden">
          {/* Channel Header */}
          <div className="bg-black/40 border-b border-fivem-border/40 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-white">#cfx-lounge-room</h3>
                <p className="text-[10px] text-gray-400">Live worldwide discussion channel for Cfx.re mobile players</p>
              </div>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/10 text-fivem-orange border border-fivem-orange/30 font-mono">
              21,482 USERS
            </span>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {globalMessages.map((msg) => (
              <div 
                id={`chatmsg-${msg.id}`}
                key={msg.id} 
                className={`flex gap-3 text-xs ${msg.isMe ? "justify-end" : "justify-start"}`}
              >
                {!msg.isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-fivem-border bg-black shrink-0">
                    <img src={msg.senderAvatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                
                <div className={`space-y-1 max-w-[80%] ${msg.isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2">
                    <span 
                      style={{ color: msg.senderColor || "var(--color-fivem-orange)" }} 
                      className="font-bold font-mono"
                    >
                      {msg.sender}
                    </span>
                    <span className="text-[9px] text-gray-500">{msg.timestamp}</span>
                  </div>
                  <div className={`p-3 rounded-2xl leading-relaxed text-gray-200 ${
                    msg.isMe 
                      ? "bg-fivem-orange rounded-tr-none text-white shadow-md" 
                      : "bg-black/30 border border-fivem-border/50 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Message form entry */}
          <form onSubmit={handleSendGlobal} className="p-3 bg-black/20 border-t border-fivem-border/40 flex items-center gap-2">
            <input
              id="global-chat-input"
              type="text"
              placeholder="What's going down in Los Santos? Type rules..."
              value={globalInput}
              onChange={(e) => setGlobalInput(e.target.value)}
              className="flex-grow bg-black/40 border border-fivem-border rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-fivem-orange"
            />
            <button 
              id="global-chat-send"
              type="submit"
              className="p-2.5 rounded-xl bg-fivem-orange hover:bg-fivem-orange-hover text-white transition-colors cursor-pointer"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {socialTab === "friends" && (
        <div id="friends-list-panel" className="space-y-4">
          <div className="flex items-center justify-between border-b border-fivem-border/40 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 font-mono">Global Synchronized Buddies</h3>
            <span className="text-[10px] text-gray-400">Tap to direct message</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {friends.map((friend) => (
              <div
                id={`friend-card-${friend.id}`}
                key={friend.id}
                onClick={() => openDMChatWithFriend(friend)}
                className="glass-panel hover:bg-fivem-surface rounded-xl p-4 border border-fivem-border/55 flex items-center justify-between transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-4.5 min-w-0">
                  {/* Photo container */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-fivem-border bg-black">
                      <img src={friend.avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    {/* Status badge positioning */}
                    <span className={`absolute -right-1.5 -bottom-1 w-3.5 h-3.5 rounded-full border-2 border-fivem-surface ${
                      friend.status === "online" ? "bg-emerald-400" :
                      friend.status === "playing" ? "bg-orange-500" :
                      friend.status === "idle" ? "bg-yellow-400" : "bg-gray-500"
                    }`} />
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-sm font-bold text-white group-hover:text-fivem-orange transition-colors">
                      {friend.username}
                    </h4>
                    <p className="text-[11px] text-gray-400 truncate max-w-xs">{friend.tagline}</p>
                    {friend.status === "playing" && (
                      <div className="text-[10px] text-orange-400 font-mono flex items-center gap-1">
                        <Activity size={10} />
                        <span>Active: {friend.activity}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Join and chat triggers */}
                <div className="flex items-center gap-2">
                  {friend.status === "playing" && friend.activity && (
                    <button
                      id={`join-friend-${friend.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Open server connecting
                        onJoinServerByShortName(friend.activity!);
                      }}
                      className="bg-fivem-orange/10 hover:bg-fivem-orange text-fivem-orange hover:text-white px-2.5 py-1.5 rounded-lg border border-fivem-orange/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title={`Instant Join: ${friend.activity}`}
                    >
                      <Play size={10} className="fill-current" />
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {socialTab === "dm" && (
        <div id="dm-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[65vh]">
          {/* Left contact selector column */}
          <div className="lg:col-span-1 bg-black/20 rounded-2xl border border-fivem-border/60 p-3 h-full overflow-y-auto space-y-2">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-500 font-mono border-b border-fivem-border/40 pb-2">Chats</h4>
            {friends.filter(f => f.status !== "offline").map((fr) => (
              <button
                id={`dm-friend-btn-${fr.id}`}
                key={fr.id}
                onClick={() => setSelectedFriendForDM(fr)}
                className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                  selectedFriendForDM?.id === fr.id 
                    ? "bg-fivem-orange/25 border border-fivem-orange/50" 
                    : "hover:bg-fivem-surface/40"
                }`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-fivem-border shrink-0 bg-black">
                  <img src={fr.avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white">{fr.username}</div>
                  <div className="text-[9px] text-gray-400 truncate">{fr.tagline}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Right Direct chat box */}
          <div className="lg:col-span-2 glass-panel rounded-2xl border border-fivem-border flex flex-col h-full overflow-hidden">
            {selectedFriendForDM ? (
              <>
                {/* Header */}
                <div className="bg-black/40 border-b border-fivem-border/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-fivem-border">
                      <img src={selectedFriendForDM.avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">{selectedFriendForDM.username}</h3>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                        Live Sync Established
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono">{selectedFriendForDM.tagline}</span>
                </div>

                {/* DM Message stream */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {(dms[selectedFriendForDM.id] || []).map((msg) => (
                    <div 
                      id={`dm-msg-${msg.id}`}
                      key={msg.id} 
                      className={`flex gap-3 text-xs ${msg.isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!msg.isMe && (
                        <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-fivem-border">
                          <img src={msg.senderAvatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="space-y-0.5 max-w-[80%]">
                        <div className="flex items-center gap-1.5 justify-between">
                          <span className="font-bold text-gray-400 text-[10px]">{msg.isMe ? "You" : msg.sender}</span>
                          <span className="text-[9px] text-gray-500 font-mono">{msg.timestamp}</span>
                        </div>
                        <div className={`p-2.5 rounded-xl leading-relaxed text-gray-200 ${
                          msg.isMe 
                            ? "bg-fivem-orange rounded-tr-none text-white shadow-md font-sans" 
                            : "bg-black/30 border border-fivem-border rounded-tl-none font-sans"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={dmEndRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleSendDM} className="p-3 bg-black/20 border-t border-fivem-border/40 flex items-center gap-2">
                  <input
                    id="dm-chat-input"
                    type="text"
                    placeholder={`Direct message ${selectedFriendForDM.username}...`}
                    value={dmInput}
                    onChange={(e) => setDmInput(e.target.value)}
                    className="flex-grow bg-black/40 border border-fivem-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-fivem-orange font-mono"
                  />
                  <button 
                    id="dm-chat-send"
                    type="submit"
                    className="p-2 bg-fivem-orange hover:bg-fivem-orange-hover text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </>
            ) : (
              <div id="no-dm-selected" className="m-auto text-center space-y-2 p-6">
                <span className="text-5xl">💬</span>
                <h4 className="text-sm font-semibold text-gray-400">No Chat Selected</h4>
                <p className="text-xs text-gray-600 max-w-xs mx-auto">Select a nearby online buddy from the left panel to engage in interactive private messaging dialogues!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
