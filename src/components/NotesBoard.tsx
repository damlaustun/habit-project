import { useMemo, useState } from 'react';
import type { NoteFolder } from '../types/habit';
import { useI18n } from '../i18n/useI18n';

type NotesBoardProps = {
  folders: NoteFolder[];
  onAddFolder: (name: string) => void;
  onRenameFolder: (folderId: string, name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onAddNote: (folderId: string, input: { title: string; content?: string }) => void;
  onUpdateNote: (folderId: string, noteId: string, patch: { title?: string; content?: string }) => void;
  onDeleteNote: (folderId: string, noteId: string) => void;
};

const NotesBoard = ({
  folders,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  onAddNote,
  onUpdateNote,
  onDeleteNote
}: NotesBoardProps) => {
  const { t } = useI18n();
  const [folderName, setFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameFolderValue, setRenameFolderValue] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const selectedFolder = useMemo(
    () => folders.find((folder) => folder.id === selectedFolderId) ?? null,
    [folders, selectedFolderId]
  );

  return (
    <div className="space-y-4">
      {!selectedFolder ? (
        <>
          <section className="grid gap-2 rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700 sm:grid-cols-[1fr_auto]">
            <input
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
              placeholder={t('newFolderName')}
              className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
            <button
              type="button"
              onClick={() => {
                const normalized = folderName.trim();
                if (!normalized) return;
                onAddFolder(normalized);
                setFolderName('');
              }}
              className="rounded px-3 py-1.5 text-sm font-semibold"
              style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
            >
              {t('addFolder')}
            </button>
          </section>

          <section className="space-y-2 rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('folders')}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {folders.map((folder) => (
                <article key={folder.id} className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                  {renamingFolderId === folder.id ? (
                    <div className="space-y-1.5">
                      <input
                        value={renameFolderValue}
                        onChange={(event) => setRenameFolderValue(event.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setRenamingFolderId(null)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                        >
                          {t('cancel')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onRenameFolder(folder.id, renameFolderValue);
                            setRenamingFolderId(null);
                          }}
                          className="rounded px-2 py-1 text-xs font-semibold"
                          style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
                        >
                          {t('save')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedFolderId(folder.id)}
                        className="min-w-0 flex-1 truncate text-left text-sm font-medium text-slate-800 dark:text-slate-100"
                      >
                        {folder.name}
                      </button>
                      <details className="relative">
                        <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-0.5 text-[11px] dark:border-slate-600">
                          {t('edit')}
                        </summary>
                        <div className="absolute right-0 z-20 mt-1 w-32 rounded border border-slate-200 bg-[var(--card-color)] p-1 shadow-lg dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => {
                              setRenamingFolderId(folder.id);
                              setRenameFolderValue(folder.name);
                            }}
                            className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {t('rename')}
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteFolder(folder.id)}
                            className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {t('delete')}
                          </button>
                        </div>
                      </details>
                    </div>
                  )}
                </article>
              ))}
            </div>
            {folders.length === 0 ? <p className="text-xs text-slate-500">{t('noFoldersYet')}</p> : null}
          </section>
        </>
      ) : (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {t('notesInFolder', { name: selectedFolder.name })}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedFolderId(null)}
              className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
            >
              {t('backToFolders')}
            </button>
          </div>

          <form
            className="grid gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const normalized = noteTitle.trim();
              if (!normalized || !selectedFolder) return;
              onAddNote(selectedFolder.id, { title: normalized, content: noteContent });
              setNoteTitle('');
              setNoteContent('');
            }}
          >
            <input
              value={noteTitle}
              onChange={(event) => setNoteTitle(event.target.value)}
              placeholder={t('noteTitle')}
              className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
            <textarea
              value={noteContent}
              onChange={(event) => setNoteContent(event.target.value)}
              placeholder={t('noteContent')}
              className="h-24 rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
            <button
              type="submit"
              className="justify-self-start rounded px-3 py-1.5 text-sm font-semibold"
              style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
            >
              {t('addNote')}
            </button>
          </form>

          <div className="space-y-2">
            {selectedFolder.notes.map((note) => {
            const isEditing = editingId === note.id;
            return (
              <article key={note.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
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
                        {t('cancel')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedFolder) return;
                          onUpdateNote(selectedFolder.id, note.id, { title: editTitle, content: editContent });
                          setEditingId(null);
                        }}
                        className="rounded px-2 py-1 text-xs font-semibold"
                        style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
                      >
                        {t('save')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{note.title}</h4>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{note.content || 'No content'}</p>
                    </div>
                    <details className="relative">
                      <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600">
                        {t('edit')}
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
                          {t('editNote')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedFolder) return;
                            onDeleteNote(selectedFolder.id, note.id);
                          }}
                          className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          {t('deleteNote')}
                        </button>
                      </div>
                    </details>
                  </div>
                )}
              </article>
            );
          })}
          {selectedFolder.notes.length === 0 ? (
            <p className="text-xs text-slate-500">{t('noNotesInFolder')}</p>
          ) : null}
        </div>
        </section>
      )}
    </div>
  );
};

export default NotesBoard;
