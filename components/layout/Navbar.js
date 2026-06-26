import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-heading text-2xl font-extrabold bg-gradient-main bg-clip-text text-transparent">
          SplitEasy
        </Link>
        <Link href="/groups/new" className="bg-white border border-slate-200 hover:border-brand px-4 py-2 rounded-full text-sm font-bold text-slate-700 shadow-sm transition-all">
          + New Group
        </Link>
      </div>
    </nav>
  );
}
