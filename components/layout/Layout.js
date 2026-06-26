import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Layout({ children }) {
  const router = useRouter();
  const [activePolicy, setActivePolicy] = useState(null);

  const policies = {
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-base font-bold text-slate-800 mb-2">1. Information We Collect</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              SpliEasy operates primarily as a local expense splitting manager. We collect data you explicitly enter into the application, including:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 mt-2 space-y-1">
              <li>Group Names and Descriptions</li>
              <li>Member Names (provided during group onboarding)</li>
              <li>Expense records (amount, description, payer, split shares, and category tags)</li>
              <li>Settlement logs (Razorpay payment identifiers, status updates, and timestamps)</li>
            </ul>
          </section>
          <section className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-2">2. How We Store Your Data</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your data is stored securely in a MongoDB database configured in your local environment variables. We do not transmit your transactions, split history, or user rosters to third-party databases, except as required to initialize transactions through payment portals.
            </p>
          </section>
          <section className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-2">3. Payment & Transaction Security</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              All in-app payments are processed via Razorpay API gateways. During Sandbox testing, no actual financial card info is stored or processed. Payment transactions verify signatures server-side using secure HMAC-SHA256 configurations to prevent tamper attempts.
            </p>
          </section>
          <section className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-2">4. Contact Information</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you have any questions regarding how your database stores details locally, please reach out to the development team at <strong className="text-slate-800">WebTantu</strong>.
            </p>
          </section>
        </div>
      )
    },
    terms: {
      title: "Terms of Service",
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-base font-bold text-slate-800 mb-2">1. Acceptance of Terms</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              By using SpliEasy, you agree to comply with and be bound by the terms outlined below. If you do not agree, please discontinue using the service immediately.
            </p>
          </section>
          <section className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-2">2. Sandbox Testing Clause</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              SpliEasy is currently configured in <strong className="text-slate-800">Razorpay Sandbox / Test Mode</strong>. Transactions processed through the portal do not utilize real currency, nor do they constitute real financial transfers. Under no circumstances should live financial credentials or personal cards containing real balances be inputted during testing.
            </p>
          </section>
          <section className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-2">3. Liability Disclaimer</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              SpliEasy is provided &ldquo;as is&rdquo; by WebTantu. We are not responsible for transaction discrepancies, ledger calculation adjustments, server downtime, database corruption, or failures resulting from unauthorized edits to signature verification endpoints.
            </p>
          </section>
          <section className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-2">4. Amendments</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We reserve the right to modify these terms or release structural updates (e.g. current version 2.4.1) without prior individual notification.
            </p>
          </section>
        </div>
      )
    },
    cookies: {
      title: "Cookie Policy",
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-base font-bold text-slate-800 mb-2">1. Use of Cookies</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              SpliEasy uses simple, essential local cookies and session variables to track group views, browser states, and local caching values.
            </p>
          </section>
          <section className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-2">2. Third-Party Scripts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Third-party cookies may be configured dynamically when initializing Checkout frames via Razorpay scripts (<code className="bg-slate-50 px-1 py-0.5 rounded text-xs text-brand">https://checkout.razorpay.com/v1/checkout.js</code>) to secure session contexts during payment simulations.
            </p>
          </section>
          <section className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-2">3. Managing Settings</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              You can decline cookies by altering your browser options. Please note that disabling essential local storage variables might cause group routing pages to load slowly.
            </p>
          </section>
        </div>
      )
    }
  };

  return (
    <div className="bg-bg min-h-screen text-slate-800 font-body flex flex-col">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-grow"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <footer className="border-t border-slate-100 bg-white py-10 text-center text-xs text-slate-400 mt-12 font-medium shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 border-b border-slate-100 pb-6">
            <p className="text-slate-500">© 2026 SpliEasy. All Rights Reserved.</p>
            <div className="flex items-center gap-3 text-slate-400">
              <button
                onClick={() => setActivePolicy('privacy')}
                className="hover:text-brand cursor-pointer transition-colors duration-300 ease-in-out font-medium"
              >
                Privacy Policy
              </button>
              <span>|</span>
              <button
                onClick={() => setActivePolicy('terms')}
                className="hover:text-brand cursor-pointer transition-colors duration-300 ease-in-out font-medium"
              >
                Terms of Service
              </button>
              <span>|</span>
              <button
                onClick={() => setActivePolicy('cookies')}
                className="hover:text-brand cursor-pointer transition-colors duration-300 ease-in-out font-medium"
              >
                Cookie Policy
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 text-slate-400 text-[11px]">
            <span>Version 2.4.1</span>
            <span className="font-semibold text-slate-500">
              Designed & Developed by <span className="font-bold text-slate-700 hover:text-brand transition-colors cursor-pointer">WebTantu</span>
            </span>
          </div>
        </div>
      </footer>

      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col text-left">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-heading font-bold text-slate-800">
                {policies[activePolicy].title}
              </h2>
              <button
                onClick={() => setActivePolicy(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              {policies[activePolicy].content}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end rounded-b-2xl">
              <button
                onClick={() => setActivePolicy(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand hover:bg-emerald-800 rounded-lg transition-colors shadow-glow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
