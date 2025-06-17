using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;

namespace SystemPKSSSS.Endpoints;

public static class AttributeDefinitionsEndpoints
{
    public static void MapAttributeDefinitionsEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření noveho attributu POST
        app.MapPost("/{entityTypeId}/attributeDefinitions", async (int entityTypeId, AttributeDefinition attributeDefinition, ApplicationDbContext db) =>
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
        // Výpis všech typu entit
        app.MapGet("/attributeDefinitions", async (ApplicationDbContext db) =>
        {
            var attributeDefinitions = await db.AttributeDefinitions.ToListAsync();
            return Results.Ok(attributeDefinitions);
        });
        // Výpis definic atribut podle entity type
        app.MapGet("/entityTypes/{entityTypeId}/attributeDefinitions", async (int entityTypeId, ApplicationDbContext db) =>
        {
            var attributeDefinitions = await db.AttributeDefinitions
    .Where(et => et.EntityTypeId == entityTypeId)
    .AsNoTracking()
    .ToListAsync();
            return Results.Ok(attributeDefinitions);
        });

        // Detail definice atributu
        app.MapGet("/attributeDefinitions/{id}", async (int id, ApplicationDbContext db) =>
        {
            var attributeDefinition = await db.AttributeDefinitions.FindAsync(id);
            return attributeDefinition is not null ? Results.Ok(attributeDefinition) : Results.NotFound();
        });
        
                // Mazání definice attributu
        app.MapDelete("/attributeDefinitions/{id}", async (int id, ApplicationDbContext db) =>
        {
            var attributeDefinition = await db.AttributeDefinitions.FindAsync(id);
            if (attributeDefinition is null) return Results.NotFound();
            db.AttributeDefinitions.Remove(attributeDefinition);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
    
}