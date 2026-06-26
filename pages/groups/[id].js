import { useState } from 'react';
import Head from 'next/head';
import connectDB from '../../lib/connectDB';
import Group from '../../models/Group';
import Expense from '../../models/Expense';
import AddExpenseForm from '../../components/expenses/AddExpenseForm';
import ExpenseList from '../../components/expenses/ExpenseList';
import BalanceSummary from '../../components/balances/BalanceSummary';

export default function GroupDetail({ initialGroup, initialExpenses }) {
  const [group, setGroup] = useState(initialGroup);
  const [expenses, setExpenses] = useState(initialExpenses);

  if (!group) {
    return <div className="text-center py-20 text-white/50">Group not found</div>;
  }

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const handleExpenseDeleted = (id) => {
    setExpenses(expenses.filter(e => e._id !== id));
  };

  return (
    <>
      <Head>
        <title>{group.name} | SplitEasy</title>
      </Head>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-800 mb-2">{group.name}</h1>
          {group.description && <p className="text-slate-500 font-medium">{group.description}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AddExpenseForm group={group} onExpenseAdded={handleExpenseAdded} />
            <ExpenseList expenses={expenses} onDelete={handleExpenseDeleted} />
          </div>
          
          <div className="lg:col-span-1">
            <BalanceSummary group={group} expenses={expenses} />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  await connectDB();
  
  try {
    const group = await Group.findById(params.id).lean();
    if (!group) return { notFound: true };

    const expenses = await Expense.find({ groupId: params.id }).sort({ createdAt: -1 }).lean();

    return {
      props: {
        initialGroup: JSON.parse(JSON.stringify(group)),
        initialExpenses: JSON.parse(JSON.stringify(expenses)),
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
