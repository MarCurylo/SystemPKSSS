using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using SystemPKSSS.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace SystemPKSSSS.Endpoints;

public static class AttributeDefinitionsEndpoints
{
    public static void MapAttributeDefinitionsEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření definice atributu (admin)
        app.MapPost("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions",
            [Authorize(Roles = "Admin")] async (int serviceId, int entityTypeId, CreateAttributeDefinitionDto dto, ApplicationDbContext db) =>
            {
                var entityTypeExists = await db.EntityTypes.AnyAsync(s => s.Id == entityTypeId && s.ServiceId == serviceId);
                if (!entityTypeExists)
                    return Results.BadRequest($"Entity type with ID {entityTypeId} does not exist for service {serviceId}.");

                if (!Enum.TryParse<AttributeDataType>(dto.AttributeType, true, out var attributeTypeEnum))
                {
                    return Results.BadRequest($"Invalid AttributeType: {dto.AttributeType}. Allowed values: {string.Join(", ", Enum.GetNames(typeof(AttributeDataType)))}");
                }

                var attributeDefinition = new AttributeDefinition
                {
                    EntityTypeId = entityTypeId,
                    Name = dto.Name,
                    DisplayName = dto.DisplayName,
                    AttributeType = attributeTypeEnum,
                    IsRequired = dto.IsRequired,
                    OrderIndex = dto.OrderIndex,
                    IsDisplayName = dto.IsDisplayName,
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
                    AttributeType = attributeDefinition.AttributeType.ToString(),
                    IsRequired = attributeDefinition.IsRequired,
                    OrderIndex = attributeDefinition.OrderIndex,
                    IsDisplayName = attributeDefinition.IsDisplayName,
                    CreatedAt = attributeDefinition.CreatedAt
                };

                return Results.Created($"/attributeDefinitions/{attributeDefinition.Id}", result);
            });

        // Výpis všech definic atributů (přihlášený)
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions",
            [Authorize] async (int serviceId, int entityTypeId, ApplicationDbContext db) =>
            {
                var attributeDefinitions = await db.AttributeDefinitions
                    .Include(a => a.EnumValues)
                    .Where(et => et.EntityTypeId == entityTypeId)
                    .Select(attributeDefinition => new AttributeDefinitionDto
                    {
                        Id = attributeDefinition.Id,
                        EntityTypeId = attributeDefinition.EntityTypeId,
                        Name = attributeDefinition.Name,
                        DisplayName = attributeDefinition.DisplayName,
                        AttributeType = attributeDefinition.AttributeType.ToString(),
                        IsRequired = attributeDefinition.IsRequired,
                        OrderIndex = attributeDefinition.OrderIndex,
                        IsDisplayName = attributeDefinition.IsDisplayName,
                        CreatedAt = attributeDefinition.CreatedAt,
                        EnumValues = attributeDefinition.EnumValues
                            .Select(ev => new AttributeEnumValueDto
                            {
                                Id = ev.Id,
                                AttributeDefinitionId = ev.AttributeDefinitionId,
                                Value = ev.Value,
                                DisplayOrder = ev.DisplayOrder
                            })
                            .OrderBy(ev => ev.DisplayOrder)
                            .ToList()
                    })
                    .AsNoTracking()
                    .ToListAsync();

                return Results.Ok(attributeDefinitions);
            });

        // Detail definice atributu (přihlášený)
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions/{attributeDefinitionId}",
            [Authorize] async (int serviceId, int entityTypeId, int attributeDefinitionId, ApplicationDbContext db) =>
            {
                var attributeDefinition = await db.AttributeDefinitions
                    .Include(a => a.EnumValues)
                    .Where(a => a.Id == attributeDefinitionId && a.EntityTypeId == entityTypeId)
                    .Select(attributeDefinition => new AttributeDefinitionDto
                    {
                        Id = attributeDefinition.Id,
                        EntityTypeId = attributeDefinition.EntityTypeId,
                        Name = attributeDefinition.Name,
                        DisplayName = attributeDefinition.DisplayName,
                        AttributeType = attributeDefinition.AttributeType.ToString(),
                        IsRequired = attributeDefinition.IsRequired,
                        OrderIndex = attributeDefinition.OrderIndex,
                        IsDisplayName = attributeDefinition.IsDisplayName,
                        CreatedAt = attributeDefinition.CreatedAt,
                        EnumValues = attributeDefinition.EnumValues
                            .Select(ev => new AttributeEnumValueDto
                            {
                                Id = ev.Id,
                                AttributeDefinitionId = ev.AttributeDefinitionId,
                                Value = ev.Value,
                                DisplayOrder = ev.DisplayOrder
                            })
                            .OrderBy(ev => ev.DisplayOrder)
                            .ToList()
                    })
                    .FirstOrDefaultAsync();

                return attributeDefinition is not null ? Results.Ok(attributeDefinition) : Results.NotFound();
            });

        // PATCH pro změnu IsDisplayName (admin)
        app.MapMethods(
            "/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions/{attributeDefinitionId}",
            new[] { "PATCH" },
            [Authorize(Roles = "Admin")]
        async (int serviceId, int entityTypeId, int attributeDefinitionId, AttributeDefinitionDto patchDto, ApplicationDbContext db) =>
            {
                var attributeDefinition = await db.AttributeDefinitions
                    .FirstOrDefaultAsync(a => a.Id == attributeDefinitionId && a.EntityTypeId == entityTypeId);

                if (attributeDefinition == null)
                    return Results.NotFound();

                attributeDefinition.IsDisplayName = patchDto.IsDisplayName;

                await db.SaveChangesAsync();

                return Results.NoContent();
            });

        // Mazání definice atributu (admin)
        app.MapDelete("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions/{attributeDefinitionId}",
            [Authorize(Roles = "Admin")] async (int serviceId, int entityTypeId, int attributeDefinitionId, ApplicationDbContext db) =>
            {
                var attributeDefinition = await db.AttributeDefinitions
                    .Where(a => a.Id == attributeDefinitionId && a.EntityTypeId == entityTypeId)
                    .FirstOrDefaultAsync();

                if (attributeDefinition is null) return Results.NotFound();

                db.AttributeDefinitions.Remove(attributeDefinition);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });

        // Vytvoření nové enum hodnoty pro konkrétní definici atributu (admin)
        app.MapPost("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions/{attributeDefinitionId}/attributeEnumValue",
            [Authorize(Roles = "Admin")] async (int serviceId, int entityTypeId, int attributeDefinitionId, AttributeEnumValueDto dto, ApplicationDbContext db) =>
            {
                var attributeDefinitionExists = await db.AttributeDefinitions.AnyAsync(s => s.Id == attributeDefinitionId && s.EntityTypeId == entityTypeId);
                if (!attributeDefinitionExists)
                    return Results.BadRequest($"Attribute definition with ID {attributeDefinitionId} does not exist for entity type {entityTypeId}.");

                var attributeEnumValue = new AttributeEnumValue
                {
                    AttributeDefinitionId = attributeDefinitionId,
                    Value = dto.Value,
                    DisplayOrder = dto.DisplayOrder
                };

                db.AttributeEnumValues.Add(attributeEnumValue);
                await db.SaveChangesAsync();

                dto.Id = attributeEnumValue.Id;
                dto.AttributeDefinitionId = attributeDefinitionId;

                return Results.Created($"/attributeDefinitions/{attributeDefinitionId}/attributeEnumValue/{dto.Id}", dto);
            });
    }
}
