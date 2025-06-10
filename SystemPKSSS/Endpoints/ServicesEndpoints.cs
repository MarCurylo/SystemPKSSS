using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;

public static class ServicesEndpoints
{
    public static void MapServicesEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/services", async (Service service, ApplicationDbContext db) =>
        {
            db.Services.Add(service);
            await db.SaveChangesAsync();

            return Results.Created($"/services/{service.Id}", service);
        });

        app.MapGet("/services", async (ApplicationDbContext db) =>
        {
            var services = await db.Services.ToListAsync();
            return Results.Ok(services);
        });

        app.MapGet("/services/{id}", async (int id, ApplicationDbContext db) =>
        {
            var service = await db.Services.FindAsync(id);
            return service is not null ? Results.Ok(service) : Results.NotFound();
        });
    }
}
