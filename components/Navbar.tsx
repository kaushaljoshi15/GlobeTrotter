'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Compass, 
  MapPin, 
  LogOut, 
  Plus, 
  Sparkles, 
  Shield, 
  Users, 
  Crown,
  Globe2,
  Layers,
  Eye,
  ArrowRight,
  User,
  Heart,
  ChevronDown,
  Settings,
  Luggage
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const loadSession = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadSession();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('admin_pin_verified');
    setUser(null);
    setDropdownOpen(false);
    router.push('/login');
  };

  const currentRole = user?.role || 'traveler';

  // Role Badge Styling
  const roleBadges: { [key: string]: { label: string; icon: any; color: string } } = {
    admin: { label: 'Admin', icon: Crown, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    organizer: { label: 'Organizer', icon: Users, color: 'bg-stone-500/10 text-[#c99a6b] border-[#c99a6b]/30' },
    traveler: { label: 'Traveler', icon: Compass, color: 'bg-stone-500/10 text-stone-300 border-stone-600/30' },
  };

  const currentRoleInfo = roleBadges[currentRole] || roleBadges.traveler;
  const RoleIcon = currentRoleInfo.icon;

  // Nav Links based on login state
  const getNavLinks = () => {
    if (!user) {
      // Guest / Anonymous Landing Page Navigation
      return [
        { name: 'Destinations', href: '/explore', icon: Globe2 },
        { name: 'Features', href: '/#features', icon: Sparkles },
        { name: 'Live Preview', href: '/#preview', icon: Eye },
        { name: 'Role Solutions', href: '/#roles', icon: Users },
      ];
    }

    if (currentRole === 'admin') {
      return [
        { name: 'Admin Hub', href: '/admin', icon: Shield },
        { name: 'Destinations', href: '/explore', icon: Globe2 },
        { name: 'Trips Monitor', href: '/trips', icon: MapPin },
      ];
    }

    if (currentRole === 'organizer') {
      return [
        { name: 'Organizer Hub', href: '/dashboard/organizer', icon: Users },
        { name: 'Expeditions', href: '/trips', icon: MapPin },
        { name: 'Explore Cities', href: '/explore', icon: Globe2 },
      ];
    }

    // Default Traveler
    return [
      { name: 'Dashboard', href: '/dashboard/traveler', icon: Compass },
      { name: 'My Trips', href: '/trips', icon: MapPin },
      { name: 'Explore Cities', href: '/explore', icon: Globe2 },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        isScrolled
          ? 'bg-[#0c0d10]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/60 py-3'
          : 'bg-[#0c0d10]/80 backdrop-blur-xl border-b border-white/5 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href={!user ? '/' : currentRole === 'admin' ? '/admin' : currentRole === 'organizer' ? '/dashboard/organizer' : '/dashboard/traveler'} 
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center text-[#0c0d10] font-serif font-bold text-xs shadow-md shadow-[#c99a6b]/20 group-hover:scale-105 transition-transform">
            GT
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight text-white flex items-center gap-2">
              GlobeTrotter
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-sm">
                PRO
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#14151a]/90 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions (Guest vs Logged In) */}
        <div className="flex items-center gap-3">
          {mounted && user ? (
            // ================= LOGGED IN USER ACTIONS =================
            <div className="flex items-center gap-3">
              
              {/* Verified Role Badge */}
              <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${currentRoleInfo.color}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span className="capitalize">{currentRoleInfo.label}</span>
              </div>

              {/* Action Button */}
              {currentRole === 'admin' ? (
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Center</span>
                </Link>
              ) : (
                <Link
                  href="/trips/new"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{currentRole === 'organizer' ? 'New Expedition' : 'Plan Trip'}</span>
                </Link>
              )}

              {/* ================= PROFILE DROPDOWN CONTAINER ================= */}
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Avatar Button Trigger */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all hover:scale-105 shadow-md group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-xs font-black text-white uppercase shadow-inner">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 mr-1 ${dropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
                </button>

                {/* Dropdown Menu Modal */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* User Identity Card */}
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-sm font-black text-white uppercase shadow-md">
                          {user?.name ? user.name[0] : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white truncate">{user?.name || 'Traveler'}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentRoleInfo.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          <span className="capitalize">{currentRoleInfo.label} Account</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">● Active</span>
                      </div>
                    </div>

                    {/* Quick Menu Links */}
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-blue-400" />
                        <span>Traveler Profile &amp; Passport</span>
                      </Link>

                      <Link
                        href={currentRole === 'admin' ? '/admin' : currentRole === 'organizer' ? '/dashboard/organizer' : '/dashboard/traveler'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Compass className="w-4 h-4 text-indigo-400" />
                        <span>{currentRole === 'admin' ? 'Administrator Hub' : currentRole === 'organizer' ? 'Organizer Operations' : 'Traveler Dashboard'}</span>
                      </Link>

                      <Link
                        href="/trips"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Luggage className="w-4 h-4 text-emerald-400" />
                        <span>My Itineraries &amp; Trips</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>Saved Destination Wishlist</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-amber-400" />
                        <span>Account &amp; Security Settings</span>
                      </Link>

                      <Link
                        href="/explore"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Globe2 className="w-4 h-4 text-cyan-400" />
                        <span>Explore Global Catalog</span>
                      </Link>
                    </div>

                    {/* Sign Out Button */}
                    <div className="mt-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out Account</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>
          ) : (
            // ================= ANONYMOUS GUEST ACTIONS =================
            <>
              <Link
                href="/login"
                className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
