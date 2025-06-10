using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SystemPKSSS.Models;

namespace SystemPKSSS.Models
{
    public class AttributeEnumValue
    {
        [Key]
        public int Id { get; set; }

        public int AttributeDefinitionId { get; set; }
        public AttributeDefinition AttributeDefinition { get; set; }
        public string Value { get; set; }
        public int DisplayOrder {  get; set; }
    }
}
