import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Activity, FileSpreadsheet } from 'lucide-react';
import PayButton from './PayButton';
import TransactionHistory from './TransactionHistory';
import CalculationBreakdown from './CalculationBreakdown';
import SpendAnalytics from '../analytics/SpendAnalytics';
import { exportToCSV } from '../../utils/exportCSV';

export default function BalanceSummary({ group, expenses }) {
  const [balances, setBalances] = useState(null);
  const [debts, setDebts] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuditModal, setShowAuditModal] = useState(false);

  const fetchBalances = async () => {
    if (!group?._id) return;
    try {
      const res = await axios.get(`/api/expenses/balances?groupId=${group._id}`);
      setBalances(res.data.balances);
      setDebts(res.data.debts);
      setSettlements(res.data.settlements || []);
    } catch (err) {
      console.error('Failed to fetch balances', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [group, expenses]);

  const getWhatsAppReminderLink = (debt) => {
    const appUrl = typeof window !== 'undefined' ? window.location.href : '';
    const message = `Hey ${debt.from}! Just a quick reminder that you owe ${debt.to} ₹${debt.amount.toFixed(2)} in our group "${group.name}". Settle it here: ${appUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return <div className="text-center text-slate-500 py-8 font-medium">Calculating balances...</div>;
  }

  return (
    <div className="space-y-6 sticky top-24">
      <div className="bg-white border border-slate-100 shadow-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading text-xl font-bold text-slate-800">Settlements</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAuditModal(true)}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-brand border border-emerald-200 px-3 py-1.5 rounded-full transition-all duration-200 font-bold flex items-center gap-1"
            >
              <Activity className="w-3.5 h-3.5" />
              Audit Trail
            </button>
            <button
              onClick={() => exportToCSV(expenses, group.name)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors font-semibold flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {debts.length === 0 ? (
          <div className="text-center text-slate-400 py-8 font-medium">
            <p>All settled up! 🎉</p>
          </div>
        ) : (
          <div className="space-y-4">
            {debts.map((debt, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm col-span-2 text-slate-700 font-medium">
                      <span className="font-bold text-rose-600">{debt.from}</span>
                      <span className="text-slate-400 mx-2 font-normal">owes</span>
                      <span className="font-bold text-emerald-700">{debt.to}</span>
                    </div>
                    <div className="font-extrabold text-slate-800">₹{debt.amount.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-end items-center gap-3 mt-2">
                    <a
                      href={getWhatsAppReminderLink(debt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold px-4 py-2 rounded-full transition-all duration-200 text-sm flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Remind
                    </a>
                    <PayButton
                      amount={debt.amount}
                      fromId={debt.fromId}
                      fromName={debt.from}
                      toId={debt.toId}
                      toName={debt.to}
                      groupId={group._id}
                      onPaymentSuccess={fetchBalances}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="font-bold text-slate-700 mb-4">Individual Balances</h4>
          <div className="space-y-3">
            {group.members.map(member => {
              const balanceObj = balances?.[member._id];
              const amount = balanceObj ? balanceObj.amount : 0;
              if (Math.abs(amount) < 0.01) return null;
              
              return (
                <div key={member._id} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">{member.name}</span>
                  <span className={amount > 0 ? 'bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm' : 'bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded-full text-sm'}>
                    {amount > 0 ? '+' : ''}₹{amount.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <SpendAnalytics expenses={expenses} />

      <TransactionHistory settlements={settlements} />

      <AnimatePresence>
        {showAuditModal && (
          <CalculationBreakdown
            group={group}
            expenses={expenses}
            settlements={settlements}
            onClose={() => setShowAuditModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
