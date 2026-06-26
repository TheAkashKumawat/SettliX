import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | SpliEasy</title>
      </Head>
      <div className="max-w-4xl mx-auto px-6 py-16 text-slate-700">
        <Link href="/" className="text-sm font-semibold text-brand hover:text-emerald-800 transition-colors">
          ← Back to App
        </Link>
        <h1 className="font-heading text-4xl font-extrabold text-slate-800 mt-6 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 bg-white border border-slate-100 shadow-card rounded-2xl p-8">
          <section>
            <h2 className="text-lg font-bold text-slate-850 mb-3">1. Information We Collect</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              SpliEasy operates primarily as a local expense splitting manager. We collect data you explicitly enter into the application, including:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
              <li>Group Names and Descriptions</li>
              <li>Member Names (provided during group onboarding)</li>
              <li>Expense records (amount, description, payer, split shares, and category tags)</li>
              <li>Settlement logs (Razorpay payment identifiers, status updates, and timestamps)</li>
            </ul>
          </section>

          <section className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-850 mb-3">2. How We Store Your Data</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Your data is stored securely in a MongoDB database configured in your local environment variables. We do not transmit your transactions, split history, or user rosters to third-party databases, except as required to initialize transactions through payment portals.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-850 mb-3">3. Payment & Transaction Security</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              All in-app payments are processed via Razorpay API gateways. During Sandbox testing, no actual financial card info is stored or processed. Payment transactions verify signatures server-side using secure HMAC-SHA256 configurations to prevent tamper attempts.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-850 mb-3">4. Contact Information</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              If you have any questions regarding how your database stores details locally, please reach out to the development team at **WebTantu**.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
