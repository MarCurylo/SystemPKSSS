using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using SystemPKSSS.Models;

public static class UserEndpoints
{
    public static void MapUserEndpoints(WebApplication app)
    {
        // Přihlášení
        app.MapPost("/api/login", async ([FromBody] LoginRequest req, SignInManager<ApplicationUser> signInManager) =>
        {
            Console.WriteLine("Pokus o login: " + req.username + " | " + req.password);
            var result = await signInManager.PasswordSignInAsync(req.username, req.password, true, false);
            if (result.Succeeded)
                return Results.Ok();
            Console.WriteLine("Výsledek: " + result.ToString());
            return Results.Unauthorized();
        });

        // Výpis vlastního profilu a rolí
        app.MapGet("/api/users/me", [Authorize] async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user) =>
        {
            var currentUser = await userManager.GetUserAsync(user);
            if (currentUser == null) return Results.Unauthorized();
            var roles = await userManager.GetRolesAsync(currentUser);
            return Results.Ok(new { currentUser.UserName, currentUser.Email, Roles = roles });
        });

        // Výpis všech uživatelů (jen pro admina) – s rolemi!
        app.MapGet("/api/users", [Authorize(Roles = "Admin")] async (UserManager<ApplicationUser> userManager) =>
        {
            var users = await userManager.Users.ToListAsync();
            var result = new List<object>();

            foreach (var u in users)
            {
                var roles = await userManager.GetRolesAsync(u);
                result.Add(new
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    Role = roles.FirstOrDefault() ?? "Uživatel"
                });
            }
            return Results.Ok(result);
        });

        // Registrace uživatele (každý se může registrovat)
        app.MapPost("/api/users", async (
            [FromBody] CreateUserRequest req,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole<int>> roleManager) =>
        {
            Console.WriteLine("Registrace: " + System.Text.Json.JsonSerializer.Serialize(req));
            if (!await roleManager.RoleExistsAsync(req.role))
                return Results.BadRequest(new { message = "Role neexistuje!" });

            var user = new ApplicationUser { UserName = req.username, Email = req.email, EmailConfirmed = true };
            var result = await userManager.CreateAsync(user, req.password);
            if (!result.Succeeded)
                return Results.BadRequest(new { message = "Chyba vytvoření uživatele", errors = result.Errors });

            await userManager.AddToRoleAsync(user, req.role);
            return Results.Ok(new { user.Id, user.UserName, Role = req.role });
        });

        // Smazání uživatele (jen admin)
        app.MapDelete("/api/users/{id}", [Authorize(Roles = "Admin")] async (
            int id,
            UserManager<ApplicationUser> userManager
        ) =>
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user == null) return Results.NotFound();
            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return Results.BadRequest(result.Errors);
            return Results.Ok();
        });

        // Změna role uživatele (jen admin)
        app.MapPost("/api/users/{id}/role", [Authorize(Roles = "Admin")] async (
            int id,
            [FromBody] ChangeRoleRequest req,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole<int>> roleManager
        ) =>
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user == null) return Results.NotFound();

            var roles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, roles);

            if (!await roleManager.RoleExistsAsync(req.Role))
                return Results.BadRequest(new { message = "Role neexistuje!" });

            await userManager.AddToRoleAsync(user, req.Role);
            return Results.Ok();
        });

        // Odhlášení
        app.MapPost("/api/logout", async (SignInManager<ApplicationUser> signInManager) =>
        {
            await signInManager.SignOutAsync();
            return Results.Ok();
        });
        app.MapGet("/api/users/admin-exists", async (UserManager<ApplicationUser> userManager) =>
{
    var admins = await userManager.GetUsersInRoleAsync("Admin");
    return Results.Ok(new { exists = admins.Any() });
});

    }

    // Inicializace rolí (zavolat při startu)
    public static async Task EnsureRolesAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        foreach (var roleName in new[] { "Admin", "Uživatel" })
            if (!await roleManager.RoleExistsAsync(roleName))
                await roleManager.CreateAsync(new IdentityRole<int>(roleName));
    }
}
