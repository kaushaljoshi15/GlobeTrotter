'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
import {
  MessageSquare,
  Users,
  Shield,
  Sparkles,
  Plus,
  Send,
  Heart,
  Flame,
  Clock,
  Search,
  Check,
  Star,
  Globe2,
  Calendar,
  Compass,
  ArrowRight,
  RefreshCw,
  MessageCircle,
  Tag,
  CheckCircle2,
  Share2,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

interface Reply {
  id: string;
  author: string;
  isOrganizer?: boolean;
  badge?: string;
  time: string;
  text: string;
  likes?: number;
}

interface Post {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  upvotes: number;
  hasUpvoted?: boolean;
  replies: Reply[];
}

const VERIFIED_ORGANIZERS = [
  { name: 'Kenji Takahashi', country: 'Japan', flag: '🇯🇵', badge: 'Certified Master Guide', rating: 4.98, status: 'Online' },
  { name: 'Marcus Vance', country: 'Switzerland', flag: '🇨🇭', badge: 'Alpine Federation Lead', rating: 4.95, status: 'Online' },
  { name: 'Sofia Rossi', country: 'Italy', flag: '🇮🇹', badge: 'Heritage Specialist', rating: 4.97, status: 'Active 5m ago' },
  { name: 'Rajesh Sharma', country: 'India', flag: '🇮🇳', badge: 'Golden Triangle Historian', rating: 4.96, status: 'Online' },
  { name: 'Astrid Lind', country: 'Iceland', flag: '🇮🇸', badge: 'Arctic Expedition Lead', rating: 4.88, status: 'Active 12m ago' },
  { name: 'Claire Delacroix', country: 'France', flag: '🇫🇷', badge: 'Culinary Master Guide', rating: 4.92, status: 'Online' },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    author: 'Elena Rostova',
    role: 'Traveler',
    avatar: 'E',
    time: '15m ago',
    title: 'Best rail pass strategy for Zurich to Zermatt multi-city leg?',
    content: 'We are planning a 7-day multi-city trip across Switzerland. Does the Swiss Travel Pass cover the cable cars up to the Matterhorn Glacier Paradise or just up to Zermatt village?',
    category: 'Switzerland',
    tags: ['Switzerland', 'Trains', 'Budget'],
    upvotes: 38,
    hasUpvoted: false,
    replies: [
      {
        id: 'rep-1',
        author: 'Marcus Vance',
        isOrganizer: true,
        badge: 'Alpine Federation Lead 🇨🇭',
        time: '10m ago',
        text: 'The Swiss Travel Pass covers 100% of the train from Zurich to Zermatt, and gives you a 50% discount on the Matterhorn Glacier Paradise cable car! Also gives free admission to over 500 museums across Switzerland.',
        likes: 19
      }
    ]
  },
  {
    id: 'post-2',
    author: 'Aarav Patel',
    role: 'Traveler',
    avatar: 'A',
    time: '42m ago',
    title: 'Vande Bharat Express: Delhi to Agra & Jaipur booking window?',
    content: 'Planning the Golden Triangle route. How early should we book executive class seats on the Vande Bharat from Delhi to Agra and Jaipur? Do they serve breakfast on board?',
    category: 'India',
    tags: ['India', 'Vande Bharat', 'Golden Triangle'],
    upvotes: 45,
    hasUpvoted: false,
    replies: [
      {
        id: 'rep-2',
        author: 'Rajesh Sharma',
        isOrganizer: true,
        badge: 'Golden Triangle Historian 🇮🇳',
        time: '25m ago',
        text: 'Executive Chair Car (EC) opens 120 days in advance on IRCTC. Hot gourmet breakfast and tea are included in the ticket fare for the morning Vande Bharat (departs Delhi 06:00, arrives Agra 07:40)!',
        likes: 27
      }
    ]
  },
  {
    id: 'post-3',
    author: 'David Chen',
    role: 'Traveler',
    avatar: 'D',
    time: '2h ago',
    title: 'Pocket Wi-Fi vs e-SIM for high-speed train travel in Japan?',
    content: 'Traveling with 2 friends between Tokyo, Kyoto, and Osaka. Is Ubigi/Airalo eSIM fast enough on the Shinkansen, or is a dedicated pocket router better for multi-device connectivity?',
    category: 'Japan',
    tags: ['Japan', 'Tech & Connectivity', 'Shinkansen'],
    upvotes: 52,
    hasUpvoted: false,
    replies: [
      {
        id: 'rep-3',
        author: 'Kenji Takahashi',
        isOrganizer: true,
        badge: 'Certified Master Guide 🇯🇵',
        time: '1h ago',
        text: 'Both work great along the Tokaido corridor, but for 3 people, renting a portable Ninja Wi-Fi router from Haneda Airport is cheaper ($4/day total) and keeps phone batteries from draining rapidly while tethering.',
        likes: 31
      }
    ]
  },
  {
    id: 'post-4',
    author: 'Camilla Bianchi',
    role: 'Traveler',
    avatar: 'C',
    time: '4h ago',
    title: 'Best sunset dinner in Positano without paying 300 euros?',
    content: 'Looking for a cliffside trattoria with view of Amalfi coastline that serves authentic handmade seafood pasta and local chilled Greco di Tufo wine without astronomical prices.',
    category: 'Italy',
    tags: ['Italy', 'Amalfi', 'Dining'],
    upvotes: 29,
    hasUpvoted: false,
    replies: [
      {
        id: 'rep-4',
        author: 'Sofia Rossi',
        isOrganizer: true,
        badge: 'Heritage Specialist 🇮🇹',
        time: '3h ago',
        text: 'Check out Trattoria La Tagliata up in Montepertuso! Family-run, panoramic cliff views, and 4-course authentic feasts for 55 euros per person with local wine included.',
        likes: 18
      }
    ]
  },
  {
    id: 'post-5',
    author: 'Chloe Laurent',
    role: 'Traveler',
    avatar: 'C',
    time: '6h ago',
    title: 'Louvre Museum: Friday evening opening vs morning reservation?',
    content: 'Is it true that the Louvre is significantly less crowded on Friday late openings (open until 21:45)? Are the Denon wing and Mona Lisa accessible during late evening hours?',
    category: 'France',
    tags: ['France', 'Paris', 'Art & Culture'],
    upvotes: 34,
    hasUpvoted: false,
    replies: [
      {
        id: 'rep-5',
        author: 'Claire Delacroix',
        isOrganizer: true,
        badge: 'Culinary Master Guide 🇫🇷',
        time: '5h ago',
        text: 'Yes! Friday night after 18:30 has 60% fewer tour groups. The illuminated glass pyramid at night is magical. Book the 19:00 slot online in advance.',
        likes: 22
      }
    ]
  },
  {
    id: 'post-6',
    author: 'Lucas Meyer',
    role: 'Traveler',
    avatar: 'L',
    time: '8h ago',
    title: 'Alleppey Houseboat vs Kumarakom Resort for Kerala Backwaters?',
    content: 'We have 2 nights in Kerala. Should we do 1 night overnight luxury houseboat in Alleppey + 1 night resort, or 2 nights at Kumarakom Lake Resort with day cruise boat excursions?',
    category: 'India',
    tags: ['India', 'Kerala', 'Backwaters'],
    upvotes: 41,
    hasUpvoted: false,
    replies: [
      {
        id: 'rep-6',
        author: 'Rajesh Sharma',
        isOrganizer: true,
        badge: 'Golden Triangle Historian 🇮🇳',
        time: '6h ago',
        text: 'Do 1 night on a private air-conditioned premium houseboat for the sunset lagoon dinner and fresh Karimeen fish, followed by 1 night at Kumarakom for Ayurvedic spa therapy!',
        likes: 29
      }
    ]
  }
];

export default function CommunityPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'answered'>('trending');
  
  // Interactive Modal & Inline Expansion State
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('India');
  const [newPostTags, setNewPostTags] = useState('Routes, Advice');

  // Expanded replies by Post ID
  const [expandedPostIds, setExpandedPostIds] = useState<Record<string, boolean>>({ 'post-1': true, 'post-2': true });
  const [replyInputByPost, setReplyInputByPost] = useState<Record<string, string>>({});
  const [isSyncing, setIsSyncing] = useState(false);

  // Load User & Saved Discussions from localStorage + Real-Time Sync
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) {}
    }

    const saved = localStorage.getItem('gt_community_master_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
        }
      } catch (e) {}
    }

    // Real-time cross-tab sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'gt_community_master_posts' && e.newValue) {
        try { setPosts(JSON.parse(e.newValue)); } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const savePostsState = (updatedList: Post[]) => {
    setPosts(updatedList);
    localStorage.setItem('gt_community_master_posts', JSON.stringify(updatedList));
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const saved = localStorage.getItem('gt_community_master_posts');
      if (saved) {
        try { setPosts(JSON.parse(saved)); } catch (e) {}
      }
      setIsSyncing(false);
    }, 400);
  };

  const toggleExpandPost = (id: string) => {
    setExpandedPostIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpvote = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const nextUpvoted = !p.hasUpvoted;
        return {
          ...p,
          hasUpvoted: nextUpvoted,
          upvotes: nextUpvoted ? p.upvotes + 1 : Math.max(0, p.upvotes - 1)
        };
      }
      return p;
    });
    savePostsState(updated);
  };

  const handleAddReply = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (replyInputByPost[postId] || '').trim();
    if (!text) return;

    const newReply: Reply = {
      id: `rep-${Date.now()}`,
      author: user?.name || 'Explorer',
      isOrganizer: user?.role === 'organizer',
      badge: user?.role === 'organizer' ? 'Verified Tour Organizer' : 'Fellow Traveler',
      time: 'Just now',
      text,
      likes: 1
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [...p.replies, newReply]
        };
      }
      return p;
    });

    savePostsState(updated);
    setReplyInputByPost(prev => ({ ...prev, [postId]: '' }));
    setExpandedPostIds(prev => ({ ...prev, [postId]: true }));
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const parsedTags = newPostTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: user?.name || 'Explorer',
      role: user?.role === 'organizer' ? 'Tour Organizer' : 'Traveler',
      avatar: (user?.name || 'E')[0].toUpperCase(),
      time: 'Just now',
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      category: newPostCategory,
      tags: parsedTags.length > 0 ? parsedTags : [newPostCategory, 'Travel Advice'],
      upvotes: 1,
      hasUpvoted: true,
      replies: []
    };

    const updated = [newPost, ...posts];
    savePostsState(updated);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostModal(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  // Filtered & Sorted Discussions
  const filteredPosts = useMemo(() => {
    let list = [...posts];

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.author.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'trending':
        return list.sort((a, b) => b.upvotes - a.upvotes);
      case 'recent':
        return list.sort((a, b) => (b.id > a.id ? 1 : -1));
      case 'answered':
        return list.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0));
      default:
        return list;
    }
  }, [posts, selectedCategory, search, sortBy]);

  const totalDiscussions = posts.length;
  const totalVerifiedAnswers = posts.reduce((acc, p) => acc + (p.replies?.filter(r => r.isOrganizer).length || 0), 0);
  const totalHelpfulVotes = posts.reduce((acc, p) => acc + p.upvotes, 0);

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* ================= 1. HERO HEADER BANNER ================= */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c99a6b]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium">
                  <Users className="w-3.5 h-3.5 text-[#c99a6b]" />
                  <span>Real-Time Travel Network &bull; Verified Tour Guides</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>6 Organizers Online</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
                Traveler &amp; Tour Guide <span className="font-bold italic text-[#e4c29e]">Lounge.</span>
              </h1>
              
              <p className="font-serif text-base text-stone-300 mt-2 max-w-xl leading-relaxed">
                Directly connect with certified expedition organizers, ask questions about destinations, and share route advice in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-sans">
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                title="Refresh live threads"
                className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-[#0c0d10] hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#c99a6b]' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
              </button>

              <button
                onClick={() => setShowNewPostModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-xl shadow-[#c99a6b]/20 hover:shadow-[#c99a6b]/35 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ask Tour Guides</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 2. VERIFIED TOUR ORGANIZERS ONLINE STRIP ================= */}
        <div className="bg-[#14151a]/90 border border-white/10 rounded-[28px] p-5 shadow-xl font-sans space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#c99a6b]" />
              <span>Verified Expedition Organizers On Duty</span>
            </span>
            <span className="text-[11px] text-stone-400">Response within 1-2 hours</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {VERIFIED_ORGANIZERS.map((org) => (
              <div
                key={org.name}
                className="p-3 rounded-2xl bg-[#0c0d10] border border-white/5 hover:border-[#c99a6b]/40 transition-all flex items-center gap-2.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c99a6b]/20 to-[#e4c29e]/20 text-[#e4c29e] flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {org.flag}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-white truncate group-hover:text-[#e4c29e] transition-colors">{org.name}</p>
                  </div>
                  <p className="text-[10px] text-stone-400 truncate">{org.country} &bull; ⭐ {org.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 3. SEARCH, SORT & TOPIC FILTER STRIP ================= */}
        <div className="bg-[#14151a]/90 border border-white/10 p-5 rounded-[28px] flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xl font-sans">
          
          {/* Topic Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            {[
              { id: 'all', label: 'All Discussions' },
              { id: 'India', label: '🇮🇳 India' },
              { id: 'Japan', label: '🇯🇵 Japan' },
              { id: 'Switzerland', label: '🇨🇭 Switzerland' },
              { id: 'Italy', label: '🇮🇹 Italy' },
              { id: 'France', label: '🇫🇷 France' },
              { id: 'General', label: '🌐 General' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                    : 'bg-[#0c0d10] text-stone-400 border border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box & Sort Filter */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* Sorting */}
            <div className="flex items-center gap-1.5 bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-1.5 text-xs">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-stone-300 focus:outline-none cursor-pointer"
              >
                <option value="trending" className="bg-[#14151a] text-white">🔥 Most Helpful</option>
                <option value="recent" className="bg-[#14151a] text-white">⚡ Most Recent</option>
                <option value="answered" className="bg-[#14151a] text-white">🛡️ Most Replies</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions or advice..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0c0d10] border border-white/15 rounded-xl pl-10 pr-8 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b] transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ================= 4. BALANCED 2-COLUMN BALANCED CARD GRID ================= */}
        {filteredPosts.length === 0 ? (
          <div className="p-16 text-center bg-[#14151a]/60 border border-white/10 rounded-[32px] space-y-4 font-sans max-w-lg mx-auto">
            <MessageSquare className="w-12 h-12 text-[#c99a6b] mx-auto opacity-70" />
            <h3 className="font-serif text-2xl font-bold text-white">No discussions found</h3>
            <p className="text-xs text-stone-400">
              No threads match &ldquo;{search}&rdquo;. Try clearing your search or ask the first question to our verified organizers!
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); }}
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans items-start">
            {filteredPosts.map((post) => {
              const isExpanded = !!expandedPostIds[post.id];

              return (
                <div
                  key={post.id}
                  className="bg-[#14151a]/95 border border-white/10 hover:border-[#c99a6b]/40 rounded-[28px] p-6 sm:p-7 shadow-xl space-y-4 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Author & Tags Row */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] font-serif font-bold flex items-center justify-center text-sm shadow-md flex-shrink-0">
                          {post.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white font-serif">{post.author}</span>
                            <span className="text-[10px] text-stone-500">&bull; {post.time}</span>
                          </div>
                          <span className="text-[10px] text-[#e4c29e] font-sans font-medium">{post.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#c99a6b]/15 border border-[#c99a6b]/30 text-[10px] font-bold text-[#e4c29e]">
                          {post.category}
                        </span>
                        {post.tags?.slice(0, 2).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-stone-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Question Title & Content */}
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed font-sans">
                        {post.content}
                      </p>
                    </div>

                    {/* Verified Organizer Replies Stream */}
                    {post.replies && post.replies.length > 0 && (
                      <div className="space-y-2 pt-2">
                        {post.replies.slice(0, isExpanded ? post.replies.length : 1).map((rep) => (
                          <div
                            key={rep.id}
                            className="p-4 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 space-y-2 relative"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white font-serif">{rep.author}</span>
                                {rep.isOrganizer && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] border border-[#c99a6b]/30 font-bold flex items-center gap-1">
                                    <Shield className="w-2.5 h-2.5" />
                                    <span>{rep.badge || 'Verified Organizer'}</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-500">{rep.time}</span>
                            </div>

                            <p className="text-xs text-stone-300 leading-relaxed italic">
                              &ldquo;{rep.text}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Inline Reply Input & Action Buttons */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    
                    {/* Expand/Collapse Replies toggle */}
                    {post.replies?.length > 1 && (
                      <button
                        onClick={() => toggleExpandPost(post.id)}
                        className="text-[11px] font-bold text-[#e4c29e] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Collapse Replies</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>View All {post.replies.length} Replies</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Interactive Bottom Bar */}
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          post.hasUpvoted
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-stone-300 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.hasUpvoted ? 'fill-rose-400 text-rose-400' : 'text-[#c99a6b]'}`} />
                        <span>{post.upvotes} Helpful Votes</span>
                      </button>

                      <span className="text-[11px] text-stone-400">
                        {post.replies?.length || 0} Expert Answers
                      </span>
                    </div>

                    {/* Quick Inline Reply Form */}
                    <form
                      onSubmit={(e) => handleAddReply(post.id, e)}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        type="text"
                        placeholder="Write a helpful response or follow-up question..."
                        value={replyInputByPost[post.id] || ''}
                        onChange={(e) => setReplyInputByPost({ ...replyInputByPost, [post.id]: e.target.value })}
                        className="flex-1 bg-[#0c0d10] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                      />
                      <button
                        type="submit"
                        disabled={!(replyInputByPost[post.id] || '').trim()}
                        className="px-3.5 py-2 rounded-xl bg-[#c99a6b] hover:bg-[#dfb182] disabled:opacity-40 text-[#0c0d10] text-xs font-bold transition-all cursor-pointer flex-shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>

                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ================= 5. ASK TOUR GUIDES MODAL ================= */}
        {showNewPostModal && (
          <div className="fixed inset-0 z-50 bg-[#0c0d10]/90 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl font-sans space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c99a6b]">Real-Time Discussion</span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">Ask Expedition Guides</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Post your destination or routing question to our certified guide network</p>
                </div>

                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="p-2 rounded-xl bg-white/5 text-stone-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Destination / Region *</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="India">🇮🇳 India (Golden Triangle, Kerala, Himalayas &amp; Goa)</option>
                    <option value="Japan">🇯🇵 Japan (Tokyo, Kyoto, Osaka &amp; Shinkansen)</option>
                    <option value="Switzerland">🇨🇭 Switzerland (Alpine Passes, Zermatt &amp; Glacier Express)</option>
                    <option value="Italy">🇮🇹 Italy (Rome, Florence, Tuscany &amp; Amalfi)</option>
                    <option value="France">🇫🇷 France (Paris, Lyon &amp; French Riviera)</option>
                    <option value="General">🌐 General Travel Logistics &amp; Budget</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Question Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Best transport pass for Rome -> Florence -> Positano?"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Details &amp; Context *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about dates, budget, group size, or specific landmarks..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl p-4 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Trains, Budget, Sights"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/20"
                  >
                    Post Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
