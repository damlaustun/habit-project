import { useState } from 'react';
import type { BookEntry } from '../types/habit';
import { getBookProgress } from '../utils/stats';

type BooksPageProps = {
  books: BookEntry[];
  onAddBook: (input: {
    title: string;
    author: string;
    startDate: string;
    targetFinishDate: string;
    dailyPageGoal: number;
    totalPages: number;
    notes?: string;
  }) => void;
  onOpenBook: (bookId: string) => void;
};

const BooksPage = ({ books, onAddBook, onOpenBook }: BooksPageProps) => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [targetFinishDate, setTargetFinishDate] = useState('');
  const [dailyPageGoal, setDailyPageGoal] = useState(20);
  const [totalPages, setTotalPages] = useState(300);
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Books</h2>
        <button
          type="button"
          onClick={() => setAdding((prev) => !prev)}
          className="rounded-md px-3 py-1.5 text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          {adding ? 'Close' : 'Add New Book'}
        </button>
      </div>

      {adding ? (
        <form
          className="grid gap-2 rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim() || !author.trim() || !targetFinishDate) {
              return;
            }

            onAddBook({
              title,
              author,
              startDate,
              targetFinishDate,
              dailyPageGoal,
              totalPages,
              notes
            });

            setTitle('');
            setAuthor('');
            setNotes('');
            setAdding(false);
          }}
        >
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Author"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            type="date"
            value={targetFinishDate}
            onChange={(event) => setTargetFinishDate(event.target.value)}
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            type="number"
            min={1}
            value={dailyPageGoal}
            onChange={(event) => setDailyPageGoal(Number(event.target.value))}
            placeholder="Daily page goal"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <input
            type="number"
            min={1}
            value={totalPages}
            onChange={(event) => setTotalPages(Number(event.target.value))}
            placeholder="Total pages"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Notes"
            className="h-20 rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900 sm:col-span-2"
          />
          <button
            type="submit"
            className="rounded px-3 py-2 text-sm font-semibold text-white sm:col-span-2"
            style={{ backgroundColor: 'var(--secondary-color)' }}
          >
            Save Book
          </button>
        </form>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {books.map((book) => {
          const progress = getBookProgress(book);
          return (
            <button
              key={book.id}
              type="button"
              onClick={() => onOpenBook(book.id)}
              className="rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 text-left transition hover:shadow dark:border-slate-700"
            >
              <p className="font-semibold text-slate-800 dark:text-slate-100">{book.title}</p>
              <p className="text-xs text-slate-500">{book.author}</p>
              <div className="mt-2 h-1.5 rounded bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded"
                  style={{ width: `${progress.percent}%`, backgroundColor: 'var(--secondary-color)' }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {progress.percent}% • {progress.remaining} pages left • {progress.onTrack ? 'On track' : 'Behind'}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BooksPage;
