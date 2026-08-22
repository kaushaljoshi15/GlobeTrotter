import Link from 'next/link';
import { Compass, Heart, Globe, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            GT
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">GlobeTrotter</p>
            <p className="text-slate-500 text-[11px]">Empowering Personalized Multi-City Travel</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/trips" className="hover:text-blue-400 transition-colors">
            My Trips
          </Link>
          <Link href="/explore" className="hover:text-blue-400 transition-colors">
            Destination Catalog
          </Link>
          <Link href="/admin" className="hover:text-blue-400 transition-colors">
            Platform Analytics
          </Link>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span>Built for the Odoo Hackathon &copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
