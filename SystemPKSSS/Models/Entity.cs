using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemPKSSS.Models
{
    public class Entity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int EntityTypeId { get; set; }

        [ForeignKey(nameof(EntityTypeId))]
        public EntityType EntityType { get; set; }

        [Required]
        public int ServiceId { get; set; }

        [ForeignKey(nameof(ServiceId))]
        public Service Service { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? DeletedAt { get; set; }

        public ICollection<EntityAttributeValue> AttributeValues { get; set; }
        public ICollection<EntityTagLink> TagLinks { get; set; }
        public ICollection<Note> Notes { get; set; }
    }
}
