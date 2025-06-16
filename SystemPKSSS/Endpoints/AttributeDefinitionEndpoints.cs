using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;

namespace SystemPKSSSS.Endpoints;

public static class AttributeDefinitionsEndpoints
{
    public static void MapAttributeDefinitionsEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření noveho attributu
        app.MapPost("/{entityTypeId}/attributeDefinitions", async (int entityTypeId, AttributeDefinition attributeDefinition, ApplicationDbContext db) =>
    {
        // Validace existence typu entit
        var entityTypeExists = await db.EntityTypes.AnyAsync(s => s.Id == entityTypeId);
        if (!entityTypeExists)
        {
            return Results.BadRequest($"entity type with ID {entityTypeId} does not exist.");
        }

        //
        attributeDefinition.EntityTypeId = entityTypeId;

        db.AttributeDefinitions.Add(attributeDefinition);
        await db.SaveChangesAsync();
        return Results.Created($"/attributeDefinitions/{attributeDefinition.Id}", attributeDefinition);
    });
    }
}