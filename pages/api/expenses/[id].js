import connectDB from '../../../lib/connectDB';
import Expense from '../../../models/Expense';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const expense = await Expense.findByIdAndDelete(id);
      if (!expense) return res.status(404).json({ error: 'Expense not found' });
      res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
