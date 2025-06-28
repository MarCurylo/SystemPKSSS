namespace SystemPKSSS.DTOs
{
    public class CreateServiceDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateServiceDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }

    public class ServiceDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }
}
