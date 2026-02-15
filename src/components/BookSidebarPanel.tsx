import { useState } from 'react';
import { getBookProgress } from '../utils/stats';
import type { BookEntry } from '../types/habit';

type BookSidebarPanelProps = {
  open: boolean;
  books: BookEntry[];
  onToggleOpen: () => void;
  onAddBook: (input: {
    title: string;
    author: string;
    startDate: string;
    targetFinishDate: string;
    dailyPageGoal: number;
    totalPages: number;
    notes?: string;
  }) => void;
  onLogPages: (bookId: string, date: string, pages: number) => void;
  onUpdateNotes: (bookId: string, notes: string) => void;
  onAddQuote: (bookId: string, quote: string) => void;
};

const BookSidebarPanel = ({
  open,
  books,
  onToggleOpen,
  onAddBook,
  onLogPages,
  onUpdateNotes,
  onAddQuote
}: BookSidebarPanelProps) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [targetFinishDate, setTargetFinishDate] = useState('');
  const [dailyPageGoal, setDailyPageGoal] = useState(20);
  const [totalPages, setTotalPages] = useState(300);
  const [notes, setNotes] = useState('');
  const [notesDrafts, setNotesDrafts] = useState<Record<string, string>>({});
  const [quoteDrafts, setQuoteDrafts] = useState<Record<string, string>>({});

  return (
    <aside className={`fixed right-0 top-0 z-40 h-screen w-full max-w-md transform border-l border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur-sm transition-transform dark:border-slate-700 dark:bg-surface-darkCard/95 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Books</h3>
        <button
          type="button"
          onClick={onToggleOpen}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600"
        >
          {open ? 'Close' : 'Open'}
        </button>
      </div>

      <form
        className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
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
        }}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900" />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900" />
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900" />
          <input type="date" value={targetFinishDate} onChange={(e) => setTargetFinishDate(e.target.value)} className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" min={1} value={dailyPageGoal} onChange={(e) => setDailyPageGoal(Number(e.target.value))} placeholder="Daily pages" className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900" />
          <input type="number" min={1} value={totalPages} onChange={(e) => setTotalPages(Number(e.target.value))} placeholder="Total pages" className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900" />
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className="h-16 w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900" />
        <button type="submit" className="w-full rounded-md py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
          Add Book
        </button>
      </form>

      <div className="mt-4 space-y-2 overflow-y-auto pb-8">
        {books.map((book) => {
          const progress = getBookProgress(book);
          const noteValue = notesDrafts[book.id] ?? book.notes;
          const quoteValue = quoteDrafts[book.id] ?? '';
          return (
            <article key={book.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{book.title}</p>
              <p className="text-xs text-slate-500">{book.author}</p>
              <div className="mt-2 h-1.5 rounded bg-slate-200 dark:bg-slate-700">
                <div className="h-full rounded" style={{ width: `${progress.percent}%`, backgroundColor: 'var(--secondary-color)' }} />
              </div>
              <p className="mt-1 text-xs text-slate-500">{progress.pagesRead}/{book.totalPages} pages • {progress.onTrack ? 'On track' : 'Behind'}</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Pages today"
                  className="w-24 rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      const target = event.target as HTMLInputElement;
                      onLogPages(book.id, new Date().toISOString().slice(0, 10), Number(target.value));
                      target.value = '';
                    }
                  }}
                />
                <span className="text-[11px] text-slate-500">press Enter</span>
              </div>

              <div className="mt-3 space-y-2 rounded-md border border-slate-200 p-2 dark:border-slate-700">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Notes</p>
                <textarea
                  value={noteValue}
                  onChange={(event) =>
                    setNotesDrafts((prev) => ({
                      ...prev,
                      [book.id]: event.target.value
                    }))
                  }
                  placeholder="Topic summary"
                  className="h-16 w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => onUpdateNotes(book.id, noteValue)}
                  className="rounded border border-slate-300 px-2 py-1 text-[11px] dark:border-slate-600"
                >
                  Save Notes
                </button>
              </div>

              <div className="mt-2 space-y-2 rounded-md border border-slate-200 p-2 dark:border-slate-700">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Quotes</p>

                <div className="flex items-center gap-2">
                  <input
                    value={quoteValue}
                    onChange={(event) =>
                      setQuoteDrafts((prev) => ({
                        ...prev,
                        [book.id]: event.target.value
                      }))
                    }
                    placeholder="Add quote"
                    className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const quote = quoteValue.trim();
                      if (!quote) {
                        return;
                      }
                      onAddQuote(book.id, quote);
                      setQuoteDrafts((prev) => ({
                        ...prev,
                        [book.id]: ''
                      }));
                    }}
                    className="rounded border border-slate-300 px-2 py-1 text-[11px] dark:border-slate-600"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1">
                  {book.quotes.map((quote, index) => (
                    <p key={`${book.id}-${index}`} className="text-xs text-slate-600 dark:text-slate-300">
                      "{quote}"
                    </p>
                  ))}
                  {book.quotes.length === 0 ? (
                    <p className="text-[11px] text-slate-500">No quotes yet.</p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
};

export default BookSidebarPanel;
