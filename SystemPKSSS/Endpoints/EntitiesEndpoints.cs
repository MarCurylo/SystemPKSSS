using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using SystemPKSSS.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace SystemPKSSSS.Endpoints;

public static class EntitiesEndpoints
{
    public static void MapEntityEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření nové entity (jen admin)
        app.MapPost("/services/{serviceId}/entityTypes/{entityTypeId}/entities",
            [Authorize(Roles = "Admin")] async (int serviceId, int entityTypeId, CreateEntityDto dto, ApplicationDbContext db) =>
            {
                try
                {
                    var entityTypeExists = await db.EntityTypes.AnyAsync(s => s.Id == entityTypeId && s.ServiceId == serviceId);
                    if (!entityTypeExists)
                        return Results.BadRequest(new { error = $"Entity type with ID {entityTypeId} does not exist for service {serviceId}." });

                    var entity = new Entity
                    {
                        ServiceId = serviceId,
                        EntityTypeId = entityTypeId,
                        CreatedAt = DateTimeOffset.UtcNow,
                        AttributeValues = dto.AttributeValues.Select(v => new EntityAttributeValue
                        {
                            AttributeDefinitionId = v.AttributeDefinitionId,
                            ValueString = v.ValueString,
                            ValueNumber = v.ValueNumber,
                            ValueDate = v.ValueDate,
                            ValueBoolean = v.ValueBoolean,
                            CreatedAt = DateTimeOffset.UtcNow
                        }).ToList()
                    };

                    db.Entities.Add(entity);
                    await db.SaveChangesAsync();

                    var result = new EntityDto
                    {
                        Id = entity.Id,
                        ServiceId = entity.ServiceId,
                        EntityTypeId = entity.EntityTypeId,
                        CreatedAt = entity.CreatedAt,
                        UpdatedAt = entity.UpdatedAt,
                        DeletedAt = entity.DeletedAt,
                        AttributeValues = entity.AttributeValues.Select(av => new EntityAttributeValueDto
                        {
                            Id = av.Id,
                            AttributeDefinitionId = av.AttributeDefinitionId,
                            ValueString = av.ValueString,
                            ValueNumber = av.ValueNumber,
                            ValueDate = av.ValueDate,
                            ValueBoolean = av.ValueBoolean,
                            CreatedAt = av.CreatedAt
                        }).ToList()
                    };

                    return Results.Created($"/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entity.Id}", result);
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.Message);
                }
            });

        // Výpis entit podle entity type (jen přihlášený)
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/entities",
            [Authorize] async (int serviceId, int entityTypeId, ApplicationDbContext db) =>
            {
                try
                {
                    var entities = await db.Entities
                        .Where(e => e.EntityTypeId == entityTypeId && e.ServiceId == serviceId)
                        .Include(e => e.AttributeValues)
                        .AsNoTracking()
                        .ToListAsync();

                    var result = entities.Select(entity => new EntityDto
                    {
                        Id = entity.Id,
                        ServiceId = entity.ServiceId,
                        EntityTypeId = entity.EntityTypeId,
                        CreatedAt = entity.CreatedAt,
                        UpdatedAt = entity.UpdatedAt,
                        DeletedAt = entity.DeletedAt,
                        AttributeValues = entity.AttributeValues.Select(av => new EntityAttributeValueDto
                        {
                            Id = av.Id,
                            AttributeDefinitionId = av.AttributeDefinitionId,
                            ValueString = av.ValueString,
                            ValueNumber = av.ValueNumber,
                            ValueDate = av.ValueDate,
                            ValueBoolean = av.ValueBoolean,
                            CreatedAt = av.CreatedAt
                        }).ToList()
                    }).ToList();

                    return Results.Ok(result);
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.Message);
                }
            });

        // Detail entity (jen přihlášený)
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}",
            [Authorize] async (int serviceId, int entityTypeId, int entityId, ApplicationDbContext db) =>
            {
                try
                {
                    var entity = await db.Entities
                        .Where(e => e.Id == entityId && e.EntityTypeId == entityTypeId && e.ServiceId == serviceId)
                        .Include(e => e.AttributeValues)
                        .AsNoTracking()
                        .FirstOrDefaultAsync();

                    if (entity is null)
                        return Results.NotFound(new { error = "Entity not found." });

                    var result = new EntityDto
                    {
                        Id = entity.Id,
                        ServiceId = entity.ServiceId,
                        EntityTypeId = entity.EntityTypeId,
                        CreatedAt = entity.CreatedAt,
                        UpdatedAt = entity.UpdatedAt,
                        DeletedAt = entity.DeletedAt,
                        AttributeValues = entity.AttributeValues.Select(av => new EntityAttributeValueDto
                        {
                            Id = av.Id,
                            AttributeDefinitionId = av.AttributeDefinitionId,
                            ValueString = av.ValueString,
                            ValueNumber = av.ValueNumber,
                            ValueDate = av.ValueDate,
                            ValueBoolean = av.ValueBoolean,
                            CreatedAt = av.CreatedAt
                        }).ToList()
                    };

                    return Results.Ok(result);
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.Message);
                }
            });

        // Update entity (jen admin)
        app.MapPut("/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}",
            [Authorize(Roles = "Admin")] async (int serviceId, int entityTypeId, int entityId, CreateEntityDto dto, ApplicationDbContext db) =>
            {
                try
                {
                    var entity = await db.Entities
                        .Include(e => e.AttributeValues)
                        .FirstOrDefaultAsync(e => e.Id == entityId && e.EntityTypeId == entityTypeId && e.ServiceId == serviceId);

                    if (entity is null)
                        return Results.NotFound(new { error = "Entity not found." });

                    db.EntityAttributeValues.RemoveRange(entity.AttributeValues);

                    entity.AttributeValues = dto.AttributeValues.Select(v => new EntityAttributeValue
                    {
                        AttributeDefinitionId = v.AttributeDefinitionId,
                        ValueString = v.ValueString,
                        ValueNumber = v.ValueNumber,
                        ValueDate = v.ValueDate,
                        ValueBoolean = v.ValueBoolean,
                        CreatedAt = DateTimeOffset.UtcNow
                    }).ToList();

                    entity.UpdatedAt = DateTimeOffset.UtcNow;

                    await db.SaveChangesAsync();

                    var result = new EntityDto
                    {
                        Id = entity.Id,
                        ServiceId = entity.ServiceId,
                        EntityTypeId = entity.EntityTypeId,
                        CreatedAt = entity.CreatedAt,
                        UpdatedAt = entity.UpdatedAt,
                        DeletedAt = entity.DeletedAt,
                        AttributeValues = entity.AttributeValues.Select(av => new EntityAttributeValueDto
                        {
                            Id = av.Id,
                            AttributeDefinitionId = av.AttributeDefinitionId,
                            ValueString = av.ValueString,
                            ValueNumber = av.ValueNumber,
                            ValueDate = av.ValueDate,
                            ValueBoolean = av.ValueBoolean,
                            CreatedAt = av.CreatedAt
                        }).ToList()
                    };

                    return Results.Ok(result);
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.Message);
                }
            });

        // Mazání entity (jen admin)
        app.MapDelete("/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}",
            [Authorize(Roles = "Admin")] async (int serviceId, int entityTypeId, int entityId, ApplicationDbContext db) =>
            {
                try
                {
                    var entity = await db.Entities
                        .Where(e => e.Id == entityId && e.EntityTypeId == entityTypeId && e.ServiceId == serviceId)
                        .FirstOrDefaultAsync();
                    if (entity is null) return Results.NotFound(new { error = "Entity not found." });
                    db.Entities.Remove(entity);
                    await db.SaveChangesAsync();
                    return Results.NoContent();
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.Message);
                }
            });
    }
}
