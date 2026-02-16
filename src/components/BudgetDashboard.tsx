import { useState } from 'react';
import { getBudgetSummary } from '../utils/stats';
import type { BudgetMonth } from '../types/habit';

type BudgetDashboardProps = {
  month: BudgetMonth;
  onSetIncome: (monthKey: string, income: number) => void;
  onAddFixedExpense: (monthKey: string, input: { name: string; amount: number; category?: string }) => void;
  onAddExpense: (monthKey: string, input: { name: string; amount: number; category?: string }) => void;
  onDeleteExpense: (monthKey: string, expenseId: string, section: 'fixed' | 'extra') => void;
};

const BudgetDashboard = ({
  month,
  onSetIncome,
  onAddFixedExpense,
  onAddExpense,
  onDeleteExpense
}: BudgetDashboardProps) => {
  const summary = getBudgetSummary(month);
  const [fixedName, setFixedName] = useState('');
  const [fixedAmount, setFixedAmount] = useState(0);
  const [fixedCategory, setFixedCategory] = useState('');

  const [extraName, setExtraName] = useState('');
  const [extraAmount, setExtraAmount] = useState(0);
  const [extraCategory, setExtraCategory] = useState('');

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Monthly Income</p>
          <input
            type="number"
            value={month.income}
            onChange={(event) => onSetIncome(month.monthKey, Number(event.target.value))}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Fixed Expenses</p>
          <p className="mt-1 text-xl font-semibold">${summary.totalFixedExpenses.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Extra Expenses</p>
          <p className="mt-1 text-xl font-semibold">${summary.totalExtraExpenses.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Remaining</p>
          <p className="mt-1 text-xl font-semibold">${summary.remaining.toFixed(2)}</p>
        </div>
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Default Monthly Budget</h3>
        <form
          className="grid gap-2 sm:grid-cols-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!fixedName.trim() || fixedAmount <= 0) return;
            onAddFixedExpense(month.monthKey, {
              name: fixedName,
              amount: fixedAmount,
              category: fixedCategory || undefined
            });
            setFixedName('');
            setFixedAmount(0);
            setFixedCategory('');
          }}
        >
          <input
            value={fixedName}
            onChange={(event) => setFixedName(event.target.value)}
            placeholder="Fixed expense name"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            type="number"
            min={0}
            value={fixedAmount}
            onChange={(event) => setFixedAmount(Number(event.target.value))}
            placeholder="Amount"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            value={fixedCategory}
            onChange={(event) => setFixedCategory(event.target.value)}
            placeholder="Category"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <button
            type="submit"
            className="rounded px-2 py-1.5 text-sm font-semibold"
            style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
          >
            Add Fixed
          </button>
        </form>

        <div className="space-y-2">
          {month.fixedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
            >
              <div>
                <p className="font-medium">{expense.name}</p>
                <p className="text-xs text-slate-500">{expense.category || 'General'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span>${expense.amount.toFixed(2)}</span>
                <details className="relative">
                  <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600">
                    Edit
                  </summary>
                  <div className="absolute right-0 z-20 mt-1 w-32 rounded border border-slate-200 bg-[var(--card-color)] p-1 shadow-lg dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(month.monthKey, expense.id, 'fixed')}
                      className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Delete
                    </button>
                  </div>
                </details>
              </div>
            </div>
          ))}
          {month.fixedExpenses.length === 0 ? <p className="text-xs text-slate-500">No fixed expenses yet.</p> : null}
        </div>
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Extra Spending</h3>
        <form
          className="grid gap-2 sm:grid-cols-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!extraName.trim() || extraAmount <= 0) return;
            onAddExpense(month.monthKey, {
              name: extraName,
              amount: extraAmount,
              category: extraCategory || undefined
            });
            setExtraName('');
            setExtraAmount(0);
            setExtraCategory('');
          }}
        >
          <input
            value={extraName}
            onChange={(event) => setExtraName(event.target.value)}
            placeholder="Extra expense name"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            type="number"
            min={0}
            value={extraAmount}
            onChange={(event) => setExtraAmount(Number(event.target.value))}
            placeholder="Amount"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            value={extraCategory}
            onChange={(event) => setExtraCategory(event.target.value)}
            placeholder="Category"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <button
            type="submit"
            className="rounded px-2 py-1.5 text-sm font-semibold"
            style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
          >
            Add Extra
          </button>
        </form>

        <div className="space-y-2">
          {month.extraExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
            >
              <div>
                <p className="font-medium">{expense.name}</p>
                <p className="text-xs text-slate-500">{expense.category || 'General'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span>${expense.amount.toFixed(2)}</span>
                <details className="relative">
                  <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600">
                    Edit
                  </summary>
                  <div className="absolute right-0 z-20 mt-1 w-32 rounded border border-slate-200 bg-[var(--card-color)] p-1 shadow-lg dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(month.monthKey, expense.id, 'extra')}
                      className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Delete
                    </button>
                  </div>
                </details>
              </div>
            </div>
          ))}
          {month.extraExpenses.length === 0 ? <p className="text-xs text-slate-500">No extra expenses yet.</p> : null}
        </div>
      </section>
    </div>
  );
};

export default BudgetDashboard;
