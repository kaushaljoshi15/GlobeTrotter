'use client';

import { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('admin_pin_verified');
    setUser(null);
    router.push('/login');
  };

  const currentRole = user?.role || 'traveler';

  // Role Badge Styling
  const roleBadges: { [key: string]: { label: string; icon: any; color: string } } = {
    admin: { label: 'Admin', icon: Crown, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    organizer: { label: 'Organizer', icon: Users, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    traveler: { label: 'Traveler', icon: Compass, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl shadow-black/40 py-3'
          : 'bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/50 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href={!user ? '/' : currentRole === 'admin' ? '/admin' : currentRole === 'organizer' ? '/dashboard/organizer' : '/dashboard/traveler'} 
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
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
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-full border border-slate-800 backdrop-blur-md">
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
            <>
              {/* Verified Role Badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${currentRoleInfo.color}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span className="capitalize">{currentRoleInfo.label}</span>
              </div>

              {/* Action Button */}
              {currentRole === 'admin' ? (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Center</span>
                </Link>
              ) : (
                <Link
                  href="/trips/new"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{currentRole === 'organizer' ? 'New Expedition' : 'Plan Trip'}</span>
                </Link>
              )}

              {/* Profile & Logout */}
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
                  title="View Profile"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-black text-white uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
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
