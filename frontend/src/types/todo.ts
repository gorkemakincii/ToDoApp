export interface TodoItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface CreateTodoDto {
  title: string;
  description: string;
}

export interface UpdateTodoDto {
  title: string;
  description: string;
  isCompleted: boolean;
}
