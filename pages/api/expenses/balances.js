import connectDB from '../../../lib/connectDB';
import Expense from '../../../models/Expense';
import { calculateBalances, simplifyDebts } from '../../../utils/calculations';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { groupId } = req.query;
      if (!groupId) return res.status(400).json({ error: 'groupId is required' });
      
      const expenses = await Expense.find({ groupId });
      const balances = calculateBalances(expenses);
      const debts = simplifyDebts(balances);
      
      res.status(200).json({ balances, debts });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate balances' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
