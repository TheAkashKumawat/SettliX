export default function SplitInput({ member, amount, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
      <span className="text-sm font-medium">{member.name}</span>
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-sm">₹</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount === 0 ? '' : amount}
          onChange={(e) => onChange(member._id || member.id, parseFloat(e.target.value) || 0)}
          className="bg-[#1E1E2E] border border-white/10 focus:border-brand focus:ring-1 focus:ring-brand rounded-lg px-3 py-2 text-white outline-none w-24 text-right transition-all"
          placeholder="0.00"
        />
      </div>
    </div>
  );
}
