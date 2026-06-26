import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const CATEGORY_COLORS = {
  Food: '#FF6B6B',
  Transport: '#4D96FF',
  Lodging: '#6BCB77',
  Shopping: '#FFD93D',
  Entertainment: '#FF78F0',
  Others: '#7C5CFC',
};

const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Lodging: '🏨',
  Shopping: '🛍️',
  Entertainment: '🍿',
  Others: '📝',
};

export default function SpendAnalytics({ expenses = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white border border-slate-100 shadow-card rounded-2xl p-6 h-[320px] flex items-center justify-center text-slate-400 font-medium">
        Loading analytics...
      </div>
    );
  }

  // Aggregate expenses by category
  const categoryData = {};
  let totalSpent = 0;

  expenses.forEach(exp => {
    const cat = exp.category || 'Others';
    const amt = exp.totalAmount || 0;
    categoryData[cat] = (categoryData[cat] || 0) + amt;
    totalSpent += amt;
  });

  const chartData = Object.keys(categoryData).map(cat => ({
    name: cat,
    value: parseFloat(categoryData[cat].toFixed(2)),
    color: CATEGORY_COLORS[cat] || '#7C5CFC',
    icon: CATEGORY_ICONS[cat] || '📝',
  })).sort((a, b) => b.value - a.value);

  if (totalSpent === 0) {
    return (
      <div className="bg-white border border-slate-100 shadow-card rounded-2xl p-6 text-center text-slate-400 font-medium">
        Add some expenses to view spend analytics.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 shadow-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6 font-heading">Spend Analytics</h3>
      
      <div className="flex flex-col items-center gap-6">
        {/* Pie Chart (Centered, slightly smaller to prevent constraints) */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#1E1E2E] border border-white/10 px-3 py-2 rounded-lg text-xs font-semibold text-white shadow-xl">
                        {data.icon} {data.name}: ₹{data.value.toLocaleString()}
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total spent</span>
            <span className="text-base font-extrabold text-slate-800">₹{totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>

        {/* Legend / Breakdown List (Taking full width below chart) */}
        <div className="w-full space-y-3 pt-4 border-t border-slate-100">
          {chartData.map((item, index) => {
            const percentage = ((item.value / totalSpent) * 100).toFixed(0);
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-400 text-xs flex-shrink-0">{item.icon}</span>
                  <span className="text-slate-700 font-semibold truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="text-slate-800 font-extrabold">₹{item.value.toFixed(0)}</span>
                  <span className="text-slate-400 text-xs w-8 text-right font-medium">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
