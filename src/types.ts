export interface Server {
  id: string;
  name: string;
  shortName: string;
  description: string;
  players: number;
  maxPlayers: number;
  ping: number;
  tags: string[];
  owner: string;
  region: string;
  iconUrl: string;
  bannerUrl: string;
  upvotes: number;
  isFavorite?: boolean;
  gameBuild: string;
  ipAddress: string;
  featured?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: "Cfx.re Update" | "Community Spotlight" | "Server Highlight" | "Patch Notes";
  imageUrl: string;
  likes: number;
  comments: number;
}

export interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
  status: "online" | "offline" | "idle" | "playing";
  activity?: string;
  tagline: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  senderColor?: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
  isMe?: boolean;
}

export interface UserProfile {
  cfxNickname: string;
  avatarId: string;
  colorTheme: string;
  developerMode: boolean;
  gameNickname: string;
  playtimeHours: number;
  linkedDiscord: boolean;
  discordTag?: string;
}

export interface ClientSettings {
  userName: string;
  avatarId: string;
  bgTheme: "gradient" | "sunset" | "cyberpunk" | "carbon" | "gta";
  volume: number;
  uiSounds: boolean;
  limitFPS: boolean;
  fpsLimit: number;
  devConsoleEnabled: boolean;
  simulatedPingOffset: number;
  isOfflineMode?: boolean;
}
