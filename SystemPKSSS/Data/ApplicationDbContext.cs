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
    public DbSet<EntityType> EntityTypes { get; set; }
    public DbSet<AttributeDefinition> AttributeDefinitions { get; set; }
    public DbSet<AttributeEnumValue> AttributeEnumValues { get; set; }
    public DbSet<EntityAttributeValue> EntityAttributeValues { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<EntityTagLink> EntityTagLinks { get; set; }
    public DbSet<FileResource> FileResources { get; set; }
    public DbSet<Note> Notes { get; set; }
    //public DbSet<User> Users { get; set; }
}