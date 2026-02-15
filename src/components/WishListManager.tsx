import { useState } from 'react';
import type { WishList } from '../types/habit';

type WishListManagerProps = {
  lists: WishList[];
  onAddList: (name: string) => void;
  onRenameList: (listId: string, name: string) => void;
  onDeleteList: (listId: string) => void;
  onAddItem: (listId: string, name: string, price?: number) => void;
  onToggleItem: (listId: string, itemId: string) => void;
};

const WishListManager = ({
  lists,
  onAddList,
  onRenameList,
  onDeleteList,
  onAddItem,
  onToggleItem
}: WishListManagerProps) => {
  const [listName, setListName] = useState('');

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!listName.trim()) return;
          onAddList(listName.trim());
          setListName('');
        }}
      >
        <input
          value={listName}
          onChange={(event) => setListName(event.target.value)}
          placeholder="New shopping list"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
        <button type="submit" className="rounded-md px-3 py-2 text-sm font-semibold text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
          Add List
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {lists.map((list) => (
          <article key={list.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{list.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const name = window.prompt('Rename list', list.name);
                    if (!name) return;
                    onRenameList(list.id, name);
                  }}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                >
                  Rename
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteList(list.id)}
                  className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 dark:border-rose-700 dark:text-rose-300"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const name = window.prompt('Item name');
                    if (!name) return;
                    const price = window.prompt('Price (optional)', '');
                    onAddItem(list.id, name, price ? Number(price) : undefined);
                  }}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                >
                  + Item
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {list.items.map((item) => (
                <label key={item.id} className="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" checked={item.purchased} onChange={() => onToggleItem(list.id, item.id)} />
                    <span className={item.purchased ? 'line-through opacity-60' : ''}>{item.name}</span>
                  </span>
                  {item.price ? <span className="text-xs text-slate-500">${item.price}</span> : null}
                </label>
              ))}

              {list.items.length === 0 ? <p className="text-xs text-slate-500">No items.</p> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default WishListManager;
