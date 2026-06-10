import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className="bg-bg min-h-screen text-white font-body flex flex-col">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-grow"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
