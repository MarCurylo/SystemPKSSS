using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Service> Services { get; set; }
    public DbSet<Entity> Entities { get; set; }
}