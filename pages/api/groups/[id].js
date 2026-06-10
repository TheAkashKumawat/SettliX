import connectDB from '../../../lib/connectDB';
import Group from '../../../models/Group';
import Expense from '../../../models/Expense';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const group = await Group.findById(id);
      if (!group) return res.status(404).json({ error: 'Group not found' });
      res.status(200).json(group);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch group' });
    }
  } else if (req.method === 'PUT') {
    try {
      const group = await Group.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!group) return res.status(404).json({ error: 'Group not found' });
      res.status(200).json(group);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update group' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const group = await Group.findByIdAndDelete(id);
      if (!group) return res.status(404).json({ error: 'Group not found' });
      // Also delete all expenses for this group
      await Expense.deleteMany({ groupId: id });
      res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete group' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
