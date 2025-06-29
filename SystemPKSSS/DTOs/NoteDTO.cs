namespace SystemPKSSS.DTOs
{
    public class CreateNoteDto
    {
        public int EntityId { get; set; }
        public string Text { get; set; }
        public int? AuthorUserId { get; set; }
    }

    public class NoteDto
    {
        public int Id { get; set; }
        public int EntityId { get; set; }
        public string Text { get; set; }
        public int? AuthorUserId { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }  
    public DateTimeOffset? UpdatedAt { get; set; } 
    }

    public class UpdateNoteDto
    {
        public string Text { get; set; }
    }
}
