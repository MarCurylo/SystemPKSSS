using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using System.ComponentModel;

namespace SystemPKSSSS.Endpoints;


public static class EntitiesEndpoints
{
    public static void MapEntityEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření nové entity
        app.MapPost("/services/{serviceId}/entityTypes/{entityTypeId}/entities", async (int entityTypeId, Entity entity, ApplicationDbContext db) =>
    {
        // Validace existence typu entit
        var entityTypeExists = await db.EntityTypes.AnyAsync(s => s.Id == entityTypeId);
        if (!entityTypeExists)
        {
            return Results.BadRequest($"entity type with ID {entityTypeId} does not exist.");
        }
        entiti.EntityTypeId = entityTypeId;

            var entity = new Entity
    {
        ServiceId = serviceId,
        EntityTypeId = entityTypeId,
        CreatedAt = DateTime.UtcNow,
        AttributeValues = dto.AttributeValues.Select(v => new EntityAttributeValue
        {
            AttributeDefinitionId = v.AttributeDefinitionId,
            Value = v.Value
        }).ToList()
    };

    db.Entities.Add(entity);
    await db.SaveChangesAsync();

    return Results.Created($"/services/{serviceId}/entitytypes/{entityTypeId}/entities/{entity.Id}", entity);
});


        // Výpis entit podle entity type GET
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/entities", async (int serviceId, int entityTypeId, ApplicationDbContext db) =>
        {
            var entities = await db.Entities
            .Where(et => et.EntityTypeId == entityTypeId)
            .AsNoTracking()
            // .Include(e => e.AttributeValues)
            .ToListAsync();
            return Results.Ok(entities);
        });

        // Detail entity GET
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}", async (int serviceId, int entityTypeId, int entityId, ApplicationDbContext db) =>
        {
            var entity = await db.Entities.FindAsync(entityId);
            return entity is not null ? Results.Ok(entity) : Results.NotFound();
        });

        // Mazání definice attributu DELETE
        app.MapDelete("/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}", async (int serviceId, int entityTypeId, int entityId, ApplicationDbContext db) =>
        {
            var entity = await db.Entities.FindAsync(entityId);
            if (entity is null) return Results.NotFound();
            db.Entities.Remove(entity);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}