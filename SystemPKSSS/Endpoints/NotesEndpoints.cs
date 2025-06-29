using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using SystemPKSSS.DTOs;

namespace SystemPKSSSS.Endpoints;

public static class NotesEndpoints
{
    public static void MapNotesEndpoints(this IEndpointRouteBuilder app)
    {
        // Přidání nové poznámky k entitě
        app.MapPost("/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}/notes",
            async (int serviceId, int entityTypeId, int entityId, CreateNoteDto dto, ApplicationDbContext db) =>
            {
                var entity = await db.Entities
                    .Include(e => e.EntityType)
                    .FirstOrDefaultAsync(e => e.Id == entityId && e.EntityTypeId == entityTypeId && e.ServiceId == serviceId);

                if (entity == null)
                    return Results.BadRequest("Entity does not exist.");

                if (entity.EntityType == null || !entity.EntityType.Auditable)
                    return Results.BadRequest("Tento typ entity neumožňuje poznámky.");

                var note = new Note
                {
                    EntityId = entityId,
                    Text = dto.Text,
                    AuthorUserId = dto.AuthorUserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                db.Notes.Add(note);
                await db.SaveChangesAsync();

                var result = new NoteDto
                {
                    Id = note.Id,
                    EntityId = note.EntityId,
                    Text = note.Text,
                    AuthorUserId = note.AuthorUserId,
                    CreatedAt = note.CreatedAt,
                    UpdatedAt = note.UpdatedAt
                };

                return Results.Created($"/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}/notes/{note.Id}", result);
            });

        // Výpis všech poznámek k entitě
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}/notes",
            async (int serviceId, int entityTypeId, int entityId, ApplicationDbContext db) =>
            {
                var entity = await db.Entities
                    .Include(e => e.EntityType)
                    .FirstOrDefaultAsync(e => e.Id == entityId && e.EntityTypeId == entityTypeId && e.ServiceId == serviceId);

                if (entity == null)
                    return Results.NotFound("Entity does not exist.");

                if (entity.EntityType == null || !entity.EntityType.Auditable)
                    return Results.BadRequest("Tento typ entity neumožňuje poznámky.");

                var notes = await db.Notes
                    .Where(n => n.EntityId == entityId)
                    .OrderByDescending(n => n.CreatedAt)
                    .Select(n => new NoteDto
                    {
                        Id = n.Id,
                        EntityId = n.EntityId,
                        Text = n.Text,
                        AuthorUserId = n.AuthorUserId,
                        CreatedAt = n.CreatedAt,
                        UpdatedAt = n.UpdatedAt
                    })
                    .ToListAsync();

                return Results.Ok(notes);
            });

        // Detail poznámky
        app.MapGet("/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}/notes/{noteId}",
            async (int serviceId, int entityTypeId, int entityId, int noteId, ApplicationDbContext db) =>
            {
                var entity = await db.Entities
                    .Include(e => e.EntityType)
                    .FirstOrDefaultAsync(e => e.Id == entityId && e.EntityTypeId == entityTypeId && e.ServiceId == serviceId);

                if (entity == null)
                    return Results.NotFound("Entity does not exist.");

                if (entity.EntityType == null || !entity.EntityType.Auditable)
                    return Results.BadRequest("Tento typ entity neumožňuje poznámky.");

                var note = await db.Notes
                    .Where(n => n.EntityId == entityId && n.Id == noteId)
                    .Select(n => new NoteDto
                    {
                        Id = n.Id,
                        EntityId = n.EntityId,
                        Text = n.Text,
                        AuthorUserId = n.AuthorUserId,
                        CreatedAt = n.CreatedAt,
                        UpdatedAt = n.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                return note != null ? Results.Ok(note) : Results.NotFound();
            });

        // Úprava poznámky
        app.MapPut("/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}/notes/{noteId}",
            async (int serviceId, int entityTypeId, int entityId, int noteId, UpdateNoteDto dto, ApplicationDbContext db) =>
            {
                var entity = await db.Entities
                    .Include(e => e.EntityType)
                    .FirstOrDefaultAsync(e => e.Id == entityId && e.EntityTypeId == entityTypeId && e.ServiceId == serviceId);

                if (entity == null)
                    return Results.NotFound("Entity does not exist.");

                if (entity.EntityType == null || !entity.EntityType.Auditable)
                    return Results.BadRequest("Tento typ entity neumožňuje poznámky.");

                var note = await db.Notes
                    .FirstOrDefaultAsync(n => n.EntityId == entityId && n.Id == noteId);
                if (note == null)
                    return Results.NotFound();

                note.Text = dto.Text;
                note.UpdatedAt = DateTime.UtcNow;
                await db.SaveChangesAsync();

                return Results.NoContent();
            });

        // Smazání poznámky
        app.MapDelete("/services/{serviceId}/entityTypes/{entityTypeId}/entities/{entityId}/notes/{noteId}",
            async (int serviceId, int entityTypeId, int entityId, int noteId, ApplicationDbContext db) =>
            {
                var entity = await db.Entities
                    .Include(e => e.EntityType)
                    .FirstOrDefaultAsync(e => e.Id == entityId && e.EntityTypeId == entityTypeId && e.ServiceId == serviceId);

                if (entity == null)
                    return Results.NotFound("Entity does not exist.");

                if (entity.EntityType == null || !entity.EntityType.Auditable)
                    return Results.BadRequest("Tento typ entity neumožňuje poznámky.");

                var note = await db.Notes
                    .FirstOrDefaultAsync(n => n.EntityId == entityId && n.Id == noteId);
                if (note == null)
                    return Results.NotFound();

                db.Notes.Remove(note);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
    }
}
