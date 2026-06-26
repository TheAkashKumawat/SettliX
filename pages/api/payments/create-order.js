import connectDB from '../../../lib/connectDB';
import Settlement from '../../../models/Settlement';
import razorpay from '../../../lib/razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectDB();

  try {
    const { amount, fromId, fromName, toId, toName, groupId } = req.body;

    // Create Razorpay order (amount in paise)
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Save Settlement record
    const settlement = await Settlement.create({
      groupId,
      fromId,
      fromName,
      toId,
      toName,
      amount,
      razorpayOrderId: order.id,
      status: 'created'
    });

    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      settlementId: settlement._id
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}
