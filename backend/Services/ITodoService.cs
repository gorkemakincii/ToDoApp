using backend.DTOs;

namespace backend.Services;

public interface ITodoService
{
    Task<IEnumerable<TodoResponseDto>> GetAllAsync();
    Task<TodoResponseDto> CreateAsync(CreateTodoDto dto);
    Task<TodoResponseDto?> UpdateAsync(Guid id, UpdateTodoDto dto);
    Task<bool> DeleteAsync(Guid id);
}
