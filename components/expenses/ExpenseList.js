import { motion } from 'framer-motion';
import axios from 'axios';

export default function ExpenseList({ expenses, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center mt-8">
        <p className="text-white/50">No expenses yet. Add one above!</p>
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
      <h3 className="font-heading text-xl font-bold mb-4">Expenses</h3>
      {expenses.map((expense, index) => (
        <motion.div
          key={expense._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/10 transition-colors group"
        >
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-lg">{expense.description}</h4>
              <span className="font-heading font-bold text-brand">₹{expense.totalAmount.toFixed(2)}</span>
            </div>
            <div className="text-sm text-white/50 mb-2">
              Paid by <span className="text-white/80">{expense.paidByName}</span> on {new Date(expense.createdAt).toLocaleDateString()}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {expense.splits.map(split => (
                <div key={split.memberId} className="text-xs bg-[#1E1E2E] px-2 py-1 rounded-md border border-white/5">
                  {split.memberName}: ₹{split.amount.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => handleDelete(expense._id)}
            className="text-pink bg-pink/10 hover:bg-pink hover:text-white px-3 py-2 rounded-xl transition-colors text-sm sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
          >
            Delete
          </button>
        </motion.div>
      ))}
    </div>
  );
}
