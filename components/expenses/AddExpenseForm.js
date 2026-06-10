import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SplitInput from './SplitInput';

export default function AddExpenseForm({ group, onExpenseAdded }) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidById, setPaidById] = useState(group?.members[0]?._id || '');
  const [splits, setSplits] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto split equally when total amount changes
  useEffect(() => {
    if (!group || !group.members) return;
    const amount = parseFloat(totalAmount) || 0;
    if (amount > 0 && group.members.length > 0) {
      const splitAmount = parseFloat((amount / group.members.length).toFixed(2));
      const newSplits = {};
      let sum = 0;
      
      group.members.forEach((m, index) => {
        if (index === group.members.length - 1) {
          // Add remaining to last person to avoid rounding errors
          newSplits[m._id] = parseFloat((amount - sum).toFixed(2));
        } else {
          newSplits[m._id] = splitAmount;
          sum += splitAmount;
        }
      });
      setSplits(newSplits);
    } else {
      const newSplits = {};
      group.members.forEach(m => newSplits[m._id] = 0);
      setSplits(newSplits);
    }
  }, [totalAmount, group]);

  const handleSplitChange = (memberId, amount) => {
    setSplits({ ...splits, [memberId]: amount });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const amount = parseFloat(totalAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    // Validate splits sum to total
    const splitsSum = Object.values(splits).reduce((a, b) => a + b, 0);
    if (Math.abs(splitsSum - amount) > 0.01) {
      setError(`Splits sum (₹${splitsSum.toFixed(2)}) must equal total (₹${amount.toFixed(2)})`);
      setLoading(false);
      return;
    }

    const paidByMember = group.members.find(m => m._id === paidById);
    
    const formattedSplits = group.members.map(m => ({
      memberId: m._id,
      memberName: m.name,
      amount: splits[m._id] || 0
    })).filter(s => s.amount > 0);

    try {
      const res = await axios.post('/api/expenses', {
        groupId: group._id,
        description,
        totalAmount: amount,
        paidById,
        paidByName: paidByMember.name,
        splits: formattedSplits
      });
      
      // Reset form
      setDescription('');
      setTotalAmount('');
      if (onExpenseAdded) onExpenseAdded(res.data);
    } catch (err) {
      setError('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  if (!group || !group.members) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
      <h3 className="font-heading text-xl font-bold mb-4">Add Expense</h3>
      
      {error && <div className="bg-pink/10 border border-pink text-pink px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#1E1E2E] border border-white/10 focus:border-brand focus:ring-1 focus:ring-brand rounded-xl px-4 py-3 text-white outline-none w-full transition-all"
              placeholder="e.g. Dinner at Taj"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-2">Total Amount (₹)</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="bg-[#1E1E2E] border border-white/10 focus:border-brand focus:ring-1 focus:ring-brand rounded-xl px-4 py-3 text-white outline-none w-full transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-2">Paid By</label>
          <select
            value={paidById}
            onChange={(e) => setPaidById(e.target.value)}
            className="bg-[#1E1E2E] border border-white/10 focus:border-brand focus:ring-1 focus:ring-brand rounded-xl px-4 py-3 text-white outline-none w-full transition-all appearance-none"
          >
            {group.members.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-white/10">
          <label className="block text-sm text-white/70 mb-3">Split Details</label>
          <div className="space-y-2">
            {group.members.map(m => (
              <SplitInput
                key={m._id}
                member={m}
                amount={splits[m._id] || 0}
                onChange={handleSplitChange}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-main text-white font-semibold px-7 py-3 rounded-full hover:scale-[1.02] hover:shadow-glow transition-all duration-200 mt-4 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </motion.div>
  );
}
