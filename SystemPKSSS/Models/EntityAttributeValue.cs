public class EntityAttributeValue
{
    [Key]
    public int Id { get; set; }

    public int EntityId { get; set; }
    public Entity Entity { get; set; }

    public int AttributeDefinitionId { get; set; }
    public AttributeDefinition AttributeDefinition { get; set; }

    public string? ValueString { get; set; }
    public decimal? ValueNumber { get; set; }
    public DateTimeOffset? ValueDate { get; set; }
    public bool? ValueBoolean { get; set; }
    public int? ValueFileId { get; set; }
    public FileResource? ValueFile { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
