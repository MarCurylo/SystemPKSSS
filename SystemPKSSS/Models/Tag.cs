using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SystemPKSSS.Models;

namespace SystemPKSSS.Models
{
    public class Tag
    {
        [Key]
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public string Description { get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}