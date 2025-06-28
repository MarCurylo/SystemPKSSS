namespace SystemPKSSS.DTOs
{
    // DTO pro vytvoření nové entity (input)
    public class CreateEntityDto
    {
        public int ServiceId { get; set; }
        public int EntityTypeId { get; set; }
        public List<CreateEntityAttributeValueDto> AttributeValues { get; set; } = new();
    }

    // DTO pro výpis entity (output)
    public class EntityDto
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public int EntityTypeId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public DateTimeOffset? DeletedAt { get; set; }
        public List<EntityAttributeValueDto> AttributeValues { get; set; } = new();
    }

    // DTO pro vytvoření hodnoty atributu (input)
    public class CreateEntityAttributeValueDto
    {
        public int AttributeDefinitionId { get; set; }
        public string? ValueString { get; set; }
        public decimal? ValueNumber { get; set; }
        public DateTimeOffset? ValueDate { get; set; }
        public bool? ValueBoolean { get; set; }
        public int? ValueFileId { get; set; }
    }

    // DTO pro výpis hodnoty atributu (output)
    public class EntityAttributeValueDto
    {
        public int Id { get; set; }
        public int AttributeDefinitionId { get; set; }
        public string? ValueString { get; set; }
        public decimal? ValueNumber { get; set; }
        public DateTimeOffset? ValueDate { get; set; }
        public bool? ValueBoolean { get; set; }
        public int? ValueFileId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }
}
