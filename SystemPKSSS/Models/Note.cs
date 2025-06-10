using Microsoft.EntityFrameworkCore.Metadata.Internal;
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

        public int AuthorUserId { get; set; }
        //public User User { get; set; }

        public Service Service { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
