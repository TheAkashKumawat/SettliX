import React from 'react';

export default function TransactionHistory({ settlements = [] }) {
  if (!settlements || settlements.length === 0) {
    return (
      <div className="bg-white border border-slate-100 shadow-card rounded-2xl p-6 text-center text-slate-400 font-medium">
        No settlements yet.
      </div>
    );
  }

  // Sort newest first
  const sortedSettlements = [...settlements].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="bg-white border border-slate-100 shadow-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6 font-heading">Recent Settlements</h3>
      <div className="space-y-4">
        {sortedSettlements.map((settlement) => {
          let badgeColor = '';
          switch (settlement.status) {
            case 'completed':
              badgeColor = 'bg-emerald-50 text-emerald-800';
              break;
            case 'pending':
            case 'created':
              badgeColor = 'bg-amber-50 text-amber-800';
              break;
            case 'failed':
              badgeColor = 'bg-rose-50 text-rose-600';
              break;
            default:
              badgeColor = 'bg-slate-100 text-slate-600';
          }

          const dateObj = new Date(settlement.createdAt);
          const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

          return (
            <div key={settlement._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand/20 transition-all">
              <div className="flex flex-col">
                <span className="text-slate-800 font-semibold">
                  {settlement.fromName} <span className="text-slate-400 font-normal mx-1">→</span> {settlement.toName}
                </span>
                <span className="text-xs text-slate-400 mt-1 font-medium">
                  {formattedDate} 
                  {settlement.razorpayPaymentId && (
                    <span className="ml-2 font-mono text-xs opacity-80">
                      • {settlement.razorpayPaymentId.substring(0, 12)}...
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 sm:mt-0">
                <span className="text-slate-800 font-extrabold">₹{settlement.amount}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${badgeColor}`}>
                  {settlement.status === 'created' ? 'pending' : settlement.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
