export function calculateBalances(expenses) {
  const balances = {}; // { memberId: { name, amount } }
  
  expenses.forEach(exp => {
    // Credit the payer
    if (!balances[exp.paidById]) {
      balances[exp.paidById] = { name: exp.paidByName, amount: 0 };
    }
    balances[exp.paidById].amount += exp.totalAmount;
    
    // Debit each split member
    exp.splits.forEach(split => {
      if (!balances[split.memberId]) {
        balances[split.memberId] = { name: split.memberName, amount: 0 };
      }
      balances[split.memberId].amount -= split.amount;
    });
  });

  return balances;
}

export function simplifyDebts(balances) {
  const creditors = [];
  const debtors = [];
  
  // Separate into creditors and debtors
  Object.keys(balances).forEach(id => {
    const amount = balances[id].amount;
    // We round to avoid floating point issues
    const rounded = Math.round(amount * 100) / 100;
    if (rounded > 0) {
      creditors.push({ id, name: balances[id].name, amount: rounded });
    } else if (rounded < 0) {
      debtors.push({ id, name: balances[id].name, amount: -rounded });
    }
  });

  // Sort by amount descending
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0; // debtors index
  let j = 0; // creditors index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.amount, creditor.amount);
    
    // Create transaction
    if (amount > 0) {
      transactions.push({
        from: debtor.name,
        fromId: debtor.id,
        to: creditor.name,
        toId: creditor.id,
        amount: Math.round(amount * 100) / 100
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (Math.abs(debtor.amount) < 0.01) i++;
    if (Math.abs(creditor.amount) < 0.01) j++;
  }

  return transactions;
}
