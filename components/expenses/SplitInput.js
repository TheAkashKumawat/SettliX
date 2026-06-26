export default function SplitInput({ member, value, calculatedAmount, onChange, suffix = '₹', disabled = false, min = '0', step = 'any' }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <span className="text-sm font-medium text-slate-700">{member.name}</span>
      <div className="flex items-center gap-3">
        {calculatedAmount !== undefined && (
          <span className="text-xs text-slate-400 font-mono font-medium">
            ₹{calculatedAmount.toFixed(2)}
          </span>
        )}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/40 transition-all">
          {suffix === '₹' && <span className="text-slate-400 text-xs font-semibold">₹</span>}
          <input
            type="number"
            min={min}
            step={step}
            disabled={disabled}
            value={value === 0 && !disabled ? '' : value}
            onChange={(e) => onChange(member._id || member.id, parseFloat(e.target.value) || 0)}
            className="bg-transparent text-slate-800 outline-none w-16 text-right text-sm disabled:opacity-60 disabled:cursor-not-allowed font-medium"
            placeholder="0"
          />
          {suffix !== '₹' && <span className="text-slate-400 text-xs font-semibold">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}
