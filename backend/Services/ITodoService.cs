using backend.DTOs;
using backend.Models;

namespace backend.Services;

public interface ITodoService
{
    Task<IEnumerable<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(Guid id);
    Task<TodoItem> CreateAsync(CreateTodoDto dto);
    Task<TodoItem?> UpdateAsync(Guid id, UpdateTodoDto dto);
    Task<bool> DeleteAsync(Guid id);
}
