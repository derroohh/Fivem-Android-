import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Wifi, 
  Star, 
  ThumbsUp, 
  Compass, 
  ServerIcon,
  Play,
  X,
  Plus,
  RefreshCw,
  Info,
  Clock,
  ExternalLink,
  Code
} from "lucide-react";
import { Server } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ServerBrowserProps {
  onConnect: (server: Server) => void;
  favorites: string[];
  history: string[];
  toggleFavorite: (serverId: string) => void;
}

const INITIAL_SERVERS: Server[] = [
  {
    id: "server-nopixel",
    name: "NoPixel 4.0 Serious Roleplay Client",
    shortName: "NoPixel 4.0",
    description: "The gold standard of GTA RP. Serious roleplay with custom mechanics, deep legal and crime dynamics, a reactive economy, and dedicated developer teams.",
    players: 492,
    maxPlayers: 500,
    ping: 11,
    tags: ["Roleplay", "Custom", "NoPixel", "Serious"],
    owner: "Koil",
    region: "Americas",
    iconUrl: "https://images.unsplash.com/photo-1538481199705-c71044e8c65b?auto=format&fit=crop&q=80&w=200",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    upvotes: 4892,
    gameBuild: "b3095 (Chop Shop)",
    ipAddress: "nopixel.cfx.re:30120",
    featured: true
  },
  {
    id: "server-eclipse",
    name: "Eclipse RP - Real Economy Lifestyle",
    shortName: "Eclipse RP",
    description: "A huge, stable community. Choose to purchase luxurious high-end properties, trade properties on standard indices, work as a mechanic, or lead complex cartels.",
    players: 384,
    maxPlayers: 450,
    ping: 16,
    tags: ["Roleplay", "ESX", "Economy", "Jobs"],
    owner: "EclipseDevGroup",
    region: "Europe",
    iconUrl: "https://images.unsplash.com/photo-1611512578047-dfb367046420?auto=format&fit=crop&q=80&w=200",
    bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800",
    upvotes: 3512,
    gameBuild: "b2802 (San Andreas Mercenaries)",
    ipAddress: "eclipse.cfx.re:30120",
    featured: true
  },
  {
    id: "server-drift-central",
    name: "San Andreas Drift Club - Pro Physics",
    shortName: "SA Drift Club",
    description: "The absolute premium drift engine server! Features custom real-world vehicles, interactive tuning sliders, race tracks, tandem zones, and passive multiplayer states.",
    players: 42,
    maxPlayers: 100,
    ping: 35,
    tags: ["Drift", "Racing", "Custom-Cars"],
    owner: "JDM_Stance",
    region: "Americas",
    iconUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=200",
    bannerUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800",
    upvotes: 1245,
    gameBuild: "b2699 (The Criminal Enterprises)",
    ipAddress: "driftcentral.cfx.re:30120"
  },
  {
    id: "server-zombie-outbreak",
    name: "Doomsday RP - Survival Zombie Apocalypse",
    shortName: "Doomsday Zombie",
    description: "Scavenge through ruins of San Andreas. Find military rifles, gather canned beans, fight infected hordes, and fortify safe zones with your survival clan.",
    players: 56,
    maxPlayers: 90,
    ping: 28,
    tags: ["Zombie", "Survival", "Serious"],
    owner: "ZombieNation_Staff",
    region: "Europe",
    iconUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=200",
    bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
    upvotes: 912,
    gameBuild: "b2372 (Los Santos Tuners)",
    ipAddress: "doomsdayz.cfx.re:30120"
  },
  {
    id: "server-matrix",
    name: "Matrix Freeroam & Stunts SandBox",
    shortName: "Matrix Sandbox",
    description: "Full player console access! Spawn vehicles, activate jetpacks, teleport across the map, test customized military weapon configs, and clear high-speed loops with your friends.",
    players: 18,
    maxPlayers: 120,
    ping: 42,
    tags: ["Custom", "Freeroam", "Racing"],
    owner: "AdminMatrix",
    region: "Asia-Pacific",
    iconUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    upvotes: 752,
    gameBuild: "b1604 (Arena War)",
    ipAddress: "matrixfreeroam.cfx.re:30120"
  },
  {
    id: "server-vibecity",
    name: "Vibe City serious QB-Core Roleplay",
    shortName: "Vibe City",
    description: "Highly optimized QB-Core base server. Perfect legal career options, legal defense unions, real estate sales, and underground import tuner clubs.",
    players: 110,
    maxPlayers: 200,
    ping: 19,
    tags: ["Roleplay", "QB-Core", "Economy", "Custom-Cars"],
    owner: "VibeDevs",
    region: "Americas",
    iconUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    upvotes: 1890,
    gameBuild: "b3095 (Chop Shop)",
    ipAddress: "vibecity.cfx.re:30120"
  },
  {
    id: "server-evolutiondrift",
    name: "Evolution Drift Central - Real Handling",
    shortName: "Evolution Drift",
    description: "Custom suspension simulation curves! Drift down Mt. Chiliad, try street loops, customize rims, and change direct grip coefficients locally on your dashboard.",
    players: 28,
    maxPlayers: 64,
    ping: 31,
    tags: ["Drift", "Racing", "Custom-Cars"],
    owner: "MtChiliad_King",
    region: "Europe",
    iconUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=200",
    bannerUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
    upvotes: 681,
    gameBuild: "b2189 (Cayo Perico Heist)",
    ipAddress: "evodrift.cfx.re:30120"
  },
  {
    id: "server-apex",
    name: "Apex Roleplay Life - ESX Serious",
    shortName: "Apex RP",
    description: "Perfect framework balance for legal/illegal dynamics. Active emergency dispatch loops, judges courts, bank vault hacking, and drug territory progression.",
    players: 94,
    maxPlayers: 150,
    ping: 23,
    tags: ["Roleplay", "ESX", "Economy", "Serious"],
    owner: "ApexLife_Staff",
    region: "Americas",
    iconUrl: "https://images.unsplash.com/photo-1538481199705-c71044e8c65b?auto=format&fit=crop&q=80&w=200",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    upvotes: 1195,
    gameBuild: "b2802 (San Andreas Mercenaries)",
    ipAddress: "apexroleplay.cfx.re:30120"
  }
];

const MOCK_ONLINE_PLAYERS: Record<string, string[]> = {
  "server-nopixel": [
    "Captain_Underwood [12]", "Tony_Corleone [45]", "LSPD_Hutch_808 [101]", 
    "xQ_Mitch [224]", "Randy_Bullet [309]", "Krayzee_Karl [421]"
  ],
  "server-eclipse": [
    "Michael_Sloane [18]", "Officer_Hardy [29]", "MafiaBoss_Gino [44]", 
    "Dr_Stacy_Miller [58]", "Taximan_Bob [83]", "Sydnes_Vance [112]"
  ],
  "server-drift-central": [
    "AE86_Takumi [1]", "Silvia_King [4]", "Tandem_God [16]", 
    "GTR_Stance [25]", "DriftKid_99 [31]"
  ],
  "server-zombie-outbreak": [
    "Survivor_Rick [3]", "LootHoarder_Joe [8]", "Daryl_Crossbow [15]", 
    "Medic_Clara [22]", "ZombieSlayerX [35]"
  ]
};

export default function ServerBrowser({ onConnect, favorites, history, toggleFavorite }: ServerBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"players" | "ping" | "upvotes" | "name">("upvotes");
  const [activeRegion, setActiveRegion] = useState<string>("All");
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS);
  const [directConnectIp, setDirectConnectIp] = useState("");
  const [tabType, setTabType] = useState<"all" | "favorites" | "history">("all");

  const AVAILABLE_TAGS = ["Roleplay", "Drift", "Zombie", "Racing", "Custom", "ESX", "QB-Core", "NoPixel", "Serious", "Economy"];
  const REGIONS = ["All", "Americas", "Europe", "Asia-Pacific"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setServers(prevServers => 
      prevServers.map(serv => 
        serv.id === id ? { ...serv, upvotes: serv.upvotes + 1 } : serv
      )
    );
    if (selectedServer?.id === id) {
      setSelectedServer(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
    }
  };

  const filteredServers = useMemo(() => {
    return servers.filter(server => {
      // Search text matches (name, short name, tags, description)
      const matchesSearch = 
        server.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        server.shortName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        server.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      // Tags selection matches (AND matches)
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.every(t => server.tags.some(st => st.toLowerCase() === t.toLowerCase()));

      // Region matches
      const matchesRegion = 
        activeRegion === "All" || 
        server.region === activeRegion;

      // Group tab selection (Favorites/History)
      let matchesTab = true;
      if (tabType === "favorites") {
        matchesTab = favorites.includes(server.id);
      } else if (tabType === "history") {
        matchesTab = history.includes(server.id);
      }

      return matchesSearch && matchesTags && matchesRegion && matchesTab;
    }).sort((a, b) => {
      if (sortBy === "players") return b.players - a.players;
      if (sortBy === "ping") return a.ping - b.ping;
      if (sortBy === "upvotes") return b.upvotes - a.upvotes;
      return a.name.localeCompare(b.name);
    });
  }, [servers, searchTerm, selectedTags, activeRegion, sortBy, tabType, favorites, history]);

  const handleDirectConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directConnectIp.trim()) return;

    // Create a mock server representation for direct connection
    const directServer: Server = {
      id: `server-direct-${Date.now()}`,
      name: `Direct Connected Host`,
      shortName: directConnectIp.split(":")[0],
      description: `Manually connecting via IP address: ${directConnectIp}. Connecting to game instance client build configuration.`,
      players: 1,
      maxPlayers: 128,
      ping: 25,
      tags: ["Direct Connect"],
      owner: "Custom Owner",
      region: "Direct Location",
      iconUrl: "",
      bannerUrl: "",
      upvotes: 1,
      gameBuild: "b3095 (Chop Shop)",
      ipAddress: directConnectIp
    };

    onConnect(directServer);
  };

  return (
    <div id="server-browser-screen" className="relative pb-24">
      {/* Search and Action Bar */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Search Input */}
          <div id="server-search-container" className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              id="server-search"
              type="text" 
              placeholder="Search Cfx.re verified servers, game builds, developers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-fivem-surface hover:bg-fivem-surface/80 focus:bg-fivem-surface border border-fivem-border focus:border-fivem-orange/70 outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 transition-all font-mono"
            />
          </div>

          {/* Tab Filter Type Selector */}
          <div className="flex bg-fivem-surface rounded-xl p-1 border border-fivem-border">
            <button
              id="tab-all-servers"
              onClick={() => setTabType("all")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${tabType === "all" ? "bg-fivem-orange text-white shadow-md font-bold" : "text-gray-400 hover:text-white"}`}
            >
              <Compass size={13} />
              All Servers
            </button>
            <button
              id="tab-fav-servers"
              onClick={() => setTabType("favorites")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${tabType === "favorites" ? "bg-fivem-orange text-white shadow-md font-bold" : "text-gray-400 hover:text-white"}`}
            >
              <Star size={13} className={tabType === "favorites" ? "fill-white" : ""} />
              Saved ({favorites.length})
            </button>
            <button
              id="tab-hist-servers"
              onClick={() => setTabType("history")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${tabType === "history" ? "bg-fivem-orange text-white shadow-md font-bold" : "text-gray-400 hover:text-white"}`}
            >
              <Clock size={13} />
              History ({history.length})
            </button>
          </div>
        </div>

        {/* Region & Sort Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-1.5">
          {/* Region Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-black/30 p-1 rounded-xl border border-fivem-border/40">
            {REGIONS.map(reg => (
              <button
                id={`region-btn-${reg.toLowerCase().replace(" ", "-")}`}
                key={reg}
                onClick={() => setActiveRegion(reg)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeRegion === reg ? "bg-fivem-border/80 text-white font-semibold" : "text-gray-400 hover:text-gray-200"}`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Sort Selection dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={12} className="text-fivem-orange" />
            <span className="text-xs text-gray-400 font-mono">Sort by:</span>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-fivem-surface border border-fivem-border/60 rounded-lg text-xs text-gray-200 px-3 py-1.5 outline-none focus:border-fivem-orange font-mono cursor-pointer"
            >
              <option value="upvotes">🔥 Upvotes / Core</option>
              <option value="players">👥 Online Players</option>
              <option value="ping">⚡ Connection Ping</option>
              <option value="name">🔤 Alphabetic Name</option>
            </select>
          </div>
        </div>

        {/* Tags Selection List */}
        <div id="tags-chips-container" className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-[10px] uppercase font-bold text-gray-500 font-mono whitespace-nowrap shrink-0">Tags:</span>
          {AVAILABLE_TAGS.map(tag => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                id={`tag-chip-${tag.toLowerCase()}`}
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap border transition-all ${
                  isSelected 
                    ? "bg-fivem-orange/15 text-fivem-orange border-fivem-orange/55 font-semibold" 
                    : "bg-fivem-surface/40 text-gray-400 border-fivem-border hover:border-gray-600 hover:text-white"
                }`}
              >
                {tag}
              </button>
            );
          })}
          {selectedTags.length > 0 && (
            <button 
              id="clear-tags-btn"
              onClick={() => setSelectedTags([])} 
              className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 whitespace-nowrap uppercase font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Direct Connect Form Box */}
      <div className="mb-6 bg-gradient-to-r from-fivem-dark to-fivem-surface/60 rounded-xl p-4 border border-fivem-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-fivem-orange/10 p-2.5 rounded-lg border border-fivem-orange/20 shrink-0">
            <Play className="text-fivem-orange fill-fivem-orange" size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-200">Direct Connection Console</h3>
            <p className="text-[10px] text-gray-400">Instantly dial a private IP or custom port address</p>
          </div>
        </div>
        <form onSubmit={handleDirectConnect} className="flex gap-2 w-full md:w-auto flex-grow max-w-md">
          <input 
            id="direct-connect-ip"
            type="text" 
            placeholder="e.g. 192.168.1.102:30120"
            value={directConnectIp}
            onChange={(e) => setDirectConnectIp(e.target.value)}
            className="flex-grow bg-black/40 border border-fivem-border outline-none rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 font-mono"
          />
          <button 
            id="direct-connect-submit"
            type="submit" 
            className="bg-fivem-orange hover:bg-fivem-orange-hover text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            Connect
          </button>
        </form>
      </div>

      {/* Server List Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServers.length > 0 ? (
          filteredServers.map((server, rank) => {
            const isFav = favorites.includes(server.id);
            return (
              <div
                id={`server-card-${server.id}`}
                key={server.id}
                onClick={() => setSelectedServer(server)}
                className={`glass-panel hover:bg-fivem-surface cursor-pointer rounded-xl p-4 border transition-all duration-300 relative group flex gap-3.5 flex-col ${
                  server.featured 
                    ? "border-fivem-orange/45 glow-border" 
                    : "border-fivem-border/50 hover:border-gray-500"
                }`}
              >
                {/* Featured Badge */}
                {server.featured && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-fivem-orange text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                    <Star size={8} className="fill-white" />
                    Featured
                  </div>
                )}

                {/* Server Main Info Row */}
                <div className="flex gap-3">
                  {/* Server Icon */}
                  <div className="w-12 h-12 rounded-lg bg-black/40 shrink-0 border border-fivem-border overflow-hidden flex items-center justify-center">
                    {server.iconUrl ? (
                      <img src={server.iconUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <ServerIcon className="text-gray-500" size={20} />
                    )}
                  </div>

                  {/* Text details */}
                  <div className="flex-grow min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-500">Cfx Code: {server.id.substring(0, 10)}</span>
                      <button 
                        id={`fav-btn-${server.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(server.id);
                        }}
                        className="text-gray-500 hover:text-fivem-orange transition-colors p-1"
                        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star size={14} className={isFav ? "fill-fivem-orange text-fivem-orange" : ""} />
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-fivem-orange transition-colors">
                      {server.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {server.description}
                    </p>
                  </div>
                </div>

                {/* Server Bottom Stats Row */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-fivem-border/20 pt-2.5 mt-auto">
                  {/* Players Count */}
                  <div className="flex items-center gap-1 text-gray-300 font-mono">
                    <Users size={12} className="text-fivem-orange" />
                    <span className="font-bold">{server.players}</span>
                    <span className="text-gray-500">/</span>
                    <span>{server.maxPlayers}</span>
                  </div>

                  {/* Ping representation */}
                  <div className="flex items-center gap-1 font-mono">
                    <Wifi size={12} className={server.ping < 20 ? "text-emerald-400" : server.ping < 40 ? "text-yellow-400" : "text-red-400"} />
                    <span className={server.ping < 20 ? "text-emerald-400 font-bold" : "text-gray-400"}>
                      {server.ping}ms
                    </span>
                  </div>

                  {/* Upvote Button inside list */}
                  <button
                    id={`upvote-item-${server.id}`}
                    onClick={(e) => handleUpvote(server.id, e)}
                    className="flex items-center gap-1 hover:text-white transition-all hover:scale-105"
                  >
                    <ThumbsUp size={11} className="text-fivem-orange" />
                    <span>{server.upvotes}</span>
                  </button>
                </div>

                {/* Tag pill rendering */}
                <div className="flex flex-wrap gap-1">
                  {server.tags.slice(0, 3).map((tg, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-black/30 text-gray-400 font-mono">
                      {tg}
                    </span>
                  ))}
                  {server.tags.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/30 text-gray-400 font-mono">
                      +{server.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div id="no-servers" className="col-span-full py-12 text-center space-y-3">
            <div className="text-5xl">📡</div>
            <p className="text-sm font-semibold text-gray-400">No servers match your active filters.</p>
            <p className="text-xs text-gray-600">Try refining search parameters or clearing check boxes.</p>
            <button 
              id="clear-all-search-filters"
              onClick={() => {
                setSearchTerm("");
                setSelectedTags([]);
                setActiveRegion("All");
                setTabType("all");
              }}
              className="text-xs font-bold text-fivem-orange hover:underline uppercase"
            >
              Reset Search & Filter Settings
            </button>
          </div>
        )}
      </div>

      {/* Expanded Server Details Sheet Modal */}
      <AnimatePresence>
        {selectedServer && (
          <motion.div
            id="details-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-6"
          >
            <motion.div
              id="details-modal"
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full md:max-w-2xl bg-fivem-surface border-t md:border border-fivem-border rounded-t-3xl md:rounded-2xl max-h-[92vh] overflow-y-auto shadow-2xl scanlines relative"
            >
              {/* Close Button */}
              <button
                id="close-details-modal"
                onClick={() => setSelectedServer(null)}
                className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black p-2 rounded-full border border-fivem-border transition-all cursor-pointer"
                aria-label="Close details"
              >
                <X size={16} className="text-white" />
              </button>

              {/* Banner Backdrop */}
              <div className="relative h-44 bg-gradient-to-r from-orange-600 to-fivem-orange w-full overflow-hidden">
                {selectedServer.bannerUrl ? (
                  <img src={selectedServer.bannerUrl} alt="" className="w-full h-full object-cover brightness-60" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-linear-to-tr from-fivem-dark to-fivem-surface flex items-center justify-center">
                    <Compass size={40} className="text-gray-700 animate-spin" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-fivem-surface via-transparent to-transparent" />
                
                {/* Floating details icon */}
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-black/50 border border-fivem-border overflow-hidden p-1">
                    {selectedServer.iconUrl ? (
                      <img src={selectedServer.iconUrl} alt="" className="w-full h-full object-cover rounded" referrerPolicy="no-referrer" />
                    ) : (
                      <ServerIcon className="text-gray-400 w-full h-full p-2" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-fivem-orange text-white uppercase tracking-wider font-extrabold shadow">
                      CFX Verified
                    </span>
                    <h2 className="text-lg md:text-xl font-bold text-white drop-shadow-md">
                      {selectedServer.shortName}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Server Details Grid */}
              <div className="p-6 space-y-6">
                {/* Primary stats */}
                <div className="grid grid-cols-3 gap-3 bg-black/40 p-4 rounded-xl border border-fivem-border/60">
                  <div className="text-center space-y-1">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Synced Players</div>
                    <div className="text-lg font-mono font-bold text-white flex items-center justify-center gap-1">
                      <Users size={14} className="text-fivem-orange" />
                      {selectedServer.players} / {selectedServer.maxPlayers}
                    </div>
                  </div>
                  <div className="text-center space-y-1 border-x border-fivem-border/30">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Client Ping</div>
                    <div className="text-lg font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <Wifi size={14} className="text-emerald-400" />
                      {selectedServer.ping} ms
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Sponsor Upvotes</div>
                    <button 
                      id={`upvote-modal-${selectedServer.id}`}
                      onClick={(e) => handleUpvote(selectedServer.id, e)}
                      className="text-lg font-mono font-bold text-orange-400 flex items-center justify-center gap-1 hover:text-white mx-auto transition-transform active:scale-95"
                    >
                      <ThumbsUp size={14} className="text-fivem-orange" />
                      {selectedServer.upvotes}
                    </button>
                  </div>
                </div>

                {/* Long Description */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <Info size={12} className="text-fivem-orange" />
                    Community Overview
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-fivem-border/30">
                    {selectedServer.description}
                  </p>
                </div>

                {/* Roster / Technical Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Technical Information panel */}
                  <div className="space-y-2 bg-black/20 p-4 rounded-xl border border-fivem-border/30 text-xs">
                    <h4 className="font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1 border-b border-fivem-border/40 pb-2 mb-2">
                      <Code size={12} />
                      Server Attributes
                    </h4>
                    <div className="space-y-1.5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Owner Tag:</span>
                        <span className="text-white font-semibold">{selectedServer.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cfx Region:</span>
                        <span className="text-white">{selectedServer.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Game Build:</span>
                        <span className="text-orange-400">{selectedServer.gameBuild}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Endpoint:</span>
                        <span className="text-gray-300">{selectedServer.ipAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Player Roster list */}
                  <div className="space-y-2 bg-black/20 p-4 rounded-xl border border-fivem-border/30 text-xs">
                    <h4 className="font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1 border-b border-fivem-border/40 pb-2 mb-2">
                      <Users size={12} />
                      Players Online
                    </h4>
                    <div className="grid grid-cols-2 gap-1 font-mono text-gray-400 max-h-24 overflow-y-auto">
                      {(MOCK_ONLINE_PLAYERS[selectedServer.id] || [
                        "John_Doe [18]", "Alex_Ranger [22]", "Salty_Sam [72]", "Gamer_Boy [198]", "LSPD_091 [202]"
                      ]).map((player, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                          <span className="truncate">{player}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connect button & favorite toggle action row */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    id={`modal-fav-toggle-${selectedServer.id}`}
                    onClick={() => toggleFavorite(selectedServer.id)}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold border transition-colors cursor-pointer ${
                      favorites.includes(selectedServer.id)
                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/35 hover:bg-yellow-500/20"
                        : "bg-black/20 hover:bg-black/40 text-gray-300 border-fivem-border"
                    }`}
                  >
                    <Star size={16} className={favorites.includes(selectedServer.id) ? "fill-yellow-500" : ""} />
                    {favorites.includes(selectedServer.id) ? "Bookmarked" : "Add Bookmark"}
                  </button>

                  <button
                    id={`modal-connect-btn-${selectedServer.id}`}
                    onClick={() => {
                      onConnect(selectedServer);
                      setSelectedServer(null);
                    }}
                    className="flex-grow flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-fivem-orange hover:bg-fivem-orange-hover text-white text-sm font-bold shadow-lg transition-colors cursor-pointer"
                  >
                    <Play size={16} className="fill-white" />
                    CONNECT DEVICE TO LAUNCHER
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
