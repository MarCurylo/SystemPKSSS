using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Registrace slu�eb (DbContext, CORS, apod.)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Registrace statick�ch soubor� (HTML, CSS, JS)
builder.Services.AddRouting();

var app = builder.Build();

// 3. Middleware pro statick� soubory
app.UseDefaultFiles();  // slou�� pro / => index.html
app.UseStaticFiles();   // zp��stupn� wwwroot

// 4. Mapov�n� endpoint�
app.MapServicesEndpoints();

// 5. Start
app.Run();
