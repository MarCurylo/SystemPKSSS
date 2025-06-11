using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;

namespace SystemPKSSSS.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Service> Services { get; set; }
    public DbSet<Entity> Entities { get; set; }
}