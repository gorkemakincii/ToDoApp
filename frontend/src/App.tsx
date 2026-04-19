import { useEffect, useState } from 'react';
import type { TodoItem, CreateTodoDto } from './types/todo';
import * as api from './services/todoService';
import AddTodoForm from './components/AddTodoForm';
import TodoCard from './components/TodoCard';
import ErrorBanner from './components/ErrorBanner';

type Filter = 'all' | 'active' | 'completed';

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchTodos();
      setTodos(data);
    } catch (e) {
      setError(toMessage(e, 'Görevler yüklenemedi. Backend çalışıyor mu?'));
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(dto: CreateTodoDto) {
    setSubmitting(true);
    setError(null);
    try {
      const created = await api.createTodo(dto);
      setTodos(prev => [created, ...prev]);
    } catch (e) {
      setError(toMessage(e, 'Görev eklenemedi.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(item: TodoItem) {
    // Optimistic update
    setTodos(prev => prev.map(t => t.id === item.id ? { ...t, isCompleted: !t.isCompleted } : t));
    try {
      const updated = await api.updateTodo(item.id, {
        title: item.title,
        description: item.description,
        isCompleted: !item.isCompleted,
      });
      setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (e) {
      // Revert on failure
      setTodos(prev => prev.map(t => t.id === item.id ? item : t));
      setError(toMessage(e, 'Görev güncellenemedi.'));
    }
  }

  async function handleDelete(id: string) {
    const previous = todos;
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await api.deleteTodo(id);
    } catch (e) {
      setTodos(previous);
      setError(toMessage(e, 'Görev silinemedi.'));
    }
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  const completedCount = todos.filter(t => t.isCompleted).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Görevlerim</h1>
          </div>
          <p className="text-sm text-gray-400 ml-11">
            {loading ? 'Yükleniyor…' : `${completedCount} / ${todos.length} görev tamamlandı`}
          </p>
        </div>

        {/* Progress bar */}
        {!loading && todos.length > 0 && (
          <div className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / todos.length) * 100}%` }}
            />
          </div>
        )}

        {/* Error banner */}
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        {/* Add form */}
        <AddTodoForm onAdd={handleAdd} loading={submitting} />

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                filter === f
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? 'Tümü' : f === 'active' ? 'Aktif' : 'Tamamlanan'}
              <span className="ml-1.5 text-xs text-gray-400">
                {f === 'all' ? todos.length : f === 'active' ? todos.length - completedCount : completedCount}
              </span>
            </button>
          ))}
        </div>

        {/* Todo list */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">Görev bulunamadı</p>
              </div>
            ) : (
              filtered.map(item => (
                <TodoCard
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function toMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) return e.message;
  return fallback;
}
