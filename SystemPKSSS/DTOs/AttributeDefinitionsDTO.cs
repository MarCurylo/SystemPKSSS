namespace SystemPKSSS.DTOs
{
    public class CreateAttributeDefinitionDto
    {
        public int EntityTypeId { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string AttributeType { get; set; } 
        public bool IsRequired { get; set; }
        public int OrderIndex { get; set; }
        public bool IsDisplayName { get; set; } 
    }

    public class UpdateAttributeDefinitionDto
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string AttributeType { get; set; } 
        public bool IsRequired { get; set; }
        public int OrderIndex { get; set; }
        public bool IsDisplayName { get; set; } 
    }

    public class AttributeDefinitionDto
    {
        public int Id { get; set; }
        public int EntityTypeId { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string AttributeType { get; set; } 
        public bool IsRequired { get; set; }
        public int OrderIndex { get; set; }
        public bool IsDisplayName { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public List<AttributeEnumValueDto>? EnumValues { get; set; }
    }
    public class PatchIsDisplayNameDto
{
    public bool IsDisplayName { get; set; }
}


    public class AttributeEnumValueDto
    {
        public int Id { get; set; }
        public int AttributeDefinitionId { get; set; }
        public string Value { get; set; }
        public int DisplayOrder { get; set; }
    }
}
