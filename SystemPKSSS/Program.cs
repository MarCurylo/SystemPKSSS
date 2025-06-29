using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;
using SystemPKSSSS.Data;
using SystemPKSSSS.Endpoints; // <- přidej, pokud máš UserEndpoints.cs

var builder = WebApplication.CreateBuilder(args);

// Načtení konfigurace ze souboru
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Přidání DbContext s Identity
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Přidání Identity s generickými typy (ApplicationUser, IdentityRole<int>, int)
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

// *** TUTO ČÁST ODSTRAŇ! ***
// builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
//     .AddIdentityCookies();

// Autorizace stačí takto:
builder.Services.AddAuthorization();

var app = builder.Build();

// Inicializace rolí (volá se při spuštění aplikace, vytvoří role pokud chybí)
await UserEndpoints.EnsureRolesAsync(app.Services);

// Middleware pro autentizaci a autorizaci
app.UseAuthentication();
app.UseAuthorization();

// Registrace vlastních endpointů (doménové věci)
app.MapServicesEndpoints();
app.MapEntityTypesEndpoints();
app.MapAttributeDefinitionsEndpoints();
app.MapEntityEndpoints();
app.MapNotesEndpoints();
app.MapTagsEndpoints();

// Registrace endpointů pro identity (uživatelská správa, login atd.)
UserEndpoints.MapUserEndpoints(app);

// Statické soubory pro frontend
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

// Spuštění aplikace
app.Run();
