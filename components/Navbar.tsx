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
  Eye,
  ArrowRight,
  User,
  Heart,
  ChevronDown,
  Settings,
  Luggage,
  MessageSquare,
  Calculator
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

  // Role Badge Styling with Atelier Gold Palette
  const roleBadges: { [key: string]: { label: string; icon: any; color: string } } = {
    admin: { label: 'Admin', icon: Crown, color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    organizer: { label: 'Organizer', icon: Users, color: 'bg-[#c99a6b]/15 text-[#e4c29e] border-[#c99a6b]/30' },
    traveler: { label: 'Traveler', icon: Compass, color: 'bg-white/10 text-stone-200 border-white/15' },
  };

  const currentRoleInfo = roleBadges[currentRole] || roleBadges.traveler;
  const RoleIcon = currentRoleInfo.icon;

  // Nav Links based on login state
  const getNavLinks = () => {
    if (!user) {
      return [
        { name: 'Destinations', href: '/explore', icon: Globe2 },
        { name: 'Architecture', href: '/#features', icon: Sparkles },
        { name: 'Live Preview', href: '/#preview', icon: Eye },
        { name: 'Expeditions', href: '/expeditions', icon: Users },
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

    // Traveler Features Navigation -> Clean Standalone Dedicated Pages
    return [
      { name: 'Itineraries', href: '/trips', icon: Luggage },
      { name: 'Group Expeditions', href: '/expeditions', icon: Compass },
      { name: 'Community', href: '/community', icon: MessageSquare },
      { name: 'Destinations', href: '/explore', icon: Globe2 },
      { name: 'Travel Tools', href: '/concierge', icon: Calculator },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0c0d10]/70 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/40 py-3'
          : 'bg-transparent border-b border-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo - Atelier Edition */}
        <Link 
          href={!user ? '/' : currentRole === 'admin' ? '/admin' : currentRole === 'organizer' ? '/dashboard/organizer' : '/dashboard/traveler'} 
          className="flex items-center gap-3 group flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center font-serif font-bold text-xs text-[#0c0d10] shadow-md shadow-[#c99a6b]/20 group-hover:scale-105 transition-transform">
            GT
          </div>
          <div className="flex flex-col drop-shadow-md">
            <span className="font-serif text-lg tracking-tight text-white font-medium flex items-center gap-2">
              the <span className="font-bold italic">GLOBETROTTER</span>
            </span>
            <span className="text-[8.5px] text-[#c99a6b] font-sans font-bold uppercase tracking-[0.2em] -mt-1">
              Atelier Edition
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Ultra Translucent Pill */}
        <nav className="hidden lg:flex items-center gap-1 bg-black/30 p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] font-bold shadow-md shadow-[#c99a6b]/20'
                    : 'text-stone-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0c0d10]' : 'text-[#c99a6b]'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {mounted && user ? (
            <div className="flex items-center gap-3">
              
              {/* Role Badge */}
              <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-sans font-bold backdrop-blur-md ${currentRoleInfo.color}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span className="capitalize">{currentRoleInfo.label}</span>
              </div>

              {/* Action Button */}
              {currentRole === 'admin' ? (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-sans font-bold shadow-lg shadow-[#c99a6b]/20 transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Center</span>
                </Link>
              ) : (
                <Link
                  href="/trips/new"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-sans font-bold shadow-lg shadow-[#c99a6b]/20 hover:shadow-[#c99a6b]/35 hover:-translate-y-0.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{currentRole === 'organizer' ? 'New Expedition' : 'Plan Journey'}</span>
                </Link>
              )}

              {/* Profile Dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/10 backdrop-blur-xl text-stone-200 transition-all hover:scale-105 shadow-md group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center text-xs font-bold text-[#0c0d10] uppercase shadow-inner">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-400 group-hover:text-white transition-transform duration-200 mr-1 ${dropdownOpen ? 'rotate-180 text-[#c99a6b]' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-3xl bg-[#14151a]/95 border border-white/15 shadow-2xl backdrop-blur-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* User Identity Card */}
                    <div className="p-3 rounded-2xl bg-[#0c0d10]/90 border border-white/10 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center text-sm font-bold text-[#0c0d10] uppercase shadow-md">
                          {user?.name ? user.name[0] : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate font-sans">{user?.name || 'Traveler'}</p>
                          <p className="text-[11px] text-stone-400 truncate font-sans">{user?.email}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentRoleInfo.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          <span className="capitalize">{currentRoleInfo.label} Account</span>
                        </span>
                        <span className="text-[10px] text-[#e4c29e] font-semibold">● Active</span>
                      </div>
                    </div>

                    {/* Quick Menu Links */}
                    <div className="space-y-1 font-sans">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4 text-[#c99a6b]" />
                        <span>Traveler Profile &amp; Passport</span>
                      </Link>

                      <Link
                        href="/trips"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Luggage className="w-4 h-4 text-[#e4c29e]" />
                        <span>My Custom Itineraries</span>
                      </Link>

                      <Link
                        href="/expeditions"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Compass className="w-4 h-4 text-[#c99a6b]" />
                        <span>Curated Group Expeditions</span>
                      </Link>

                      <Link
                        href="/community"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-[#e4c29e]" />
                        <span>Traveler ↔ Guide Community</span>
                      </Link>

                      <Link
                        href="/concierge"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Calculator className="w-4 h-4 text-[#c99a6b]" />
                        <span>Smart Concierge &amp; Utilities</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>Saved Destination Wishlist</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-[#e4c29e]" />
                        <span>Account &amp; Security Settings</span>
                      </Link>

                      <Link
                        href="/explore"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Globe2 className="w-4 h-4 text-[#c99a6b]" />
                        <span>Explore Global Catalog</span>
                      </Link>
                    </div>

                    {/* Sign Out Button */}
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left font-sans cursor-pointer"
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
            <>
              <Link
                href="/login"
                className="text-xs font-bold text-stone-200 hover:text-white px-3 py-2 transition-colors hidden sm:block font-sans drop-shadow"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold font-sans shadow-lg shadow-[#c99a6b]/20 hover:shadow-[#c99a6b]/35 hover:-translate-y-0.5 transition-all"
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
