import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  upiId: { type: String, required: false }
});

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [MemberSchema]
}, { timestamps: true });

export default mongoose.models.Group || mongoose.model('Group', GroupSchema);
