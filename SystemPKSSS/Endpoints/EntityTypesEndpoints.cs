using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;

namespace SystemPKSSSS.Endpoints;

public static class EntityTypesEndpoints
{
    public static void MapEntityTypesEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření typu entity
        app.MapPost("/entityTypes", async (EntityType entityType, ApplicationDbContext db) =>
        {
            // Validace existence služby
            var serviceExists = await db.Services.AnyAsync(s => s.Id == entityType.ServiceId);
            if (!serviceExists)
            {
                return Results.BadRequest($"Entity with ID {entityType.ServiceId} does not exist.");
            }

            db.EntityTypes.Add(entityType);
            await db.SaveChangesAsync();
            return Results.Created($"/entityTypes/{entityType.Id}", entityType);
        });

        // Výpis všech typu entit
        app.MapGet("/entityTypes", async (ApplicationDbContext db) =>
        {
            var entityTypes = await db.EntityTypes.ToListAsync();
            return Results.Ok(entityTypes);
        });

        // Výpis typu entit podle služby
        app.MapGet("/services/{serviceId}/entityTypes", async (int serviceId, ApplicationDbContext db) =>
        {
            var entityTypes = await db.EntityTypes
                                      .Where(et => et.ServiceId == serviceId)
                                      .ToListAsync();
            return Results.Ok(entityTypes);
        });

        // Detail typu entity
        app.MapGet("/entityTypes/{id}", async (int id, ApplicationDbContext db) =>
        {
            var entityType = await db.EntityTypes.FindAsync(id);
            return entityType is not null ? Results.Ok(entityType) : Results.NotFound();
        });

        // Editace typu entity
        app.MapPut("/entityTypes/{id}", async (int id, EntityType updatedEntityType, ApplicationDbContext db) =>
        {
            var entityType = await db.EntityTypes.FindAsync(id);
            if (entityType is null) return Results.NotFound();
            entityType.Name = updatedEntityType.Name;
            entityType.Description = updatedEntityType.Description;
            entityType.IsVisible = updatedEntityType.IsVisible;

            await db.SaveChangesAsync();
            return Results.Ok(entityType);
        });

        // Nastavení visibility
        app.MapPut("/entityTypes/{id}/visible", async (int id, bool visible, ApplicationDbContext db) =>
        {
            var entityType = await db.EntityTypes.FindAsync(id);
            if (entityType is null) return Results.NotFound();
            entityType.IsVisible = visible;
            await db.SaveChangesAsync();
            return Results.Ok(entityType);
        });

        // Mazání entity typu
        app.MapDelete("/entityTypes/{id}", async (int id, ApplicationDbContext db) =>
        {
            var entityType = await db.EntityTypes.FindAsync(id);
            if (entityType is null) return Results.NotFound();
            db.EntityTypes.Remove(entityType);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
