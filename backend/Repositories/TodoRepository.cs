using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly AppDbContext _context;

    public TodoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TodoItem>> GetAllAsync()
        => await _context.TodoItems.OrderByDescending(t => t.CreatedAt).ToListAsync();

    public async Task<TodoItem?> GetByIdAsync(Guid id)
        => await _context.TodoItems.FindAsync(id);

    public async Task<TodoItem> CreateAsync(TodoItem item)
    {
        _context.TodoItems.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<TodoItem?> UpdateAsync(TodoItem item)
    {
        var existing = await _context.TodoItems.FindAsync(item.Id);
        if (existing is null) return null;

        existing.Title = item.Title;
        existing.Description = item.Description;
        existing.IsCompleted = item.IsCompleted;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var item = await _context.TodoItems.FindAsync(id);
        if (item is null) return false;

        _context.TodoItems.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}
