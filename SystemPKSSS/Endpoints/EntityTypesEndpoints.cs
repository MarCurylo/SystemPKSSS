using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using SystemPKSSS.DTOs;

namespace SystemPKSSSS.Endpoints;

public static class EntityTypesEndpoints
{
    public static void MapEntityTypesEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření typu entity
        app.MapPost("/services/{serviceId}/entityTypes", async (int serviceId, CreateEntityTypeDto dto, ApplicationDbContext db) =>
        {
            var serviceExists = await db.Services.AnyAsync(s => s.Id == serviceId);
            if (!serviceExists)
                return Results.BadRequest($"Service with ID {serviceId} does not exist.");

            var entityType = new EntityType
            {
                ServiceId = serviceId,
                Name = dto.Name,
                Description = dto.Description,
                Visible = dto.Visible,
                Editable = dto.Editable,
                Exportable = dto.Exportable,
                Auditable = dto.Auditable,
                CreatedAt = DateTimeOffset.UtcNow
            };
            db.EntityTypes.Add(entityType);
            await db.SaveChangesAsync();

            var result = new EntityTypeDto
            {
                Id = entityType.Id,
                ServiceId = entityType.ServiceId,
                Name = entityType.Name,
                Description = entityType.Description,
                Visible = entityType.Visible,
                Editable = entityType.Editable,
                Exportable = entityType.Exportable,
                Auditable = entityType.Auditable,
                CreatedAt = entityType.CreatedAt
            };
            return Results.Created($"/services/{serviceId}/entityTypes/{entityType.Id}", result);
        });

        // Výpis typu entit podle služby
        app.MapGet("/services/{serviceId}/entityTypes", async (int serviceId, ApplicationDbContext db) =>
        {
            var entityTypes = await db.EntityTypes
                .Where(et => et.ServiceId == serviceId)
                .Select(et => new EntityTypeDto
                {
                    Id = et.Id,
                    ServiceId = et.ServiceId,
                    Name = et.Name,
                    Description = et.Description,
                    Visible = et.Visible,
                    Editable = et.Editable,
                    Exportable = et.Exportable,
                    Auditable = et.Auditable,
                    CreatedAt = et.CreatedAt
                })
                .AsNoTracking()
                .ToListAsync();
            return Results.Ok(entityTypes);
        });

        // Detail typu entity
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}", async (int serviceId, int entityTypeId, ApplicationDbContext db) =>
        {
            var et = await db.EntityTypes
                .Where(x => x.Id == entityTypeId && x.ServiceId == serviceId)
                .Select(x => new EntityTypeDto
                {
                    Id = x.Id,
                    ServiceId = x.ServiceId,
                    Name = x.Name,
                    Description = x.Description,
                    Visible = x.Visible,
                    Editable = x.Editable,
                    Exportable = x.Exportable,
                    Auditable = x.Auditable,
                    CreatedAt = x.CreatedAt
                })
                .FirstOrDefaultAsync();
            return et is not null ? Results.Ok(et) : Results.NotFound();
        });

        // Editace typu entity
        app.MapPut("/services/{serviceId}/entityTypes/{entityTypeId}",
            async (int serviceId, int entityTypeId, UpdateEntityTypeDto dto, ApplicationDbContext db) =>
        {
            var entityType = await db.EntityTypes.FindAsync(entityTypeId);
            if (entityType is null || entityType.ServiceId != serviceId)
                return Results.NotFound();

            entityType.Name = dto.Name;
            entityType.Description = dto.Description;
            entityType.Visible = dto.Visible;
            entityType.Editable = dto.Editable;
            entityType.Exportable = dto.Exportable;
            entityType.Auditable = dto.Auditable;

            await db.SaveChangesAsync();

            var result = new EntityTypeDto
            {
                Id = entityType.Id,
                ServiceId = entityType.ServiceId,
                Name = entityType.Name,
                Description = entityType.Description,
                Visible = entityType.Visible,
                Editable = entityType.Editable,
                Exportable = entityType.Exportable,
                Auditable = entityType.Auditable,
                CreatedAt = entityType.CreatedAt
            };

            return Results.Ok(result);
        });

        // Nastavení visibility (bonus)
        app.MapPut("/entityTypes/{id}/visible", async (int id, bool visible, ApplicationDbContext db) =>
        {
            var entityType = await db.EntityTypes.FindAsync(id);
            if (entityType is null) return Results.NotFound();
            entityType.Visible = visible;
            await db.SaveChangesAsync();
            var result = new EntityTypeDto
            {
                Id = entityType.Id,
                ServiceId = entityType.ServiceId,
                Name = entityType.Name,
                Description = entityType.Description,
                Visible = entityType.Visible,
                Editable = entityType.Editable,
                Exportable = entityType.Exportable,
                Auditable = entityType.Auditable,
                CreatedAt = entityType.CreatedAt
            };
            return Results.Ok(result);
        });

        // Mazání typu entity
        app.MapDelete("/services/{serviceId}/entityTypes/{entityTypeId}", async (int serviceId, int entityTypeId, ApplicationDbContext db) =>
        {
            var entityType = await db.EntityTypes.FindAsync(entityTypeId);
            if (entityType is null) return Results.NotFound();
            db.EntityTypes.Remove(entityType);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
