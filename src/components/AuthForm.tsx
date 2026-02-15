import { useState, type FormEvent } from 'react';

type AuthFormProps = {
  busy: boolean;
  errorMessage: string | null;
  noticeMessage: string | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (name: string, email: string, password: string) => Promise<void>;
};

const AuthForm = ({ busy, errorMessage, noticeMessage, onLogin, onSignup }: AuthFormProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === 'signup') {
      await onSignup(name.trim(), email.trim(), password);
      return;
    }

    await onLogin(email.trim(), password);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-background)] p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-surface-darkCard">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Habit Tracker</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {mode === 'login' ? 'Log in to continue.' : 'Create a new account.'}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              mode === 'login'
                ? 'bg-[var(--secondary-color)] text-white'
                : 'border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              mode === 'signup'
                ? 'bg-[var(--secondary-color)] text-white'
                : 'border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {mode === 'signup' ? (
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                required
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
              required
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-rose-300 bg-rose-50 px-2 py-1 text-xs text-rose-700 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
              {errorMessage}
            </p>
          ) : null}
          {noticeMessage ? (
            <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
              {noticeMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg py-2 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            {busy ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AuthForm;
