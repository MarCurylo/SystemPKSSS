using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SystemPKSSS.Models;

namespace SystemPKSSS.Models
{
    public class EntityAttributeValue
    {
        [Key]
        public int Id { get; set; }

        public int EntityId { get; set; }

        public Entity Entity { get; set; }

        public int AttributeDefinitionId {  get; set; }
        public AttributeDefinition AttributeDefiniton { get; set; }

        public string ValueString { get; set; }
        public int ValueNumber {  get; set; }
        public DateTime ValueDate {  get; set; }
        public bool ValueBoolean {  get; set; }
        public int ValueFileId {  get; set; }
        public FileResource ValueFile {  get; set; }


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
