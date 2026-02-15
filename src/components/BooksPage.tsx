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
  onOpenBook: (bookId: string) => void;
};

const BooksPage = ({ books, onAddBook, onUpdateBook, onDeleteBook, onOpenBook }: BooksPageProps) => {
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
          style={{ backgroundColor: 'var(--secondary-color)' }}
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
          <label className="text-xs text-slate-600 dark:text-slate-300">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
          <label className="text-xs text-slate-600 dark:text-slate-300">
            Author
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
          <label className="text-xs text-slate-600 dark:text-slate-300">
            Start day
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
          <label className="text-xs text-slate-600 dark:text-slate-300">
            Finish day
            <input
              type="date"
              value={targetFinishDate}
              onChange={(event) => setTargetFinishDate(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
          <label className="text-xs text-slate-600 dark:text-slate-300">
            Daily page goal
            <input
              type="number"
              min={1}
              value={dailyPageGoal}
              onChange={(event) => setDailyPageGoal(Number(event.target.value))}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
          <label className="text-xs text-slate-600 dark:text-slate-300">
            Total pages
            <input
              type="number"
              min={1}
              value={totalPages}
              onChange={(event) => setTotalPages(Number(event.target.value))}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
          <label className="text-xs text-slate-600 dark:text-slate-300 sm:col-span-2">
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-1 h-20 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
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
            <article key={book.id} className="rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700">
              <div className="flex items-start justify-between gap-2">
                <button type="button" onClick={() => onOpenBook(book.id)} className="min-w-0 flex-1 text-left">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{book.title}</p>
                  <p className="text-xs text-slate-500">{book.author}</p>
                </button>

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
                        const totalNext =
                          window.prompt('Total pages', String(book.totalPages)) ?? String(book.totalPages);
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
                      onClick={() => onDeleteBook(book.id)}
                      className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Delete book
                    </button>
                  </div>
                </details>
              </div>

              <div className="mt-2 h-1.5 rounded bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded"
                  style={{ width: `${progress.percent}%`, backgroundColor: 'var(--secondary-color)' }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {progress.percent}% • {progress.remaining} pages left • {progress.onTrack ? 'On track' : 'Behind'}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default BooksPage;
