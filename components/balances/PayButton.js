import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PayButton({ amount, fromId, fromName, toId, toName, groupId, onPaymentSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Dynamically load Razorpay checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 1. Create order on the server
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, fromId, fromName, toId, toName, groupId })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Expense Splitter',
        description: `Settlement to ${toName}`,
        order_id: orderData.order_id,
        theme: {
          color: '#047857'
        },
        handler: async function (response) {
          try {
            // 3. Verify payment on the server
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                settlementId: orderData.settlementId
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              if (onPaymentSuccess) {
                onPaymentSuccess();
              }
            } else {
              setError(verifyData.error || 'Payment verification failed');
            }
          } catch (err) {
            setError('Payment verification error');
          }
        },
        prefill: {
          name: fromName
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || 'Payment initiation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={handlePayment}
        disabled={isLoading}
        className="bg-gradient-main text-white font-semibold px-7 py-3 rounded-full hover:scale-105 hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          `Pay ₹${amount}`
        )}
      </motion.button>
      {error && (
        <div className="mt-2 text-red-500 text-sm font-medium px-4 py-2 bg-red-500/10 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
