using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ?? nutné pro naètení appsettings.json manuálnì, pokud nemáš šablonu
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);


// 1. Registrace služeb (DbContext, CORS, apod.)


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
Console.WriteLine("?? Connection string:");
Console.WriteLine(builder.Configuration.GetConnectionString("DefaultConnection"));

// 2. Registrace statických souborù (HTML, CSS, JS)
builder.Services.AddRouting();

var app = builder.Build();

// 3. Middleware pro statické soubory
app.UseDefaultFiles();  // slouží pro / => index.html
app.UseStaticFiles();   // zpøístupní wwwroot

// 4. Mapování endpointù
app.MapServicesEndpoints();

// 5. Start
app.Run();
