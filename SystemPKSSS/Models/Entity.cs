public class Entity
{
    [Key]
    public int Id { get; set; }

    public int EntityTypeId { get; set; }
    public EntityType EntityType { get; set; }

    public int ServiceId { get; set; }
    public Service Service { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }

    public ICollection<EntityAttributeValue> AttributeValues { get; set; } = new List<EntityAttributeValue>();
    public ICollection<EntityTagLink> TagLinks { get; set; } = new List<EntityTagLink>();
    public ICollection<Note> Notes { get; set; } = new List<Note>();
}
