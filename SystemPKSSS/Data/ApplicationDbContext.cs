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
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AttributeDefinition>()
                .Property(a => a.AttributeType)
                .HasConversion<string>();

            // Nastavení kaskádového mazání mezi Entity a EntityAttributeValue
            modelBuilder.Entity<EntityAttributeValue>()
                .HasOne(eav => eav.Entity)
                .WithMany(e => e.AttributeValues)
                .HasForeignKey(eav => eav.EntityId)
                .OnDelete(DeleteBehavior.Cascade);
        }

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
