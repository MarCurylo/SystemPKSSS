using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using SystemPKSSS.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace SystemPKSSSS.Endpoints;

public static class ServicesEndpoints
{
    public static void MapServicesEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření služby (jen admin)
        app.MapPost("/services", [Authorize(Roles = "Admin")] async (CreateServiceDto dto, ApplicationDbContext db) =>
        {
            var service = new Service
            {
                Name = dto.Name,
                Description = dto.Description,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow
            };
            db.Services.Add(service);
            await db.SaveChangesAsync();

            var result = new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                IsActive = service.IsActive,
                CreatedAt = service.CreatedAt
            };
            return Results.Created($"/services/{service.Id}", result);
        });

        // Výpis všech služeb (jen přihlášený)
        app.MapGet("/services", [Authorize] async (ApplicationDbContext db) =>
        {
            var services = await db.Services
                .Select(service => new ServiceDto
                {
                    Id = service.Id,
                    Name = service.Name,
                    Description = service.Description,
                    IsActive = service.IsActive,
                    CreatedAt = service.CreatedAt
                })
                .ToListAsync();
            return Results.Ok(services);
        });

        // Detail služby (jen přihlášený, pokud chceš chránit)
        app.MapGet("/services/{id}", [Authorize] async (int id, ApplicationDbContext db) =>
        {
            var service = await db.Services
                .Where(s => s.Id == id)
                .Select(s => new ServiceDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt
                })
                .FirstOrDefaultAsync();

            return service is not null ? Results.Ok(service) : Results.NotFound();
        });

        // Editace služby (jen admin)
        app.MapPut("/services/{id}", [Authorize(Roles = "Admin")] async (int id, UpdateServiceDto dto, ApplicationDbContext db) =>
        {
            var service = await db.Services.FindAsync(id);
            if (service is null) return Results.NotFound();

            service.Name = dto.Name;
            service.Description = dto.Description;
            if (dto.IsActive.HasValue)
                service.IsActive = dto.IsActive.Value;

            await db.SaveChangesAsync();

            var result = new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                IsActive = service.IsActive,
                CreatedAt = service.CreatedAt
            };
            return Results.Ok(result);
        });

        // Aktivace / deaktivace služby (jen admin)
        app.MapPut("/services/{id}/activate", [Authorize(Roles = "Admin")] async (int id, bool activate, ApplicationDbContext db) =>
        {
            var service = await db.Services.FindAsync(id);
            if (service is null) return Results.NotFound();

            service.IsActive = activate;
            await db.SaveChangesAsync();

            var result = new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                IsActive = service.IsActive,
                CreatedAt = service.CreatedAt
            };
            return Results.Ok(result);
        });

        // Mazání služby (jen admin)
        app.MapDelete("/services/{id}", [Authorize(Roles = "Admin")] async (int id, ApplicationDbContext db) =>
        {
            var service = await db.Services.FindAsync(id);
            if (service is null) return Results.NotFound();

            db.Services.Remove(service);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
