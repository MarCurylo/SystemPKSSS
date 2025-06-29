namespace SystemPKSSS.DTOs
{
    public class EntityTagLinkDto
    {
        public int Id { get; set; }
        public int EntityId { get; set; }
        public int TagId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }

    public class CreateEntityTagLinkDto
    {
        public int EntityId { get; set; }
        public int TagId { get; set; }
    }
}
