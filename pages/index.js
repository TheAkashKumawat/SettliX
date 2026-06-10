import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GroupCard from '../components/groups/GroupCard';
import connectDB from '../lib/connectDB';
import Group from '../models/Group';

export default function Home({ groups }) {
  return (
    <>
      <Head>
        <title>SplitEasy — Smart Expense Splitter with UPI</title>
      </Head>
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl md:text-7xl font-bold bg-gradient-main bg-clip-text text-transparent mb-6"
          >
            Split smarter. Settle faster.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70 max-w-2xl mx-auto mb-10"
          >
            Create groups, add expenses, and settle balances instantly with deep-linked UPI payments. No more awkward math.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/groups/new" className="inline-block bg-gradient-main text-white font-semibold px-8 py-4 rounded-full hover:scale-105 hover:shadow-glow transition-all duration-200 text-lg">
              Create First Group
            </Link>
          </motion.div>
        </div>

        <div className="mt-16">
          <h2 className="font-heading text-3xl font-bold mb-8">Your Groups</h2>
          
          {groups.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-white/50 text-lg mb-6">You don&apos;t have any groups yet.</p>
              <Link href="/groups/new" className="text-brand hover:text-white transition-colors font-medium">
                + Create a new group to get started
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group, index) => (
                <GroupCard key={group._id} group={group} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  await connectDB();
  
  const groups = await Group.find({}).sort({ createdAt: -1 }).lean();
  
  return {
    props: {
      groups: JSON.parse(JSON.stringify(groups)),
    },
  };
}
