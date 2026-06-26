import mongoose from 'mongoose';

const SplitSchema = new mongoose.Schema({
  memberId: { type: String, required: true },
  memberName: { type: String, required: true },
  amount: { type: Number, required: true }
});

const ExpenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  description: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  exchangeRate: { type: Number, default: 1 },
  paidById: { type: String, required: true },
  paidByName: { type: String, required: true },
  category: { type: String, enum: ['Food', 'Transport', 'Lodging', 'Shopping', 'Entertainment', 'Others'], default: 'Others' },
  splits: [SplitSchema]
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
