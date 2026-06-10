import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import UPIButton from './UPIButton';
import { exportToCSV } from '../../utils/exportCSV';

export default function BalanceSummary({ group, expenses }) {
  const [balances, setBalances] = useState(null);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!group?._id) return;
      try {
        const res = await axios.get(`/api/expenses/balances?groupId=${group._id}`);
        setBalances(res.data.balances);
        setDebts(res.data.debts);
      } catch (err) {
        console.error('Failed to fetch balances', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBalances();
  }, [group, expenses]);

  if (loading) {
    return <div className="text-center text-white/50 py-8">Calculating balances...</div>;
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading text-xl font-bold">Settlements</h3>
        <button
          onClick={() => exportToCSV(expenses, group.name)}
          className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors"
        >
          Export CSV
        </button>
      </div>

      {debts.length === 0 ? (
        <div className="text-center text-white/50 py-8">
          <p>All settled up! 🎉</p>
        </div>
      ) : (
        <div className="space-y-4">
          {debts.map((debt, index) => {
            const creditor = group.members.find(m => m._id === debt.toId);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-[#1E1E2E] border border-white/5 rounded-xl p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="font-semibold text-pink">{debt.from}</span>
                    <span className="text-white/50 mx-2">owes</span>
                    <span className="font-semibold text-success">{debt.to}</span>
                  </div>
                  <div className="font-bold">₹{debt.amount.toFixed(2)}</div>
                </div>
                {creditor?.upiId && (
                  <div className="flex justify-end mt-2">
                    <UPIButton
                      upiId={creditor.upiId}
                      name={creditor.name}
                      amount={debt.amount}
                      note={`Settling ${group.name} expenses`}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-white/10">
        <h4 className="font-semibold mb-4">Individual Balances</h4>
        <div className="space-y-3">
          {group.members.map(member => {
            const balanceObj = balances?.[member._id];
            const amount = balanceObj ? balanceObj.amount : 0;
            if (Math.abs(amount) < 0.01) return null;
            
            return (
              <div key={member._id} className="flex justify-between items-center text-sm">
                <span>{member.name}</span>
                <span className={amount > 0 ? 'bg-success/10 text-success font-medium px-3 py-1 rounded-full text-sm' : 'bg-pink/10 text-pink font-medium px-3 py-1 rounded-full text-sm'}>
                  {amount > 0 ? '+' : ''}₹{amount.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
