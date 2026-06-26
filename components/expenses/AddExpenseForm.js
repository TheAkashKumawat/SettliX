import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { createWorker } from 'tesseract.js';
import { Camera, Utensils, Car, Hotel, ShoppingBag, Film, FileText } from 'lucide-react';
import SplitInput from './SplitInput';

const CATEGORIES = [
  { id: 'Food', label: 'Food', icon: Utensils, activeColor: 'border-red-200 bg-red-50 text-red-600 ring-red-300' },
  { id: 'Transport', label: 'Transport', icon: Car, activeColor: 'border-blue-200 bg-blue-50 text-blue-600 ring-blue-300' },
  { id: 'Lodging', label: 'Lodging', icon: Hotel, activeColor: 'border-emerald-200 bg-emerald-50 text-emerald-600 ring-emerald-300' },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag, activeColor: 'border-amber-200 bg-amber-50 text-amber-600 ring-amber-300' },
  { id: 'Entertainment', label: 'Entertainment', icon: Film, activeColor: 'border-pink-200 bg-pink-50 text-pink-600 ring-pink-300' },
  { id: 'Others', label: 'Others', icon: FileText, activeColor: 'border-violet-200 bg-violet-50 text-violet-600 ring-violet-300' }
];

export default function AddExpenseForm({ group, onExpenseAdded }) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidById, setPaidById] = useState(group?.members[0]?._id || '');
  const [category, setCategory] = useState('Others');
  const [currency, setCurrency] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [splitMode, setSplitMode] = useState('equally'); // equally, unequally, percentages, shares
  
  // Stores raw input values (%, shares, or currency)
  const [splitValues, setSplitValues] = useState({});
  // Stores calculated currency amounts (always sums to totalAmount)
  const [calculatedSplits, setCalculatedSplits] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch exchange rate relative to INR
  useEffect(() => {
    const fetchRate = async () => {
      if (currency === 'INR') {
        setExchangeRate(1);
        return;
      }
      try {
        const res = await axios.get('https://open.er-api.com/v6/latest/INR');
        const rates = res.data.rates;
        if (rates && rates[currency]) {
          const rateToInr = parseFloat((1 / rates[currency]).toFixed(4));
          setExchangeRate(rateToInr);
        }
      } catch (err) {
        const fallbacks = { USD: 83.5, EUR: 89.6, GBP: 106.2, AED: 22.7 };
        setExchangeRate(fallbacks[currency] || 1);
      }
    };
    fetchRate();
  }, [currency]);

  // Helper to initialize split inputs
  const initializeSplitValues = (mode) => {
    if (!group || !group.members) return;
    const newValues = {};
    group.members.forEach(m => {
      if (mode === 'equally') {
        newValues[m._id] = 0;
      } else if (mode === 'percentages') {
        newValues[m._id] = parseFloat((100 / group.members.length).toFixed(1));
      } else if (mode === 'shares') {
        newValues[m._id] = 1;
      } else {
        newValues[m._id] = 0;
      }
    });
    setSplitValues(newValues);
  };

  // Initialize values when component mounts or splitMode changes
  useEffect(() => {
    initializeSplitValues(splitMode);
  }, [group, splitMode]);

  // Recalculate splits whenever totalAmount, splitMode, or splitValues change
  useEffect(() => {
    if (!group || !group.members) return;
    const amount = parseFloat(totalAmount) || 0;
    const membersCount = group.members.length;
    
    if (amount <= 0 || membersCount === 0) {
      const zeroSplits = {};
      group.members.forEach(m => zeroSplits[m._id] = 0);
      setCalculatedSplits(zeroSplits);
      return;
    }

    const newCalculated = {};
    let sum = 0;

    if (splitMode === 'equally') {
      const splitAmount = parseFloat((amount / membersCount).toFixed(2));
      group.members.forEach((m, index) => {
        if (index === membersCount - 1) {
          newCalculated[m._id] = parseFloat((amount - sum).toFixed(2));
        } else {
          newCalculated[m._id] = splitAmount;
          sum += splitAmount;
        }
      });
    } 
    else if (splitMode === 'unequally') {
      group.members.forEach(m => {
        newCalculated[m._id] = parseFloat(splitValues[m._id]) || 0;
      });
    } 
    else if (splitMode === 'percentages') {
      const totalPercent = Object.values(splitValues).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      if (totalPercent > 0) {
        group.members.forEach((m, index) => {
          const pct = parseFloat(splitValues[m._id]) || 0;
          const calculatedShare = parseFloat(((amount * pct) / 100).toFixed(2));
          if (index === membersCount - 1) {
            newCalculated[m._id] = parseFloat((amount - sum).toFixed(2));
          } else {
            newCalculated[m._id] = calculatedShare;
            sum += calculatedShare;
          }
        });
      } else {
        group.members.forEach(m => newCalculated[m._id] = 0);
      }
    } 
    else if (splitMode === 'shares') {
      const totalShares = Object.values(splitValues).reduce((a, b) => a + (parseInt(b) || 0), 0);
      if (totalShares > 0) {
        group.members.forEach((m, index) => {
          const sh = parseInt(splitValues[m._id]) || 0;
          const calculatedShare = parseFloat(((amount * sh) / totalShares).toFixed(2));
          if (index === membersCount - 1) {
            newCalculated[m._id] = parseFloat((amount - sum).toFixed(2));
          } else {
            newCalculated[m._id] = calculatedShare;
            sum += calculatedShare;
          }
        });
      } else {
        group.members.forEach(m => newCalculated[m._id] = 0);
      }
    }

    setCalculatedSplits(newCalculated);
  }, [totalAmount, splitMode, splitValues, group]);

  const handleValueChange = (memberId, val) => {
    setSplitValues(prev => ({ ...prev, [memberId]: val }));
  };

  // Receipt Scanner Parser Logic
  const handleReceiptScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanLoading(true);
    setError('');

    try {
      const worker = await createWorker('eng');
      const ret = await worker.recognize(file);
      const text = ret.data.text;
      await worker.terminate();

      if (!text || text.trim() === '') {
        throw new Error('Could not extract any text from the receipt. Please try another image.');
      }

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

      // Heuristic 1: Extract Description (Merchant Name)
      const merchantLine = lines.find(line => {
        return line.length > 3 && 
               !/\d/.test(line) && 
               !line.toLowerCase().includes('total') && 
               !line.toLowerCase().includes('amount') &&
               !line.toLowerCase().includes('tax');
      });
      if (merchantLine) {
        setDescription(merchantLine.substring(0, 30));
      }

      // Heuristic 2: Extract Total Amount
      const pricingKeywords = [/total/i, /net/i, /amount/i, /due/i, /sum/i];
      let extractedAmount = 0;

      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        if (pricingKeywords.some(kw => kw.test(line))) {
          const decimalMatch = line.match(/\d+[\.,]\d{2}/);
          if (decimalMatch) {
            const val = parseFloat(decimalMatch[0].replace(',', '.'));
            if (val > 0) {
              extractedAmount = val;
              break;
            }
          }
          const numberMatch = line.match(/\d+/);
          if (numberMatch) {
            const val = parseFloat(numberMatch[0]);
            if (val > 0) {
              extractedAmount = val;
              break;
            }
          }
        }
      }

      if (extractedAmount > 0) {
        setTotalAmount(extractedAmount.toString());
      } else {
        let maxNumber = 0;
        lines.forEach(line => {
          const match = line.match(/\d+[\.,]\d{2}/);
          if (match) {
            const val = parseFloat(match[0].replace(',', '.'));
            if (val > maxNumber) maxNumber = val;
          }
        });
        if (maxNumber > 0) {
          setTotalAmount(maxNumber.toString());
        } else {
          setError('Detected text, but could not extract the amount. Please enter it manually.');
        }
      }

      const lowerDesc = (merchantLine || '').toLowerCase();
      if (lowerDesc.includes('cafe') || lowerDesc.includes('rest') || lowerDesc.includes('food') || lowerDesc.includes('kitchen') || lowerDesc.includes('pizza') || lowerDesc.includes('dine')) {
        setCategory('Food');
      } else if (lowerDesc.includes('uber') || lowerDesc.includes('ola') || lowerDesc.includes('cab') || lowerDesc.includes('rail') || lowerDesc.includes('flight') || lowerDesc.includes('taxi')) {
        setCategory('Transport');
      } else if (lowerDesc.includes('hotel') || lowerDesc.includes('stay') || lowerDesc.includes('hostel') || lowerDesc.includes('lodg') || lowerDesc.includes('airbnb')) {
        setCategory('Lodging');
      } else if (lowerDesc.includes('mart') || lowerDesc.includes('store') || lowerDesc.includes('grocer') || lowerDesc.includes('shop')) {
        setCategory('Shopping');
      } else if (lowerDesc.includes('cinema') || lowerDesc.includes('movi') || lowerDesc.includes('pub') || lowerDesc.includes('bar') || lowerDesc.includes('club')) {
        setCategory('Entertainment');
      }

    } catch (err) {
      setError(err.message || 'Failed to scan receipt.');
    } finally {
      setScanLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const amount = parseFloat(totalAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    if (splitMode === 'unequally') {
      const splitsSum = Object.values(calculatedSplits).reduce((a, b) => a + b, 0);
      if (Math.abs(splitsSum - amount) > 0.01) {
        setError(`Splits sum (${currency} ${splitsSum.toFixed(2)}) must equal total amount (${currency} ${amount.toFixed(2)})`);
        setLoading(false);
        return;
      }
    } 
    else if (splitMode === 'percentages') {
      const totalPercent = Object.values(splitValues).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      if (Math.abs(totalPercent - 100) > 0.1) {
        setError(`Total percentages must sum to 100% (currently ${totalPercent}%)`);
        setLoading(false);
        return;
      }
    } 
    else if (splitMode === 'shares') {
      const totalShares = Object.values(splitValues).reduce((a, b) => a + (parseInt(b) || 0), 0);
      if (totalShares <= 0) {
        setError('Total shares must be greater than 0');
        setLoading(false);
        return;
      }
    }

    const paidByMember = group.members.find(m => m._id === paidById);
    const formattedSplits = group.members.map(m => ({
      memberId: m._id,
      memberName: m.name,
      amount: calculatedSplits[m._id] || 0
    })).filter(s => s.amount > 0);

    try {
      const res = await axios.post('/api/expenses', {
        groupId: group._id,
        description,
        totalAmount: amount,
        currency,
        exchangeRate,
        paidById,
        paidByName: paidByMember.name,
        category,
        splits: formattedSplits
      });
      
      setDescription('');
      setTotalAmount('');
      setCategory('Others');
      setCurrency('INR');
      initializeSplitValues(splitMode);
      if (onExpenseAdded) onExpenseAdded(res.data);
    } catch (err) {
      setError('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  if (!group || !group.members) return null;

  const modeTabs = [
    { id: 'equally', label: 'Equally' },
    { id: 'unequally', label: 'Unequally' },
    { id: 'percentages', label: 'By %' },
    { id: 'shares', label: 'By Shares' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white border border-slate-100 shadow-card rounded-2xl p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading text-xl font-bold text-slate-800">Add Expense</h3>
        
        {/* Receipt Uploader Control */}
        <div className="relative overflow-hidden bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer transition-all">
          <input
            type="file"
            accept="image/*"
            disabled={scanLoading}
            onChange={handleReceiptScan}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          {scanLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
              <span className="text-xs text-slate-500">Scanning...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 text-slate-600" />
              <span className="text-xs text-slate-700 font-bold">Scan Receipt</span>
            </>
          )}
        </div>
      </div>
      
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm mb-4 font-semibold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm text-slate-600 font-semibold mb-2">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand focus:ring-1 focus:ring-brand rounded-xl px-4 py-3 text-slate-800 outline-none w-full transition-all font-medium"
              placeholder="e.g. Dinner at Taj"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 font-semibold mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand focus:ring-1 focus:ring-brand rounded-xl px-4 py-3 text-slate-800 outline-none w-full transition-all appearance-none font-semibold"
            >
              <option value="INR">🇮🇳 INR (₹)</option>
              <option value="USD">🇺🇸 USD ($)</option>
              <option value="EUR">🇪🇺 EUR (€)</option>
              <option value="GBP">🇬🇧 GBP (£)</option>
              <option value="AED">🇦🇪 AED (Dh)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 font-semibold mb-2">
              Total Amount {currency !== 'INR' && <span className="text-xs text-slate-400">({currency})</span>}
            </label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand focus:ring-1 focus:ring-brand rounded-xl px-4 py-3 text-slate-800 outline-none w-full transition-all font-semibold"
              placeholder="0.00"
            />
          </div>
        </div>

        {currency !== 'INR' && parseFloat(totalAmount) > 0 && (
          <div className="text-xs text-emerald-800 font-bold px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
            ≈ ₹{(parseFloat(totalAmount) * exchangeRate).toFixed(2)} INR (Exchange rate: 1 {currency} = ₹{exchangeRate.toFixed(2)} INR)
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-600 font-semibold mb-2">Paid By</label>
          <select
            value={paidById}
            onChange={(e) => setPaidById(e.target.value)}
            className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand focus:ring-1 focus:ring-brand rounded-xl px-4 py-3 text-slate-800 outline-none w-full transition-all font-semibold"
          >
            {group.members.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Premium Grid Category Selector */}
        <div className="pt-2">
          <label className="block text-sm text-slate-600 font-semibold mb-3">Category</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CATEGORIES.map(cat => {
              const IconComp = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? `${cat.activeColor} ring-1 shadow-sm`
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <IconComp className="w-5 h-5 mb-1.5 animate-bounce-short" />
                  <span className="text-[11px] font-bold">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Split Mode Selector Tabs */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm text-slate-600 font-semibold mb-3">Split Option</label>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-4">
            {modeTabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSplitMode(tab.id)}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  splitMode === tab.id
                    ? 'bg-gradient-main text-white shadow-glow'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Render Member Inputs */}
          <div className="space-y-2">
            {group.members.map(m => {
              let suffix = currency;
              let isInputDisabled = false;
              let step = 'any';
              let min = '0';

              if (splitMode === 'equally') {
                suffix = currency;
                isInputDisabled = true;
              } else if (splitMode === 'percentages') {
                suffix = '%';
                step = '0.1';
              } else if (splitMode === 'shares') {
                suffix = 'share';
                step = '1';
                min = '0';
              }

              return (
                <SplitInput
                  key={m._id}
                  member={m}
                  value={splitMode === 'equally' ? calculatedSplits[m._id] || 0 : splitValues[m._id] || 0}
                  calculatedAmount={splitMode !== 'equally' ? calculatedSplits[m._id] : undefined}
                  onChange={handleValueChange}
                  suffix={suffix}
                  disabled={isInputDisabled}
                  step={step}
                  min={min}
                />
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-main text-white font-bold px-7 py-3 rounded-full hover:scale-[1.01] hover:shadow-glow transition-all duration-200 mt-4 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </motion.div>
  );
}
