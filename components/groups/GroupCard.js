import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GroupCard({ group, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/groups/${group._id}`} className="block h-full">
        <div className="bg-white border border-slate-100 shadow-card hover:scale-[1.02] hover:border-brand/40 transition-all duration-300 cursor-pointer h-full flex flex-col rounded-2xl p-6">
          <h3 className="font-heading text-xl font-bold text-slate-800 mb-2">{group.name}</h3>
          <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">{group.description || 'No description'}</p>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{group.members?.length || 0} Members</span>
            <span>{(() => {
              const d = new Date(group.createdAt);
              return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            })()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
