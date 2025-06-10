using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ?? nutn� pro na�ten� appsettings.json manu�ln�, pokud nem� �ablonu
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);


// 1. Registrace slu�eb (DbContext, CORS, apod.)


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
Console.WriteLine("?? Connection string:");
Console.WriteLine(builder.Configuration.GetConnectionString("DefaultConnection"));

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
