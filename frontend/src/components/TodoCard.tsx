import type { TodoItem } from '../types/todo';

interface Props {
  item: TodoItem;
  onToggle: (item: TodoItem) => void;
  onDelete: (id: string) => void;
}

export default function TodoCard({ item, onToggle, onDelete }: Props) {
  return (
    <div className={`flex items-start gap-4 bg-white rounded-2xl shadow-sm border p-5 transition group ${
      item.isCompleted ? 'border-gray-100 opacity-70' : 'border-gray-100 hover:border-indigo-200'
    }`}>
      <button
        onClick={() => onToggle(item)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${
          item.isCompleted
            ? 'bg-indigo-600 border-indigo-600'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
        aria-label={item.isCompleted ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
      >
        {item.isCompleted && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium text-gray-800 break-words ${item.isCompleted ? 'line-through text-gray-400' : ''}`}>
          {item.title}
        </p>
        {item.description && (
          <p className={`text-sm mt-0.5 break-words ${item.isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
            {item.description}
          </p>
        )}
        <p className="text-xs text-gray-300 mt-2">
          {new Date(item.createdAt).toLocaleDateString('tr-TR', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Görevi sil"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
