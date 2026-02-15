import { useEffect, useState } from 'react';
import AvatarUploader from './AvatarUploader';
import type { UserProfile } from '../types/habit';

type UserProfilePanelProps = {
  open: boolean;
  email: string | null;
  profile: UserProfile;
  onClose: () => void;
  onSave: (patch: Partial<UserProfile>) => Promise<void>;
};

const UserProfilePanel = ({ open, email, profile, onClose, onSave }: UserProfilePanelProps) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);

  useEffect(() => {
    setName(profile.name);
    setAvatar(profile.avatar);
  }, [profile]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-surface-darkCard">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">User Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600"
          >
            Close
          </button>
        </div>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{email ?? 'No email'}</p>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-700 dark:text-slate-200">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>

          <AvatarUploader value={avatar} onChange={setAvatar} />

          <button
            type="button"
            onClick={() => void onSave({ name: name.trim() || 'User', avatar })}
            className="w-full rounded-lg py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePanel;
