import { useState } from 'react';
import { getBudgetSummary } from '../utils/stats';
import type { BudgetMonth } from '../types/habit';

type BudgetDashboardProps = {
  month: BudgetMonth;
  onSetIncome: (monthKey: string, income: number) => void;
  onAddExpense: (monthKey: string, input: { name: string; amount: number; category?: string }) => void;
  onDeleteExpense: (monthKey: string, expenseId: string) => void;
};

const BudgetDashboard = ({ month, onSetIncome, onAddExpense, onDeleteExpense }: BudgetDashboardProps) => {
  const summary = getBudgetSummary(month);
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Income</p>
          <input
            type="number"
            value={month.income}
            onChange={(event) => onSetIncome(month.monthKey, Number(event.target.value))}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Total Expenses</p>
          <p className="mt-1 text-xl font-semibold">${summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Remaining</p>
          <p className="mt-1 text-xl font-semibold">${summary.remaining.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Savings</p>
          <p className="mt-1 text-xl font-semibold">${summary.savings.toFixed(2)}</p>
        </div>
      </section>

      <form
        className="grid gap-2 sm:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!expenseName.trim() || amount <= 0) return;
          onAddExpense(month.monthKey, { name: expenseName, amount, category: category || undefined });
          setExpenseName('');
          setAmount(0);
          setCategory('');
        }}
      >
        <input value={expenseName} onChange={(event) => setExpenseName(event.target.value)} placeholder="Expense name" className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900" />
        <input type="number" min={0} value={amount} onChange={(event) => setAmount(Number(event.target.value))} placeholder="Amount" className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900" />
        <input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900" />
        <button type="submit" className="rounded px-2 py-1.5 text-sm font-semibold text-white" style={{ backgroundColor: 'var(--secondary-color)' }}>
          Add Expense
        </button>
      </form>

      <div className="space-y-2">
        {month.expenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
            <div>
              <p className="font-medium">{expense.name}</p>
              <p className="text-xs text-slate-500">{expense.category || 'General'}</p>
            </div>
            <div className="flex items-center gap-3">
              <span>${expense.amount.toFixed(2)}</span>
              <button type="button" onClick={() => onDeleteExpense(month.monthKey, expense.id)} className="text-xs text-rose-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetDashboard;
