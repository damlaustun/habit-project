import { useState } from 'react';
import type { BookEntry } from '../types/habit';
import { getBookProgress } from '../utils/stats';

type BookDetailPageProps = {
  book: BookEntry;
  onBack: () => void;
  onUpdateBook: (
    bookId: string,
    patch: Partial<
      Pick<
        BookEntry,
        'title' | 'author' | 'startDate' | 'targetFinishDate' | 'dailyPageGoal' | 'totalPages' | 'notes'
      >
    >
  ) => void;
  onDeleteBook: (bookId: string) => void;
  onLogPages: (bookId: string, date: string, pages: number) => void;
  onUpdateNotes: (bookId: string, notes: string) => void;
  onAddQuote: (bookId: string, quote: string) => void;
};

const BookDetailPage = ({
  book,
  onBack,
  onUpdateBook,
  onDeleteBook,
  onLogPages,
  onUpdateNotes,
  onAddQuote
}: BookDetailPageProps) => {
  const progress = getBookProgress(book);
  const [pagesInput, setPagesInput] = useState(0);
  const [notes, setNotes] = useState(book.notes);
  const [quote, setQuote] = useState('');

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-600"
      >
        Back to books
      </button>

      <section className="rounded-xl border border-slate-200 bg-[var(--card-color)] p-4 dark:border-slate-700">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{book.title}</h2>
            <p className="text-sm text-slate-500">{book.author}</p>
          </div>
          <details className="relative">
            <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600">
              Edit
            </summary>
            <div className="absolute right-0 z-20 mt-1 w-40 rounded border border-slate-200 bg-[var(--card-color)] p-1 shadow-lg dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  const titleNext = window.prompt('Title', book.title);
                  if (!titleNext) return;
                  const authorNext = window.prompt('Author', book.author);
                  if (!authorNext) return;
                  const startNext = window.prompt('Start day (YYYY-MM-DD)', book.startDate) ?? book.startDate;
                  const finishNext =
                    window.prompt('Finish day (YYYY-MM-DD)', book.targetFinishDate) ?? book.targetFinishDate;
                  const dailyNext =
                    window.prompt('Daily page goal', String(book.dailyPageGoal)) ?? String(book.dailyPageGoal);
                  const totalNext = window.prompt('Total pages', String(book.totalPages)) ?? String(book.totalPages);
                  onUpdateBook(book.id, {
                    title: titleNext,
                    author: authorNext,
                    startDate: startNext,
                    targetFinishDate: finishNext,
                    dailyPageGoal: Number(dailyNext),
                    totalPages: Number(totalNext)
                  });
                }}
                className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Edit book
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteBook(book.id);
                  onBack();
                }}
                className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Delete book
              </button>
            </div>
          </details>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Start: {book.startDate} • Target: {book.targetFinishDate} • Daily goal: {book.dailyPageGoal} pages
        </p>
        <div className="mt-3 h-2 rounded bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded"
            style={{ width: `${progress.percent}%`, backgroundColor: 'var(--secondary-color)' }}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-[var(--card-color)] p-4 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Add the number of pages you read today
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={pagesInput}
            onChange={(event) => setPagesInput(Number(event.target.value))}
            className="w-28 rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <button
            type="button"
            onClick={() => {
              if (pagesInput <= 0) return;
              onLogPages(book.id, new Date().toISOString().slice(0, 10), pagesInput);
              setPagesInput(0);
            }}
            className="rounded px-3 py-1 text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--secondary-color)' }}
          >
            Log pages
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-[var(--card-color)] p-4 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notes</h3>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="mt-2 h-28 w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={() => onUpdateNotes(book.id, notes)}
          className="mt-2 rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
        >
          Save Notes
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-[var(--card-color)] p-4 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Quotes</h3>
        <div className="mt-2 flex items-center gap-2">
          <input
            value={quote}
            onChange={(event) => setQuote(event.target.value)}
            placeholder="Add quote"
            className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <button
            type="button"
            onClick={() => {
              const value = quote.trim();
              if (!value) return;
              onAddQuote(book.id, value);
              setQuote('');
            }}
            className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
          >
            Add
          </button>
        </div>
        <div className="mt-3 space-y-1">
          {book.quotes.map((entry, index) => (
            <p key={`${book.id}-${index}`} className="text-sm text-slate-600 dark:text-slate-300">
              "{entry}"
            </p>
          ))}
          {book.quotes.length === 0 ? <p className="text-xs text-slate-500">No quotes yet.</p> : null}
        </div>
      </section>
    </div>
  );
};

export default BookDetailPage;
