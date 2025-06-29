using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SystemPKSSS.Models;

namespace SystemPKSSS.Models
{
    public class Note
    {
        [Key]
        public int Id { get; set; }

        public int EntityId { get; set; }
        public Entity Entity { get; set; }

        public int? AuthorUserId { get; set; }
        // public User User { get; set; }

        public string Text { get; set; }

public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
public DateTimeOffset? UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

        // public Service Service { get; set; }   // není třeba v Note, pokud není přímá vazba!
    }
}
