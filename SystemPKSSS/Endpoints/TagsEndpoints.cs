using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using SystemPKSSS.DTOs;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using Microsoft.AspNetCore.Authorization;

namespace SystemPKSSSS.Endpoints;

public static class TagsEndpoints
{
    public static void MapTagsEndpoints(this IEndpointRouteBuilder app)
    {
        // Seznam tagů podle služby
        app.MapGet("/services/{serviceId}/tags", async (int serviceId, ApplicationDbContext db) =>
        {
            var tags = await db.Tags
                .Where(t => t.ServiceId == serviceId)
                .Select(t => new TagDto
                {
                    Id = t.Id,
                    ServiceId = t.ServiceId,
                    Name = t.Name,
                    Color = t.Color,
                    Description = t.Description,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return Results.Ok(tags);
        });

        // Detail tagu
        app.MapGet("/services/{serviceId}/tags/{tagId}", async (int serviceId, int tagId, ApplicationDbContext db) =>
        {
            var tag = await db.Tags
                .Where(t => t.ServiceId == serviceId && t.Id == tagId)
                .Select(t => new TagDto
                {
                    Id = t.Id,
                    ServiceId = t.ServiceId,
                    Name = t.Name,
                    Color = t.Color,
                    Description = t.Description,
                    CreatedAt = t.CreatedAt
                })
                .FirstOrDefaultAsync();

            return tag != null ? Results.Ok(tag) : Results.NotFound();
        });

        // Vytvoření tagu
        app.MapPost("/services/{serviceId}/tags", [Authorize(Roles = "Admin")] async (int serviceId, CreateTagDto dto, ApplicationDbContext db) =>
        {
            var tag = new Tag
            {
                ServiceId = serviceId,
                Name = dto.Name,
                Color = dto.Color,
                Description = dto.Description,
                CreatedAt = DateTimeOffset.UtcNow
            };

            db.Tags.Add(tag);
            await db.SaveChangesAsync();

            var result = new TagDto
            {
                Id = tag.Id,
                ServiceId = tag.ServiceId,
                Name = tag.Name,
                Color = tag.Color,
                Description = tag.Description,
                CreatedAt = tag.CreatedAt
            };

            return Results.Created($"/services/{serviceId}/tags/{tag.Id}", result);
        });

        // Aktualizace tagu
        app.MapPut("/services/{serviceId}/tags/{tagId}", [Authorize(Roles = "Admin")] async (int serviceId, int tagId, CreateTagDto dto, ApplicationDbContext db) =>
        {
            var tag = await db.Tags.FirstOrDefaultAsync(t => t.Id == tagId && t.ServiceId == serviceId);
            if (tag == null)
                return Results.NotFound();

            tag.Name = dto.Name;
            tag.Color = dto.Color;
            tag.Description = dto.Description;

            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        // Smazání tagu
        app.MapDelete("/services/{serviceId}/tags/{tagId}", [Authorize(Roles = "Admin")] async (int serviceId, int tagId, ApplicationDbContext db) =>
        {
            var tag = await db.Tags.FirstOrDefaultAsync(t => t.Id == tagId && t.ServiceId == serviceId);
            if (tag == null)
                return Results.NotFound();

            db.Tags.Remove(tag);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        // Seznam propojení entity a tagů
        app.MapGet("/services/{serviceId}/entities/{entityId}/tags", [Authorize(Roles = "Admin")] async (int serviceId, int entityId, ApplicationDbContext db) =>
        {
            // Kontrola existence entity patřící do služby
            var entityExists = await db.Entities.AnyAsync(e => e.Id == entityId && e.ServiceId == serviceId);
            if (!entityExists)
                return Results.NotFound("Entity does not exist in the specified service.");

            var links = await db.EntityTagLinks
                .Where(etl => etl.EntityId == entityId)
                .Select(etl => new EntityTagLinkDto
                {
                    Id = etl.Id,
                    EntityId = etl.EntityId,
                    TagId = etl.TagId,
                    CreatedAt = etl.CreatedAt
                })
                .ToListAsync();

            return Results.Ok(links);
        });

        // Přidání tagu k entitě
        app.MapPost("/services/{serviceId}/entities/{entityId}/tags", [Authorize(Roles = "Admin")] async (int serviceId, int entityId, CreateEntityTagLinkDto dto, ApplicationDbContext db) =>
        {
            if (entityId != dto.EntityId)
                return Results.BadRequest("Entity ID mismatch.");

            // Kontrola existence entity a tagu v dané službě
            var entityExists = await db.Entities.AnyAsync(e => e.Id == entityId && e.ServiceId == serviceId);
            var tagExists = await db.Tags.AnyAsync(t => t.Id == dto.TagId && t.ServiceId == serviceId);

            if (!entityExists || !tagExists)
                return Results.BadRequest("Entity or Tag does not exist in the specified service.");

            var link = new EntityTagLink
            {
                EntityId = dto.EntityId,
                TagId = dto.TagId,
                CreatedAt = DateTimeOffset.UtcNow
            };

            db.EntityTagLinks.Add(link);
            await db.SaveChangesAsync();

            var result = new EntityTagLinkDto
            {
                Id = link.Id,
                EntityId = link.EntityId,
                TagId = link.TagId,
                CreatedAt = link.CreatedAt
            };

            return Results.Created($"/services/{serviceId}/entities/{entityId}/tags/{link.Id}", result);
        });

        // Smazání propojení entity a tagu
        app.MapDelete("/services/{serviceId}/entities/{entityId}/tags/{linkId}", [Authorize(Roles = "Admin")] async (int serviceId, int entityId, int linkId, ApplicationDbContext db) =>
        {
            var link = await db.EntityTagLinks.FirstOrDefaultAsync(etl => etl.Id == linkId && etl.EntityId == entityId);
            if (link == null)
                return Results.NotFound();

            // Kontrola, zda entita patří do služby
            var entityExists = await db.Entities.AnyAsync(e => e.Id == entityId && e.ServiceId == serviceId);
            if (!entityExists)
                return Results.BadRequest("Entity does not exist in the specified service.");

            db.EntityTagLinks.Remove(link);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}
