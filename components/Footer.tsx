import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0c0d10] text-stone-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-auto font-sans relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center text-[#0c0d10] font-serif font-bold text-xs shadow-md">
            GT
          </div>
          <div>
            <p className="font-serif text-sm font-bold text-white tracking-tight">the GLOBETROTTER</p>
            <p className="text-stone-500 text-[11px] font-sans">Boutique Multi-City Travel Operating System</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-[11px] uppercase tracking-wider text-stone-300">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/trips" className="hover:text-white transition-colors">
            My Trips
          </Link>
          <Link href="/explore" className="hover:text-white transition-colors">
            Destination Catalog
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors">
            Platform Analytics
          </Link>
        </div>

        <div className="flex items-center gap-2 text-stone-500 text-[11px]">
          <span>&copy; {new Date().getFullYear()} GlobeTrotter Atelier &bull; All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
