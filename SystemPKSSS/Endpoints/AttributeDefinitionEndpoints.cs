using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using SystemPKSSS.DTOs;

namespace SystemPKSSSS.Endpoints;

public static class AttributeDefinitionsEndpoints
{
    public static void MapAttributeDefinitionsEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření nového atributu
        app.MapPost("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions", async (int serviceId, int entityTypeId, CreateAttributeDefinitionDto dto, ApplicationDbContext db) =>
        {
            // Validace existence typu entity
            var entityTypeExists = await db.EntityTypes.AnyAsync(s => s.Id == entityTypeId && s.ServiceId == serviceId);
            if (!entityTypeExists)
                return Results.BadRequest($"Entity type with ID {entityTypeId} does not exist for service {serviceId}.");

            var attributeDefinition = new AttributeDefinition
            {
                EntityTypeId = entityTypeId,
                Name = dto.Name,
                DisplayName = dto.DisplayName,
                AttributeType = dto.AttributeType,
                IsRequired = dto.IsRequired,
                OrderIndex = dto.OrderIndex,
                CreatedAt = DateTimeOffset.UtcNow
            };

            db.AttributeDefinitions.Add(attributeDefinition);
            await db.SaveChangesAsync();

            var result = new AttributeDefinitionDto
            {
                Id = attributeDefinition.Id,
                EntityTypeId = attributeDefinition.EntityTypeId,
                Name = attributeDefinition.Name,
                DisplayName = attributeDefinition.DisplayName,
                AttributeType = attributeDefinition.AttributeType, // enum do DTO
                IsRequired = attributeDefinition.IsRequired,
                OrderIndex = attributeDefinition.OrderIndex,
                CreatedAt = attributeDefinition.CreatedAt
            };

            return Results.Created($"/attributeDefinitions/{attributeDefinition.Id}", result);
        });

        // Výpis definic atributu podle typu entity
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions", async (int serviceId, int entityTypeId, ApplicationDbContext db) =>
        {
            var attributeDefinitions = await db.AttributeDefinitions
                .Where(et => et.EntityTypeId == entityTypeId)
                .Select(attributeDefinition => new AttributeDefinitionDto
                {
                    Id = attributeDefinition.Id,
                    EntityTypeId = attributeDefinition.EntityTypeId,
                    Name = attributeDefinition.Name,
                    DisplayName = attributeDefinition.DisplayName,
                    AttributeType = attributeDefinition.AttributeType, // enum do DTO
                    IsRequired = attributeDefinition.IsRequired,
                    OrderIndex = attributeDefinition.OrderIndex,
                    CreatedAt = attributeDefinition.CreatedAt
                })
                .AsNoTracking()
                .ToListAsync();
            return Results.Ok(attributeDefinitions);
        });

        // Detail definice atributu
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions/{attributeDefinitionId}", async (int serviceId, int entityTypeId, int attributeDefinitionId, ApplicationDbContext db) =>
        {
            var attributeDefinition = await db.AttributeDefinitions
                .Where(a => a.Id == attributeDefinitionId && a.EntityTypeId == entityTypeId)
                .Select(attributeDefinition => new AttributeDefinitionDto
                {
                    Id = attributeDefinition.Id,
                    EntityTypeId = attributeDefinition.EntityTypeId,
                    Name = attributeDefinition.Name,
                    DisplayName = attributeDefinition.DisplayName,
                    AttributeType = attributeDefinition.AttributeType, 
                    IsRequired = attributeDefinition.IsRequired,
                    OrderIndex = attributeDefinition.OrderIndex,
                    CreatedAt = attributeDefinition.CreatedAt
                })
                .FirstOrDefaultAsync();

            return attributeDefinition is not null ? Results.Ok(attributeDefinition) : Results.NotFound();
        });

        // Mazání definice atributu
        app.MapDelete("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions/{attributeDefinitionId}", async (int serviceId, int entityTypeId, int attributeDefinitionId, ApplicationDbContext db) =>
        {
            var attributeDefinition = await db.AttributeDefinitions
                .Where(a => a.Id == attributeDefinitionId && a.EntityTypeId == entityTypeId)
                .FirstOrDefaultAsync();

            if (attributeDefinition is null) return Results.NotFound();

            db.AttributeDefinitions.Remove(attributeDefinition);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        // Vytvoření nové enum hodnoty pro konkrétní definici atributu
        app.MapPost("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions/{attributeDefinitionId}/attributeEnumValue",
            async (int serviceId, int entityTypeId, int attributeDefinitionId, AttributeEnumValueDto dto, ApplicationDbContext db) =>
            {
                // Ověř existenci parent definice
                var attributeDefinitionExists = await db.AttributeDefinitions.AnyAsync(s => s.Id == attributeDefinitionId && s.EntityTypeId == entityTypeId);
                if (!attributeDefinitionExists)
                    return Results.BadRequest($"Attribute definition with ID {attributeDefinitionId} does not exist for entity type {entityTypeId}.");

                var attributeEnumValue = new AttributeEnumValue
                {
                    AttributeDefinitionId = attributeDefinitionId,
                    Value = dto.Value,
                    DisplayOrder = dto.DisplayOrder
                };

                db.AttributeEnumValue.Add(attributeEnumValue);
                await db.SaveChangesAsync();

                dto.Id = attributeEnumValue.Id;
                dto.AttributeDefinitionId = attributeDefinitionId;

                return Results.Created($"/attributeDefinitions/{attributeDefinitionId}/attributeEnumValue/{dto.Id}", dto);
            });
    }
}
