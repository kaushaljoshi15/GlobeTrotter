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
  User,
  Crown
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const loadSession = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
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

  // Role Badge Styling (Strictly based on login authentication)
  const roleBadges: { [key: string]: { label: string; icon: any; color: string } } = {
    admin: { label: 'Admin', icon: Crown, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    organizer: { label: 'Organizer', icon: Users, color: 'bg-stone-500/10 text-[#c99a6b] border-[#c99a6b]/30' },
    traveler: { label: 'Traveler', icon: Compass, color: 'bg-stone-500/10 text-stone-300 border-stone-600/30' },
  };

  const currentRoleInfo = roleBadges[currentRole] || roleBadges.traveler;
  const RoleIcon = currentRoleInfo.icon;

  // Role-appropriate Navigation Links
  const getNavLinks = () => {
    if (currentRole === 'admin') {
      return [
        { name: 'Admin Hub', href: '/admin', icon: Shield },
        { name: 'Destinations', href: '/explore', icon: Sparkles },
        { name: 'Trips Monitor', href: '/trips', icon: MapPin },
      ];
    }
    if (currentRole === 'organizer') {
      return [
        { name: 'Organizer Hub', href: '/dashboard/organizer', icon: Users },
        { name: 'Expeditions', href: '/trips', icon: MapPin },
        { name: 'Explore', href: '/explore', icon: Sparkles },
      ];
    }
    return [
      { name: 'Dashboard', href: '/dashboard', icon: Compass },
      { name: 'My Trips', href: '/trips', icon: MapPin },
      { name: 'Explore', href: '/explore', icon: Sparkles },
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
          href={currentRole === 'admin' ? '/admin' : currentRole === 'organizer' ? '/dashboard/organizer' : '/dashboard'} 
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center text-[#0c0d10] font-serif font-bold text-xs shadow-md shadow-[#c99a6b]/20 group-hover:scale-105 transition-transform">
            GT
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-tight text-white flex items-center gap-2">
              the <span className="font-bold italic">GLOBETROTTER</span>
              <span className="text-[9px] font-sans uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-stone-300 font-medium">
                Atelier
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#14151a]/90 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#FAF8F5] text-[#161513] font-bold shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Authenticated Role Badge */}
        <div className="flex items-center gap-3">
          
          {/* Static Authenticated Role Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${currentRoleInfo.color}`}>
            <RoleIcon className="w-3.5 h-3.5" />
            <span className="capitalize">{currentRoleInfo.label}</span>
          </div>

          {/* Quick Action Button */}
          {currentRole === 'admin' ? (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-[#0c0d10] text-xs font-bold shadow-lg transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Center</span>
            </Link>
          ) : (
            <Link
              href="/trips/new"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#e4c29e] text-[#161513] text-xs font-bold shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{currentRole === 'organizer' ? 'New Expedition' : 'Plan a Journey'}</span>
            </Link>
          )}

          {/* Profile & Logout */}
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 transition-colors"
              title="View Profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#9A7B56] flex items-center justify-center text-xs font-serif font-bold text-white uppercase">
                {user?.name ? user.name[0] : 'U'}
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-stone-400 hover:text-red-400 transition-all cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
