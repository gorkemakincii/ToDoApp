import type { TodoItem, CreateTodoDto, UpdateTodoDto } from '../types/todo';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5214';
const ENDPOINT = `${BASE_URL}/api/todos`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Sunucu hatası: ${res.status} ${res.statusText}`;
    try {
      const body = await res.text();
      if (body) message = body;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function fetchTodos(): Promise<TodoItem[]> {
  const res = await fetch(ENDPOINT);
  return handleResponse<TodoItem[]>(res);
}

export async function createTodo(dto: CreateTodoDto): Promise<TodoItem> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  return handleResponse<TodoItem>(res);
}

export async function updateTodo(id: string, dto: UpdateTodoDto): Promise<TodoItem> {
  const res = await fetch(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  return handleResponse<TodoItem>(res);
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' });
  return handleResponse<void>(res);
}
