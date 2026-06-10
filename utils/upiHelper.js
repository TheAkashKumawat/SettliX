export function buildUPILink({ upiId, name, amount, note }) {
  if (!upiId) return null;
  const params = new URLSearchParams();
  params.append('pa', upiId);
  if (name) params.append('pn', name);
  if (amount) params.append('am', amount.toString());
  if (note) params.append('tn', note);
  params.append('cu', 'INR');
  return `upi://pay?${params.toString()}`;
}
