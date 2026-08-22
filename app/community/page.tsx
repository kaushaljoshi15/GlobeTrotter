'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  MessageSquare,
  Users,
  Shield,
  Sparkles,
  Plus,
  Send,
  Heart,
  TrendingUp,
  Search,
  Check,
  Star,
  Award,
  Globe2,
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';

const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: 'Elena Rostova',
    role: 'Traveler',
    avatar: 'E',
    time: '2 hours ago',
    title: 'Best rail pass strategy for Zurich to Zermatt multi-city leg?',
    content: 'We are planning a 7-day multi-city trip across Switzerland. Does the Swiss Travel Pass cover the cable cars up to the Matterhorn Glacier Paradise or just up to Zermatt village?',
    category: 'Switzerland',
    tags: ['Switzerland', 'Trains', 'Budget'],
    upvotes: 24,
    repliesCount: 3,
    replies: [
      {
        author: 'Marcus Vance',
        isOrganizer: true,
        badge: 'Certified Alpine Master',
        text: 'The Swiss Travel Pass covers 100% of the train from Zurich to Zermatt, and gives you a 50% discount on the Matterhorn Glacier Paradise cable car! Feel free to clone our Alpine route.'
      }
    ]
  },
  {
    id: 'post-2',
    author: 'David Chen',
    role: 'Traveler',
    avatar: 'D',
    time: '5 hours ago',
    title: 'Pocket Wi-Fi vs e-SIM for high-speed train travel in Japan?',
    content: 'Traveling with 2 friends between Tokyo, Kyoto, and Osaka. Is Ubigi/Airalo eSIM fast enough on the Shinkansen, or is a dedicated pocket router better for multi-device connectivity?',
    category: 'Japan',
    tags: ['Japan', 'Tech & Connectivity'],
    upvotes: 31,
    repliesCount: 2,
    replies: [
      {
        author: 'Kenjiro Sato',
        isOrganizer: true,
        badge: 'Historic Kyoto Curator',
        text: 'eSIM works flawlessly on 5G across all Shinkansen routes. Airalo and Ubigi connect to NTT Docomo with zero dropouts in the tunnels!'
      }
    ]
  },
  {
    id: 'post-3',
    author: 'Camilla Bianchi',
    role: 'Traveler',
    avatar: 'C',
    time: '1 day ago',
    title: 'Best sunset dinner in Positano without paying 300 euros?',
    content: 'Looking for a cliffside trattoria with view of Amalfi coastline that serves authentic seafood pasta and local wine.',
    category: 'Italy',
    tags: ['Italy', 'Dining & Culture'],
    upvotes: 19,
    repliesCount: 1,
    replies: [
      {
        author: 'Sofia Rossi',
        isOrganizer: true,
        badge: 'Italian Heritage Specialist',
        text: 'Check out Trattoria La Tagliata up in Montepertuso! Family-run, panoramic view, and fixed-menu feasts under 60 euros per person with wine included.'
      }
    ]
  }
];

export default function CommunityPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>(INITIAL_POSTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (e) {}
    }
  }, []);

  const filteredPosts = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpvote = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      author: user?.name || 'Explorer',
      role: user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : 'Traveler',
      avatar: (user?.name || 'E')[0].toUpperCase(),
      time: 'Just now',
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      tags: [newPostCategory, 'Community Advice'],
      upvotes: 1,
      repliesCount: 0,
      replies: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
            <span>Real-Time Travel Network &bull; Verified Tour Guides</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-white tracking-tight mb-3">
            Traveler &amp; Tour Guide <span className="font-bold italic text-[#e4c29e]">Lounge.</span>
          </h1>

          <p className="font-serif text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Directly connect with certified expedition organizers, ask questions about destinations, and share route advice in real-time.
          </p>
        </div>

        {/* Action Bar with Search & Ask Button */}
        <div className="bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 rounded-[32px] shadow-2xl space-y-4 font-sans">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-500 absolute left-5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions or advice across destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0c0d10] border border-white/15 rounded-full pl-12 pr-6 py-3.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b] transition-all"
              />
            </div>

            <button
              onClick={() => setShowNewPostModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 whitespace-nowrap cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Ask Tour Guides</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-2">Topic:</span>
            {['all', 'Switzerland', 'Japan', 'Italy', 'General'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] font-bold shadow-md shadow-[#c99a6b]/20'
                    : 'bg-[#0c0d10] text-stone-300 border border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'all' ? 'All Discussions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Discussions Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed (2 Cols) */}
          <div className="lg:col-span-2 space-y-6 font-sans">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#14151a]/95 border border-white/10 hover:border-white/20 rounded-[32px] p-6 sm:p-8 shadow-xl space-y-5 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#0c0d10] border border-white/15 text-[#e4c29e] font-serif font-bold flex items-center justify-center text-sm shadow-inner">
                      {post.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white">{post.author}</p>
                        <span className="text-[10px] text-stone-400">&bull; {post.time}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">{post.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {post.tags?.map((t: string, i: number) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-stone-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{post.title}</h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">{post.content}</p>
                </div>

                {/* Organizer Reply Section */}
                {post.replies?.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c99a6b] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Verified Tour Organizer Response
                    </span>
                    {post.replies.map((reply: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{reply.author}</span>
                          <span className="text-[9px] px-2 py-0.2 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] border border-[#c99a6b]/30 font-bold">
                            {reply.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed italic">&ldquo;{reply.text}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Strip */}
                <div className="pt-3 flex items-center justify-between border-t border-white/10 text-xs text-stone-400">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer bg-white/5 px-3 py-1.5 rounded-xl border border-white/10"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#c99a6b]" />
                    <span>{post.upvotes} Helpful Votes</span>
                  </button>

                  <span>{post.repliesCount || post.replies?.length || 0} Expert Replies</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar: Active Guides & Quick Guidelines (1 Col) */}
          <div className="space-y-6 font-sans">
            
            {/* Top Verified Guides */}
            <div className="bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 shadow-xl space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">
                ★ Active Expedition Leads
              </span>
              <div className="space-y-3">
                {[
                  { name: 'Marcus Vance', badge: 'Alpine Master', rating: 4.9, active: 'Online' },
                  { name: 'Kenjiro Sato', badge: 'Historic Kyoto Lead', rating: 5.0, active: 'Online' },
                  { name: 'Sofia Rossi', badge: 'Italian Heritage Lead', rating: 4.95, active: '2m ago' },
                  { name: 'Astrid Lind', badge: 'Arctic Expedition Lead', rating: 4.88, active: '15m ago' },
                ].map((guide, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{guide.name}</p>
                      <p className="text-[10px] text-[#e4c29e]">{guide.badge}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-300 font-bold">★ {guide.rating}</span>
                      <span className="text-[9px] text-emerald-400 block">● {guide.active}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Rules */}
            <div className="bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 shadow-xl space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">
                Lounge Etiquette
              </span>
              <ul className="text-xs text-stone-400 space-y-2 leading-relaxed">
                <li>&bull; Ask specific questions regarding multi-city transit, visa regulations, and local etiquette.</li>
                <li>&bull; Certified Tour Organizers answer in priority within 1-2 hours.</li>
                <li>&bull; Upvote helpful answers to reward contributors with verified badge points.</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Ask Question Modal */}
        {showNewPostModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
            <div className="bg-[#14151a] border border-white/15 rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">Ask Tour Guides</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Post a question to our certified tour organizers and global travel community</p>
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Topic Category</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="Switzerland">Switzerland &amp; Alps</option>
                    <option value="Japan">Japan &amp; Asia</option>
                    <option value="Italy">Italy &amp; Mediterranean</option>
                    <option value="General">General Transit &amp; Budget</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Question Title</label>
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Details &amp; Context</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details such as number of travelers, budget, or dates..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl p-4 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 text-stone-400 hover:text-white text-xs font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 cursor-pointer"
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
