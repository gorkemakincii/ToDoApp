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

    public async Task<IEnumerable<TodoResponseDto>> GetAllAsync()
    {
        var items = await _repository.GetAllAsync();
        return items.Select(ToDto);
    }

    public async Task<TodoResponseDto> CreateAsync(CreateTodoDto dto)
    {
        var item = new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repository.CreateAsync(item);
        return ToDto(created);
    }

    public async Task<TodoResponseDto?> UpdateAsync(Guid id, UpdateTodoDto dto)
    {
        var item = new TodoItem
        {
            Id = id,
            Title = dto.Title,
            Description = dto.Description,
            IsCompleted = dto.IsCompleted
        };
        var updated = await _repository.UpdateAsync(item);
        return updated is null ? null : ToDto(updated);
    }

    public Task<bool> DeleteAsync(Guid id)
        => _repository.DeleteAsync(id);

    private static TodoResponseDto ToDto(TodoItem item) => new()
    {
        Id = item.Id,
        Title = item.Title,
        Description = item.Description,
        IsCompleted = item.IsCompleted,
        CreatedAt = item.CreatedAt
    };
}
