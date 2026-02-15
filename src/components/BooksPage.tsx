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

  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editFinishDate, setEditFinishDate] = useState('');
  const [editDailyGoal, setEditDailyGoal] = useState(20);
  const [editTotalPages, setEditTotalPages] = useState(300);
  const [editNotes, setEditNotes] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Book Journal</h2>
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
            if (!title.trim() || !author.trim() || !targetFinishDate) return;

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
          const isEditing = editingBookId === book.id;

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
                        setEditingBookId(book.id);
                        setEditTitle(book.title);
                        setEditAuthor(book.author);
                        setEditStartDate(book.startDate);
                        setEditFinishDate(book.targetFinishDate);
                        setEditDailyGoal(book.dailyPageGoal);
                        setEditTotalPages(book.totalPages);
                        setEditNotes(book.notes);
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

              {isEditing ? (
                <div className="mt-3 grid gap-2 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                  <input
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    placeholder="Title"
                    className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                  />
                  <input
                    value={editAuthor}
                    onChange={(event) => setEditAuthor(event.target.value)}
                    placeholder="Author"
                    className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(event) => setEditStartDate(event.target.value)}
                      className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                    />
                    <input
                      type="date"
                      value={editFinishDate}
                      onChange={(event) => setEditFinishDate(event.target.value)}
                      className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={1}
                      value={editDailyGoal}
                      onChange={(event) => setEditDailyGoal(Number(event.target.value))}
                      placeholder="Daily goal"
                      className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                    />
                    <input
                      type="number"
                      min={1}
                      value={editTotalPages}
                      onChange={(event) => setEditTotalPages(Number(event.target.value))}
                      placeholder="Total pages"
                      className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                    />
                  </div>
                  <textarea
                    value={editNotes}
                    onChange={(event) => setEditNotes(event.target.value)}
                    placeholder="Notes"
                    className="h-20 rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingBookId(null)}
                      className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateBook(book.id, {
                          title: editTitle,
                          author: editAuthor,
                          startDate: editStartDate,
                          targetFinishDate: editFinishDate,
                          dailyPageGoal: editDailyGoal,
                          totalPages: editTotalPages,
                          notes: editNotes
                        });
                        setEditingBookId(null);
                      }}
                      className="rounded px-2 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: 'var(--secondary-color)' }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : null}

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
