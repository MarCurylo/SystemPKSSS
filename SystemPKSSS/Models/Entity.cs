using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SystemPKSSS.Models;

namespace SystemPKSSS.Models
{
    public class Entity
    {
        [Key]
        public int Id { get; set; }

        public int EntityTypeId { get; set; }

        public EntityType EntityType { get; set; }

        public int ServiceId { get; set; }

        public Service Service { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? DeletedAt { get; set; }

        public ICollection<EntityAttributeValue> AttributeValues { get; set; }
        public ICollection<EntityTagLink> TagLinks { get; set; }
        public ICollection<Note> Notes { get; set; }
    }
}
