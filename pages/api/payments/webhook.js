import connectDB from '../../../lib/connectDB';
import Settlement from '../../../models/Settlement';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    
    await connectDB();

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      await Settlement.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { status: 'completed', razorpayPaymentId: payment.id, completedAt: new Date() }
      );
    } else if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      await Settlement.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { status: 'failed', razorpayPaymentId: payment.id }
      );
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
