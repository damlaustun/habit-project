import { useState } from 'react';
import type { NoteItem } from '../types/habit';

type NotesBoardProps = {
  items: NoteItem[];
  onAddNote: (input: { title: string; content?: string }) => void;
  onUpdateNote: (noteId: string, patch: { title?: string; content?: string }) => void;
  onDeleteNote: (noteId: string) => void;
};

const NotesBoard = ({ items, onAddNote, onUpdateNote, onDeleteNote }: NotesBoardProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  return (
    <div className="space-y-4">
      <form
        className="grid gap-2 rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700"
        onSubmit={(event) => {
          event.preventDefault();
          const normalizedTitle = title.trim();
          if (!normalizedTitle) return;
          onAddNote({ title: normalizedTitle, content });
          setTitle('');
          setContent('');
        }}
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Note title"
          className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your note"
          className="h-24 rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
        <button
          type="submit"
          className="justify-self-start rounded px-3 py-1.5 text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--secondary-color)' }}
        >
          Add Note
        </button>
      </form>

      <div className="space-y-2">
        {items.map((note) => {
          const isEditing = editingId === note.id;
          return (
            <article key={note.id} className="rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                  />
                  <textarea
                    value={editContent}
                    onChange={(event) => setEditContent(event.target.value)}
                    className="h-24 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateNote(note.id, { title: editTitle, content: editContent });
                        setEditingId(null);
                      }}
                      className="rounded px-2 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: 'var(--secondary-color)' }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{note.title}</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{note.content || 'No content'}</p>
                  </div>
                  <details className="relative">
                    <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600">
                      Edit
                    </summary>
                    <div className="absolute right-0 z-20 mt-1 w-32 rounded border border-slate-200 bg-[var(--card-color)] p-1 shadow-lg dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(note.id);
                          setEditTitle(note.title);
                          setEditContent(note.content);
                        }}
                        className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Edit note
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Delete note
                      </button>
                    </div>
                  </details>
                </div>
              )}
            </article>
          );
        })}

        {items.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
            No notes yet.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default NotesBoard;
