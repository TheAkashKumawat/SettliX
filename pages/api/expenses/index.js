import connectDB from '../../../lib/connectDB';
import Expense from '../../../models/Expense';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { groupId } = req.query;
      if (!groupId) return res.status(400).json({ error: 'groupId is required' });
      const expenses = await Expense.find({ groupId }).sort({ createdAt: -1 });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch expenses' });
    }
  } else if (req.method === 'POST') {
    try {
      const expense = new Expense(req.body);
      await expense.save();
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create expense' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
