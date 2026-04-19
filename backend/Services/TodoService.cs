using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class TodoService : ITodoService
{
    private readonly ITodoRepository _repository;

    public TodoService(ITodoRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<TodoItem>> GetAllAsync()
        => _repository.GetAllAsync();

    public Task<TodoItem?> GetByIdAsync(Guid id)
        => _repository.GetByIdAsync(id);

    public async Task<TodoItem> CreateAsync(CreateTodoDto dto)
    {
        var item = new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };
        return await _repository.CreateAsync(item);
    }

    public async Task<TodoItem?> UpdateAsync(Guid id, UpdateTodoDto dto)
    {
        var item = new TodoItem
        {
            Id = id,
            Title = dto.Title,
            Description = dto.Description,
            IsCompleted = dto.IsCompleted
        };
        return await _repository.UpdateAsync(item);
    }

    public Task<bool> DeleteAsync(Guid id)
        => _repository.DeleteAsync(id);
}
