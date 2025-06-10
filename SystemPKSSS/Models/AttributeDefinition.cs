using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SystemPKSSS.Models;

namespace SystemPKSSS.Models
{
    public class AttributeDefinition
    {
        [Key]
        public int Id { get; set; }

        public int EntityTypeId { get; set; }

        public EntityType EntityType { get; set; }

        public string Name {  get; set; }
        public string DisplayName {  get; set; }
        public string AttributeType { get; set; }
        public bool IsRequired { get; set; }
        public int OrderIndex {  get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
