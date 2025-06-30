using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using SystemPKSSSS.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Načte nastavení včetně připojení k DB
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// DbContext – SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity nastavení (uživatelský systém)
builder.Services.AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthorization();

var app = builder.Build();

// Tady je nově HTTPS redirect!
app.UseHttpsRedirection();

await UserEndpoints.EnsureRolesAsync(app.Services);

app.UseAuthentication();
app.UseAuthorization();

// Registrace endpointů
app.MapServicesEndpoints();
app.MapEntityTypesEndpoints();
app.MapAttributeDefinitionsEndpoints();
app.MapEntityEndpoints();
app.MapNotesEndpoints();
app.MapTagsEndpoints();
UserEndpoints.MapUserEndpoints(app);

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
