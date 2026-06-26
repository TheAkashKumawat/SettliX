import { motion } from 'framer-motion';
import axios from 'axios';
import { Utensils, Car, Hotel, ShoppingBag, Film, FileText, Trash2 } from 'lucide-react';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Lodging: Hotel,
  Shopping: ShoppingBag,
  Entertainment: Film,
  Others: FileText,
};

const CATEGORY_COLORS = {
  Food: 'text-red-600 bg-red-50 border-red-100',
  Transport: 'text-blue-600 bg-blue-50 border-blue-100',
  Lodging: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  Shopping: 'text-amber-600 bg-amber-50 border-amber-100',
  Entertainment: 'text-pink-600 bg-pink-50 border-pink-100',
  Others: 'text-violet-600 bg-violet-50 border-violet-100',
};

export default function ExpenseList({ expenses, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white border border-slate-100 shadow-card rounded-2xl p-8 text-center mt-8">
        <p className="text-slate-400 font-medium">No expenses yet. Add one above!</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`/api/expenses/${id}`);
        if (onDelete) onDelete(id);
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <h3 className="font-heading text-xl font-bold mb-4 text-slate-800">Expenses</h3>
      {expenses.map((expense, index) => (
        <motion.div
          key={expense._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white border border-slate-100 shadow-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand/35 transition-all group"
        >
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-lg flex items-center gap-2.5 text-slate-800">
                {(() => {
                  const Icon = CATEGORY_ICONS[expense.category] || FileText;
                  const colorClasses = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Others;
                  return (
                    <div className={`p-2 rounded-lg border ${colorClasses}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  );
                })()}
                {expense.description}
              </h4>
              <span className="font-heading font-extrabold text-brand flex flex-col items-end">
                <span>₹{(expense.totalAmount * (expense.exchangeRate || 1)).toFixed(2)}</span>
                {expense.currency && expense.currency !== 'INR' && (
                  <span className="text-xs text-slate-400 font-normal">
                    {expense.currency} {expense.totalAmount.toFixed(2)}
                  </span>
                )}
              </span>
            </div>
            <div className="text-sm text-slate-500 mb-2 font-medium ml-11">
              Paid by <span className="text-slate-800 font-bold">{expense.paidByName}</span> on {(() => {
                const dateObj = new Date(expense.createdAt);
                return `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
              })()}
            </div>
            <div className="flex flex-wrap gap-2 mt-2 ml-11">
              {expense.splits.map(split => (
                <div key={split.memberId} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100 font-medium">
                  {split.memberName}: ₹{(split.amount * (expense.exchangeRate || 1)).toFixed(2)}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => handleDelete(expense._id)}
            className="text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white p-2.5 rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0 flex items-center justify-center border border-rose-100 hover:border-rose-600"
            title="Delete Expense"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
