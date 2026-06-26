import connectDB from '../../../lib/connectDB';
import Settlement from '../../../models/Settlement';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectDB();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, settlementId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      await Settlement.findByIdAndUpdate(settlementId, {
        status: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        completedAt: new Date()
      });
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
}
