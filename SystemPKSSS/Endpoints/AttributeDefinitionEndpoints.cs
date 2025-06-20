using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using System.ComponentModel;

namespace SystemPKSSSS.Endpoints;


public static class AttributeDefinitionsEndpoints
{
    public static void MapAttributeDefinitionsEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření noveho attributu POST
        app.MapPost("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions", async (int entityTypeId, AttributeDefinition attributeDefinition, ApplicationDbContext db) =>
    {
        // Validace existence typu entit
        var entityTypeExists = await db.EntityTypes.AnyAsync(s => s.Id == entityTypeId);
        if (!entityTypeExists)
        {
            return Results.BadRequest($"entity type with ID {entityTypeId} does not exist.");
        }
        attributeDefinition.EntityTypeId = entityTypeId;

        db.AttributeDefinitions.Add(attributeDefinition);
        await db.SaveChangesAsync();
        return Results.Created($"/attributeDefinitions/{attributeDefinition.Id}", attributeDefinition);
    });


        // Výpis definic atribut podle entity type GET
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions", async (int serviceId, int entityTypeId, ApplicationDbContext db) =>
        {
            var attributeDefinitions = await db.AttributeDefinitions
            .Where(et => et.EntityTypeId == entityTypeId)
            .AsNoTracking()
            .ToListAsync();
            return Results.Ok(attributeDefinitions);
        });

        // Detail definice atributu GET
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions/{attributeDefinitionId}", async (int serviceId, int entityTypeId, int attributeDefinitionId, ApplicationDbContext db) =>
        {
            var attributeDefinition = await db.AttributeDefinitions.FindAsync(attributeDefinitionId);
            return attributeDefinition is not null ? Results.Ok(attributeDefinition) : Results.NotFound();
        });

        // Mazání definice attributu DELETE
        app.MapDelete("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions/{attributeDefinitionId}", async (int serviceId, int entityTypeId, int attributeDefinitionId, ApplicationDbContext db) =>
        {
            var attributeDefinition = await db.AttributeDefinitions.FindAsync(attributeDefinitionId);
            if (attributeDefinition is null) return Results.NotFound();
            db.AttributeDefinitions.Remove(attributeDefinition);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        //Vytvoř enum moznosti pro konkretni definici attributu
        app.MapPost("/services/{serviceId}/entityTypes/{entityTypeId}/attributeDefinitions/{attributeDefinitionId}/attributeEnumValue",
            async (int serviceId, int entityTypeId, int attributeDefinitionId, AttributeEnumValue attributeEnumValue, ApplicationDbContext db) =>
        {
            // Ověř existenci parent definice
            var attributeDefinitionExists = await db.AttributeDefinitions.AnyAsync(s => s.Id == attributeDefinitionId);
            if (!attributeDefinitionExists)
            {
                return Results.BadRequest($"Attribute definition with ID {attributeDefinitionId} does not exist.");
            }

            // Propoj novou enum hodnotu s parent definicí
            attributeEnumValue.AttributeDefinitionId = attributeDefinitionId;

            db.AttributeEnumValue.Add(attributeEnumValue);
            await db.SaveChangesAsync();

            return Results.Created($"/enumValues/{attributeEnumValue.Id}", attributeEnumValue);
        });
    }
}