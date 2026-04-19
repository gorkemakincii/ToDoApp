import { useState } from 'react';
import type { CreateTodoDto } from '../types/todo';

interface Props {
  onAdd: (dto: CreateTodoDto) => void;
  loading: boolean;
}

export default function AddTodoForm({ onAdd, loading }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Yeni Görev Ekle</h2>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Görev başlığı *"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          required
        />
        <input
          type="text"
          placeholder="Açıklama (isteğe bağlı)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="self-end px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-xl transition cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? 'Ekleniyor…' : 'Ekle'}
        </button>
      </div>
    </form>
  );
}
