import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | SpliEasy</title>
      </Head>
      <div className="max-w-4xl mx-auto px-6 py-16 text-slate-700">
        <Link href="/" className="text-sm font-semibold text-brand hover:text-emerald-800 transition-colors">
          ← Back to App
        </Link>
        <h1 className="font-heading text-4xl font-extrabold text-slate-800 mt-6 mb-8">Terms of Service</h1>
        
        <div className="space-y-6 bg-white border border-slate-100 shadow-card rounded-2xl p-8">
          <section>
            <h2 className="text-lg font-bold text-slate-850 mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              By using SpliEasy, you agree to comply with and be bound by the terms outlined below. If you do not agree, please discontinue using the service immediately.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-850 mb-3">2. Sandbox Testing Clause</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              SpliEasy is currently configured in **Razorpay Sandbox / Test Mode**. Transactions processed through the portal do not utilize real currency, nor do they constitute real financial transfers. Under no circumstances should live financial credentials or personal cards containing real balances be inputted during testing.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-850 mb-3">3. Liability Disclaimer</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              SpliEasy is provided "as is" by WebTantu. We are not responsible for transaction discrepancies, ledger calculation adjustments, server downtime, database corruption, or failures resulting from unauthorized edits to signature verification endpoints.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-850 mb-3">4. Amendments</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              We reserves the right to modify these terms or release structural updates (e.g. current version 2.4.1) without prior individual notification.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
