import { useState } from 'react';

type AvatarUploaderProps = {
  value: string;
  onChange: (value: string) => void;
};

const presets = ['🙂', '🧠', '⚡', '🔥', '🌿', '🎯'];

const AvatarUploader = ({ value, onChange }: AvatarUploaderProps) => {
  const [urlInput, setUrlInput] = useState('');

  const handleFileChange = (file: File | null) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const isImage = value.startsWith('data:image') || value.startsWith('http');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-50 text-xl dark:border-slate-600 dark:bg-slate-800">
          {isImage ? <img src={value} alt="Avatar" className="h-full w-full object-cover" /> : value}
        </div>
        <label className="cursor-pointer rounded-md border border-slate-300 px-2 py-1 text-xs dark:border-slate-600">
          Upload image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className="rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
          placeholder="or paste image URL"
          className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={() => {
            if (urlInput.trim()) {
              onChange(urlInput.trim());
              setUrlInput('');
            }
          }}
          className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
        >
          Use
        </button>
      </div>
    </div>
  );
};

export default AvatarUploader;
