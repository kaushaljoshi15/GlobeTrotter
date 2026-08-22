'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Compass, 
  MapPin, 
  BarChart3, 
  LogOut, 
  Plus, 
  Sparkles, 
  Shield, 
  Users, 
  ChevronDown,
  Check
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    const loadSession = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      } else {
        // Default demo session
        const demoUser = {
          id: 1,
          name: 'Alex Rivera',
          email: 'traveler@globetrotter.io',
          role: 'traveler',
        };
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
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
    setUser(null);
    router.push('/login');
  };

  const handleSwitchRole = (newRole: string) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    setShowRoleMenu(false);
    // Refresh to apply role changes
    window.location.reload();
  };

  const currentRole = user?.role || 'traveler';

  const roleBadges: { [key: string]: { label: string; icon: any; color: string } } = {
    admin: { label: 'Admin', icon: Shield, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    organizer: { label: 'Organizer', icon: Users, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    traveler: { label: 'Traveler', icon: Compass, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  };

  const currentRoleInfo = roleBadges[currentRole] || roleBadges.traveler;
  const RoleIcon = currentRoleInfo.icon;

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Compass },
    { name: 'My Trips', href: '/trips', icon: MapPin },
    { name: 'Explore', href: '/explore', icon: Sparkles },
    { name: 'Analytics', href: '/admin', icon: BarChart3 },
  ];

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
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            GT
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight text-white flex items-center gap-2">
              GlobeTrotter
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-sm">
                v2.0
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-full border border-slate-800 backdrop-blur-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Role Selector */}
        <div className="flex items-center gap-3">
          
          {/* Interactive Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${currentRoleInfo.color}`}
              title="Click to Switch Demo Role"
            >
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{currentRoleInfo.label}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
            </button>

            {/* Dropdown Menu for Roles */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">
                  Switch Demo Role
                </div>
                {[
                  { role: 'traveler', label: 'Traveler (Personal)', icon: Compass, color: 'text-blue-400' },
                  { role: 'organizer', label: 'Trip Organizer (Group)', icon: Users, color: 'text-indigo-400' },
                  { role: 'admin', label: 'Administrator (Platform)', icon: Shield, color: 'text-amber-400' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isCur = currentRole === item.role;
                  return (
                    <button
                      key={item.role}
                      onClick={() => handleSwitchRole(item.role)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isCur ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span>{item.label}</span>
                      </span>
                      {isCur && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Create Trip Button */}
          <Link
            href="/trips/new"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Plan Trip</span>
          </Link>

          {/* Profile link */}
          <Link
            href="/profile"
            className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-black text-white uppercase">
              {user?.name ? user.name[0] : 'U'}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
