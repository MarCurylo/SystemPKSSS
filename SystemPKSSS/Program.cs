using Microsoft.EntityFrameworkCore;
using SystemPKSSSS.Data;        // namespace s ApplicationDbContext
using SystemPKSSSS.Endpoints;   // namespace s MapServicesEndpoints()

var builder = WebApplication.CreateBuilder(args);
//Načtení konfigurace ze souboru
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Databaze
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Vytvoření aplikace
var app = builder.Build();

//Frontend 
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

//endpointy
app.MapServicesEndpoints();
app.MapEntityTypesEndpoints();
app.MapAttributeDefinitionsEndpoints();
app.MapEntityEndpoints();

//Start
  app.Run();
