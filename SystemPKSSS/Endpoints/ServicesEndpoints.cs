using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;

namespace SystemPKSSSS.Endpoints;
public static class ServicesEndpoints
{
    public static void MapServicesEndpoints(this IEndpointRouteBuilder app)
    {
        // Vytvoření služby
        app.MapPost("/services", async (Service service, ApplicationDbContext db) =>
        {
            db.Services.Add(service);
            await db.SaveChangesAsync();
            return Results.Created($"/services/{service.Id}", service);
        });

        // Výpis všech služeb
        app.MapGet("/services", async (ApplicationDbContext db) =>
        {
            var services = await db.Services.ToListAsync();
            return Results.Ok(services);
        });

        // Detail služby
        app.MapGet("/services/{id}", async (int id, ApplicationDbContext db) =>
        {
            var service = await db.Services.FindAsync(id);
            return service is not null ? Results.Ok(service) : Results.NotFound();
        });

        // Editace služby
        app.MapPut("/services/{id}", async (int id, Service updatedService, ApplicationDbContext db) =>
        {
            var service = await db.Services.FindAsync(id);
            if (service is null) return Results.NotFound();

            service.Name = updatedService.Name;
            service.Description = updatedService.Description;
            service.IsActive = updatedService.IsActive;

            await db.SaveChangesAsync();
            return Results.Ok(service);
        });

        // Aktivace / deaktivace (samostatně)
        app.MapPut("/services/{id}/activate", async (int id, bool activate, ApplicationDbContext db) =>
        {
            var service = await db.Services.FindAsync(id);
            if (service is null) return Results.NotFound();

            service.IsActive = activate;
            await db.SaveChangesAsync();
            return Results.Ok(service);
        });

        // Mazání služby
        app.MapDelete("/services/{id}", async (int id, ApplicationDbContext db) =>
        {
            var service = await db.Services.FindAsync(id);
            if (service is null) return Results.NotFound();

            db.Services.Remove(service);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
