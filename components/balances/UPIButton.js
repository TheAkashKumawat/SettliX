import { motion } from 'framer-motion';
import { buildUPILink } from '../../utils/upiHelper';

export default function UPIButton({ upiId, name, amount, note }) {
  if (!upiId) return null;

  const upiLink = buildUPILink({ upiId, name, amount, note });

  return (
    <motion.a
      href={upiLink}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block bg-brand text-white text-xs font-semibold px-4 py-2 rounded-full hover:shadow-glow transition-all"
    >
      Pay via UPI
    </motion.a>
  );
}
