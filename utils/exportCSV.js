export function exportToCSV(expenses, groupName = 'group') {
  if (!expenses || expenses.length === 0) return;

  const headers = ['Date', 'Description', 'Paid By', 'Total Amount', 'Splits'];
  
  const rows = expenses.map(exp => {
    const date = new Date(exp.createdAt).toLocaleDateString();
    const splitsStr = exp.splits.map(s => `${s.memberName}: ${s.amount}`).join(' | ');
    // Handle commas in text fields by quoting them
    return [
      `"${date}"`,
      `"${exp.description.replace(/"/g, '""')}"`,
      `"${exp.paidByName.replace(/"/g, '""')}"`,
      exp.totalAmount,
      `"${splitsStr.replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${groupName.replace(/\s+/g, '_')}_expenses.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
