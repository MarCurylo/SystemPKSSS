using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;

namespace SystemPKSSSS.Endpoints;

public static class EntityTypesEndpoints
{
    public static void MapEntityTypesEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření typu entity
        app.MapPost("/services/{serviceId}/entityTypes", async (int serviceId, EntityType entityType, ApplicationDbContext db) =>
        {
            // Validace existence služby
            var serviceExists = await db.Services.AnyAsync(s => s.Id == serviceId);
            if (!serviceExists)
            {
                return Results.BadRequest($"Service with ID {serviceId} does not exist.");
            }
            entityType.ServiceId = serviceId;

            db.EntityTypes.Add(entityType);
            await db.SaveChangesAsync();
            return Results.Created($"/services/{serviceId}/entityTypes/{entityType.Id}", entityType);
        });

        // Výpis typu entit podle služby
        app.MapGet("/services/{serviceId}/entityTypes", async (int serviceId, ApplicationDbContext db) =>
        {
            var entityTypes = await db.EntityTypes
    .Where(et => et.ServiceId == serviceId)
    .AsNoTracking()
    .ToListAsync();
            return Results.Ok(entityTypes);
        });

        // Detail typu entity
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}", async (int serviceId, int entityTypeId, ApplicationDbContext db) =>
        {
            var entityType = await db.EntityTypes.FindAsync(entityTypeId);
            return entityType is not null ? Results.Ok(entityType) : Results.NotFound();
        });

        // Editace typu entity
        app.MapPut("/services/{serviceId}/entityTypes/{entityTypeId}",
            async (int serviceId, int entityTypeId, EntityType updatedEntityType, ApplicationDbContext db) =>
        {
            var entityType = await db.EntityTypes.FindAsync(entityTypeId);
            if (entityType is null || entityType.ServiceId != serviceId)
                return Results.NotFound();

            entityType.Name = updatedEntityType.Name;
            entityType.Description = updatedEntityType.Description;
            entityType.Visible = updatedEntityType.Visible;
            entityType.Editable = updatedEntityType.Editable;
            entityType.Exportable = updatedEntityType.Exportable;
            entityType.Auditable = updatedEntityType.Auditable;

            await db.SaveChangesAsync();
            return Results.Ok(entityType);
        });


        // Nastavení visibility
        app.MapPut("/entityTypes/{id}/visible", async (int id, bool visible, ApplicationDbContext db) =>
        {
            var entityType = await db.EntityTypes.FindAsync(id);
            if (entityType is null) return Results.NotFound();
            entityType.Visible = visible;
            await db.SaveChangesAsync();
            return Results.Ok(entityType);
        });

        // Mazání entity typu
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
