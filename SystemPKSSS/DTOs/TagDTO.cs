namespace SystemPKSSS.DTOs
{
    public class TagDto
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public string Description { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }

    public class CreateTagDto
    {
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public string Description { get; set; }
    }
}
