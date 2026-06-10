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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-[1.02] hover:border-brand transition-all duration-300 cursor-pointer h-full flex flex-col">
          <h3 className="font-heading text-xl font-semibold mb-2">{group.name}</h3>
          <p className="text-white/50 text-sm mb-4 line-clamp-2 flex-grow">{group.description || 'No description'}</p>
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>{group.members?.length || 0} Members</span>
            <span>{new Date(group.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
