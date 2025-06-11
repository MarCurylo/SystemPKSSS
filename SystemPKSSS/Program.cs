using Microsoft.EntityFrameworkCore;
using SystemPKSSSS.Data;        // namespace s ApplicationDbContext
using SystemPKSSSS.Endpoints;   // namespace s MapServicesEndpoints()

var builder = WebApplication.CreateBuilder(args);
// 🔧 1. Načtení konfigurace ze souboru
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// 🔧 2. Registrace služeb
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("LocalDbConnection")));

// ✅ 3. Vytvoření aplikace
var app = builder.Build();

// 🛠 4. Výpis výjimek do konzole pro debug
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        Console.WriteLine("💥 CHYBA: " + ex.ToString());
        throw;
    }
});

// 🌐 5. Middleware pro frontend (HTML, JS, CSS)
app.UseDefaultFiles(); // hledá index.html automaticky
app.UseStaticFiles();  // slouží /wwwroot

// 🌐 6. API endpointy
app.MapServicesEndpoints();
// app.MapEntitiesEndpoints(); // další můžeš přidat postupně

// 🚀 7. Start serveru
app.Run();
