import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Newspaper, 
  Activity, 
  CheckCircle2, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  ExternalLink,
  Smartphone,
  ChevronRight,
  Sparkles,
  Users
} from "lucide-react";
import { NewsItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "FiveM Android Client Beta is Live!",
    excerpt: "The wait is over. Experience the Cfx.re platform directly on your mobile device, browse, chat, track your servers, and connect remotely.",
    content: "We are thrilled to introduce the first phase of the FiveM Android Launcher Client. Designed from the ground up for high performance, this app allows GTA V roleplay communities to stay synced with their active characters, participate in live Global CFX Chats, review server updates, check ping speeds, and command remote server interfaces directly. Select your chosen theme in settings to match your custom gaming setup!",
    date: "2026-06-21",
    author: "Cfx.re Core Team",
    category: "Cfx.re Update",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    likes: 1242,
    comments: 89,
  },
  {
    id: "news-2",
    title: "NoPixel v4.2 Mobile Companion Integration",
    excerpt: "NoPixel introduces deep client sync for Android users. Manage your character inventories, receive dispatch alerts, and coordinate heist maps.",
    content: "With the latest NoPixel v4.2 update, players can pair their desktop client, securely log in via Cfx.re, and access the in-game mobile phone interface. Check real-time vehicle GPS, trade on the electronic LS Network, read incoming city emails, and talk to your gang contacts via live mobile remote notifications.",
    date: "2026-06-19",
    author: "Koil & Devs",
    category: "Server Highlight",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800",
    likes: 3105,
    comments: 423,
  },
  {
    id: "news-3",
    title: "Optimizing Mobile Server Streaming",
    excerpt: "Learn how server developers use specific Cfx assets compression to ensure seamless mobile Companion layouts and super-fast connection speeds.",
    content: "Streamlining custom GTA assets (vehicles, custom skin textures, sound files) represents a key priority for mobile compatibility. Our latest SDK guidelines describe the automated resizing and adaptive streaming mechanics that developers can activate to lower ping times to under 30ms.",
    date: "2026-06-15",
    author: "Cfx.re Dev Staff",
    category: "Patch Notes",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800",
    likes: 852,
    comments: 34,
  }
];

interface HomeFeedProps {
  onNavigateToServers: () => void;
  onNavigateToSocial: () => void;
  activePlayersCount: number;
  activeServersCount: number;
}

export default function HomeFeed({ 
  onNavigateToServers, 
  onNavigateToSocial,
  activePlayersCount,
  activeServersCount
}: HomeFeedProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % news.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [news.length]);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedArticles[id];
    setLikedArticles(prev => ({ ...prev, [id]: !isLiked }));
    setNews(prevNews => 
      prevNews.map(item => 
        item.id === id 
          ? { ...item, likes: item.likes + (isLiked ? -1 : 1) }
          : item
      )
    );
  };

  const currentNewsItem = news[currentSlide];

  return (
    <div id="home-feed-screen" className="space-y-6 pb-20">
      {/* Dynamic Slide Show Hero Banner */}
      <div className="relative h-60 md:h-80 rounded-2xl overflow-hidden shadow-2xl border border-fivem-border/60">
        <div className="absolute inset-0 z-0">
          <img 
            src={currentNewsItem.imageUrl} 
            alt={currentNewsItem.title} 
            className="w-full h-full object-cover brightness-40 transition-all duration-1000 transform scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-fivem-dark via-fivem-dark/50 to-transparent" />
        </div>

        {/* Floating Indicator Category */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-fivem-orange text-white uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <Sparkles size={11} />
            {currentNewsItem.category}
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-black/60 text-gray-300 backdrop-blur-sm">
            {currentNewsItem.date}
          </span>
        </div>

        {/* Slider Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-1.5 bg-black/50 p-1 rounded-full backdrop-blur-xs">
          {news.map((_, idx) => (
            <button
              id={`slide-dot-${idx}`}
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-fivem-orange w-6' : 'bg-gray-500 hover:bg-gray-300'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Content Box */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 z-10 flex flex-col justify-end h-full">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2 max-w-2xl"
          >
            <h1 className="text-xl md:text-3xl font-bold font-display text-white leading-tight filter drop-shadow-md">
              {currentNewsItem.title}
            </h1>
            <p className="text-gray-200 text-xs md:text-sm line-clamp-2 md:line-clamp-3">
              {currentNewsItem.excerpt}
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-gray-400">
              <span className="font-semibold text-gray-300">By {currentNewsItem.author}</span>
              <div className="flex items-center gap-3">
                <button 
                  id={`btn-like-${currentNewsItem.id}`}
                  onClick={(e) => handleLike(currentNewsItem.id, e)}
                  className={`flex items-center gap-1.5 transition-colors ${likedArticles[currentNewsItem.id] ? 'text-fivem-orange' : 'hover:text-white'}`}
                >
                  <ThumbsUp size={14} className={likedArticles[currentNewsItem.id] ? "fill-fivem-orange" : ""} />
                  <span>{currentNewsItem.likes}</span>
                </button>
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={14} />
                  <span>{currentNewsItem.comments} comments</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid of Launcher Statistics & Service Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Statistics Box */}
        <div id="stats-widget" className="glass-panel rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Users size={12} className="text-fivem-orange" />
              Active Global Players
            </span>
            <div className="text-2xl font-bold font-mono text-white glow-orange">
              {activePlayersCount.toLocaleString()}
            </div>
            <p className="text-[10px] text-gray-500">Live peak synced across all devices</p>
          </div>
          <div className="bg-fivem-orange/10 p-3 rounded-lg border border-fivem-orange/20 animate-pulse">
            <Activity className="text-fivem-orange" size={24} />
          </div>
        </div>

        {/* Servers Box */}
        <div id="servers-widget" className="glass-panel rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Flame size={12} className="text-orange-500" />
              Indexed Servers
            </span>
            <div className="text-2xl font-bold font-mono text-white">
              {activeServersCount.toLocaleString()}
            </div>
            <p className="text-[10px] text-gray-500">Live verified RP, Drift, & Zombie games</p>
          </div>
          <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
            <Flame className="text-orange-500" size={24} />
          </div>
        </div>

        {/* Cfx.re Services Integrity */}
        <div id="services-health" className="glass-panel rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-fivem-border/40 pb-2 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Cfx.re Services</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/30">
              ALL SYSTEMS UP
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={11} className="text-emerald-400" />
              <span className="text-gray-300">Web Lobby</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={11} className="text-emerald-400" />
              <span className="text-gray-300">Cfx Auth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={11} className="text-emerald-400" />
              <span className="text-gray-300">Server List</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={11} className="text-emerald-400" />
              <span className="text-gray-300">Content CDN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Actions & News Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: News blog posts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Newspaper size={18} className="text-fivem-orange" />
            <h2 className="text-lg font-bold font-display text-white uppercase tracking-tight">Community News & Blog</h2>
          </div>

          <div className="space-y-4">
            {news.map((item) => (
              <div 
                id={`article-${item.id}`}
                key={item.id} 
                className="glass-panel hover:bg-fivem-surface/90 rounded-xl p-4 transition-all duration-300 flex flex-col md:flex-row gap-4 border border-fivem-border/40 hover:border-fivem-orange/30 group cursor-pointer"
              >
                <div className="w-full md:w-40 h-28 rounded-lg overflow-hidden shrink-0 bg-black/40">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-between flex-grow space-y-1.5">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-fivem-orange uppercase tracking-wider">{item.category}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{item.date}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white group-hover:text-fivem-orange transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-fivem-border/30">
                    <span>By {item.author}</span>
                    <div className="flex items-center gap-3">
                      <button 
                        id={`like-footer-${item.id}`}
                        onClick={(e) => handleLike(item.id, e)} 
                        className={`flex items-center gap-1 ${likedArticles[item.id] ? 'text-fivem-orange font-semibold' : 'hover:text-gray-300'}`}
                      >
                        <ThumbsUp size={12} className={likedArticles[item.id] ? "fill-fivem-orange" : ""} />
                        <span>{item.likes}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={12} />
                        <span>{item.comments}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Links & Mobile Client Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone size={18} className="text-fivem-orange" />
            <h2 className="text-lg font-bold font-display text-white uppercase tracking-tight">Android Companion</h2>
          </div>

          <div className="glass-panel rounded-xl p-5 border border-fivem-border/60 bg-gradient-to-br from-fivem-surface to-fivem-dark relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-fivem-orange/10 rounded-full blur-2xl" />
            
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2 mb-3">
              <span className="w-1.5 h-4 bg-fivem-orange rounded-full inline-block" />
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button 
                id="action-browse-servers"
                onClick={onNavigateToServers}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-fivem-orange/[0.06] hover:bg-fivem-orange/20 border border-fivem-orange/20 hover:border-fivem-orange/40 transition-all text-left group"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-fivem-orange transition-colors">Server Explorer</div>
                  <div className="text-[10px] text-gray-400">Search and join 8,000+ communities</div>
                </div>
                <ChevronRight size={16} className="text-fivem-orange transform transition-transform group-hover:translate-x-1" />
              </button>

              <button 
                id="action-global-social"
                onClick={onNavigateToSocial}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-fivem-border hover:border-gray-500 transition-all text-left group"
              >
                <div>
                  <div className="text-xs font-semibold text-white">Cfx Lounge Chat</div>
                  <div className="text-[10px] text-gray-400">Chat with players, sync active list</div>
                </div>
                <ChevronRight size={16} className="text-gray-400 transform transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Tips Widget */}
          <div className="glass-panel rounded-xl p-5 border border-fivem-border/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-fivem-orange flex items-center gap-1.5 mb-2.5">
              <Sparkles size={13} />
              Android Tip of the Day
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Enable "Save UI Audios" in Settings to hear the original mechanical click sound effects when switching tabs, replicating the FiveM Desktop layout feel!
            </p>
          </div>

          {/* Cfx.re Links */}
          <div className="glass-panel p-4 rounded-xl border border-fivem-border/40 text-xs space-y-2.5">
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Official Channels</div>
            <a 
              href="https://fivem.net" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center justify-between text-gray-300 hover:text-fivem-orange transition-colors"
            >
              <span>Official Website</span>
              <ExternalLink size={12} />
            </a>
            <a 
              href="https://forum.cfx.re" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center justify-between text-gray-300 hover:text-fivem-orange transition-colors"
            >
              <span>Cfx.re Forums</span>
              <ExternalLink size={12} />
            </a>
            <a 
              href="https://github.com/citizenfx/fivem" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center justify-between text-gray-300 hover:text-fivem-orange transition-colors"
            >
              <span>GitHub Source</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
