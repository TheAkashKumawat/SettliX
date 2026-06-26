import mongoose from 'mongoose';

const SettlementSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  fromId: { type: String, required: true },
  fromName: { type: String, required: true },
  toId: { type: String, required: true },
  toName: { type: String, required: true },
  amount: { type: Number, required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: { type: String, enum: ['created', 'completed', 'failed'], default: 'created' },
  completedAt: { type: Date }
}, { timestamps: true });

export default mongoose.models.Settlement || mongoose.model('Settlement', SettlementSchema);
