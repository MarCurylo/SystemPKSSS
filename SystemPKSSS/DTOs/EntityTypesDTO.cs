namespace SystemPKSSS.DTOs
{
    public class CreateEntityTypeDto
    {
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public bool Visible { get; set; } = true;
        public bool Editable { get; set; } = true;
        public bool Exportable { get; set; } = true;
        public bool Auditable { get; set; } = false;
    }

    public class UpdateEntityTypeDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public bool Visible { get; set; }
        public bool Editable { get; set; }
        public bool Exportable { get; set; }
        public bool Auditable { get; set; }
    }

    public class EntityTypeDto
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public bool Visible { get; set; }
        public bool Editable { get; set; }
        public bool Exportable { get; set; }
        public bool Auditable { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }
}
