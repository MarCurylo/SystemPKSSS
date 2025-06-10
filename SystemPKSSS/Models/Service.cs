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
        public string Name { get; set; }
        public string Description { get; set; }
        public int IsActive {  get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
