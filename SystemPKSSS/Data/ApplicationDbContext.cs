using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SystemPKSSS.Models;

namespace SystemPKSSSS.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // velmi důležité, musí být na začátku

            modelBuilder.Entity<AttributeDefinition>()
                .Property(a => a.AttributeType)
                .HasConversion<string>();

            // Pokud budeš chtít další konfigurace, přidej zde
        }

        // DbSety pro tvoje vlastní entity
        public DbSet<Service> Services { get; set; }
        public DbSet<Entity> Entities { get; set; }
        public DbSet<EntityType> EntityTypes { get; set; }
        public DbSet<AttributeDefinition> AttributeDefinitions { get; set; }
        public DbSet<AttributeEnumValue> AttributeEnumValues { get; set; }
        public DbSet<EntityAttributeValue> EntityAttributeValues { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<EntityTagLink> EntityTagLinks { get; set; }
        public DbSet<Note> Notes { get; set; }
    }
}
