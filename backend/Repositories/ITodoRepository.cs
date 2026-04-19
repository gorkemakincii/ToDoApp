using backend.Models;

namespace backend.Repositories;

public interface ITodoRepository
{
    Task<IEnumerable<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(Guid id);
    Task<TodoItem> CreateAsync(TodoItem item);
    Task<TodoItem?> UpdateAsync(TodoItem item);
    Task<bool> DeleteAsync(Guid id);
}
