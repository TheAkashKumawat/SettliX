import connectDB from '../../../lib/connectDB';
import Group from '../../../models/Group';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const groups = await Group.find({}).sort({ createdAt: -1 });
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch groups' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, members } = req.body;
      const group = new Group({ name, description, members });
      await group.save();
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create group' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
