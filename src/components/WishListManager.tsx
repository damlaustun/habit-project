import { useState } from 'react';
import type { WishList } from '../types/habit';
import { useI18n } from '../i18n/useI18n';

type WishListManagerProps = {
  lists: WishList[];
  onAddList: (name: string) => void;
  onRenameList: (listId: string, name: string) => void;
  onDeleteList: (listId: string) => void;
  onAddItem: (listId: string, name: string, price?: number, quantity?: number) => void;
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
  const { t } = useI18n();
  const [listName, setListName] = useState('');
  const [renameListId, setRenameListId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [addItemListId, setAddItemListId] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemQuantity, setItemQuantity] = useState<number>(1);

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
          placeholder={t('newShoppingList')}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
        <button
          type="submit"
          className="rounded-md px-3 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
        >
          {t('addList')}
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {lists.map((list) => (
          <article key={list.id} className="rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{list.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddItemListId(addItemListId === list.id ? null : list.id);
                    setItemName('');
                    setItemPrice(0);
                    setItemQuantity(1);
                  }}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                >
                  {t('addItem')}
                </button>
                <details className="relative">
                <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600">
                  {t('edit')}
                </summary>
                <div className="absolute right-0 z-20 mt-1 w-36 rounded border border-slate-200 bg-[var(--card-color)] p-1 shadow-lg dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setRenameListId(list.id);
                      setRenameValue(list.name);
                    }}
                    className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t('renameList')}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteList(list.id)}
                    className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t('deleteList')}
                  </button>
                </div>
                </details>
              </div>
            </div>

            {renameListId === list.id ? (
              <div className="mb-2 flex items-center gap-2">
                <input
                  value={renameValue}
                  onChange={(event) => setRenameValue(event.target.value)}
                  className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setRenameListId(null)}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRenameList(list.id, renameValue);
                    setRenameListId(null);
                  }}
                  className="rounded px-2 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
                >
                  {t('save')}
                </button>
              </div>
            ) : null}

            {addItemListId === list.id ? (
              <div className="mb-2 grid gap-1.5 rounded border border-slate-200 p-2 dark:border-slate-700">
                <input
                  value={itemName}
                  onChange={(event) => setItemName(event.target.value)}
                  placeholder={t('itemName')}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                />
                <input
                  type="number"
                  min={0}
                  value={itemPrice}
                  onChange={(event) => setItemPrice(Number(event.target.value))}
                  placeholder={t('priceOptional')}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                />
                <input
                  type="number"
                  min={1}
                  value={itemQuantity}
                  onChange={(event) => setItemQuantity(Number(event.target.value))}
                  placeholder={t('quantity')}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAddItemListId(null)}
                    className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const normalized = itemName.trim();
                      if (!normalized) return;
                      onAddItem(list.id, normalized, itemPrice > 0 ? itemPrice : undefined, itemQuantity > 0 ? itemQuantity : 1);
                      setAddItemListId(null);
                    }}
                    className="rounded px-2 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
                  >
                    {t('save')}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="space-y-1">
              {list.items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <input type="checkbox" checked={item.purchased} onChange={() => onToggleItem(list.id, item.id)} />
                    <span className={item.purchased ? 'line-through opacity-60' : ''}>{item.name}</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    x{item.quantity}
                    {item.price ? ` · $${item.price}` : ''}
                  </span>
                </label>
              ))}

              {list.items.length === 0 ? <p className="text-xs text-slate-500">{t('noItems')}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default WishListManager;
