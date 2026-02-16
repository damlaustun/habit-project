import { useState } from 'react';
import type { MediaType, MediaItem } from '../types/habit';

type MediaCollectionProps = {
  items: MediaItem[];
  onAddItem: (input: { type: MediaType; title: string; genre?: string; notes?: string }) => void;
  onToggleItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
};

const MediaCollection = ({ items, onAddItem, onToggleItem, onDeleteItem }: MediaCollectionProps) => {
  const [type, setType] = useState<MediaType>('movie');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-4">
      <form
        className="grid gap-2 sm:grid-cols-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim()) return;
          onAddItem({ type, title, genre: genre || undefined, notes: notes || undefined });
          setTitle('');
          setGenre('');
          setNotes('');
        }}
      >
        <select value={type} onChange={(event) => setType(event.target.value as MediaType)} className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900">
          <option value="movie">Movie</option>
          <option value="tv">TV Show</option>
          <option value="book">Book</option>
        </select>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900" />
        <input value={genre} onChange={(event) => setGenre(event.target.value)} placeholder="Genre" className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900" />
        <input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notes" className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900" />
        <button
          type="submit"
          className="rounded px-2 py-1.5 text-sm font-semibold"
          style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
        >
          Add
        </button>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
            <div>
              <p className={item.completed ? 'line-through opacity-60' : ''}>{item.title}</p>
              <p className="text-xs text-slate-500">{item.type} {item.genre ? `• ${item.genre}` : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => onToggleItem(item.id)} className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600">
                {item.completed ? 'Undo' : 'Done'}
              </button>
              <details className="relative">
                <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600">
                  Edit
                </summary>
                <div className="absolute right-0 z-20 mt-1 w-24 rounded border border-slate-200 bg-[var(--card-color)] p-1 shadow-lg dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Delete
                  </button>
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaCollection;
