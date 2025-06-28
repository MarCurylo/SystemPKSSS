using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SystemPKSSS.Models;

namespace SystemPKSSS.Models
{
    public class EntityType
    {
        [Key]
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public Service? Service { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public bool Visible { get; set; }
        public bool Editable {  get; set; }
        public bool Exportable {  get; set; }
        public bool Auditable {  get; set; }
        public int orderIndex{ get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
