using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using SystemPKSSS.Models;

namespace SystemPKSSS.Models;
public enum AttributeDataType
{
    [Description("Text")]
    String,
    [Description("Číslo")]
    Number,
    [Description("Datum")]
    Date,
    [Description("Ano/Ne")]
    Boolean,
    [Description("Výběr z možností")]
    Enum,
    [Description("Obrázek")]
    Image
}


public class AttributeDefinition
{
    
    [Key]
    public int Id { get; set; }

    public int EntityTypeId { get; set; }

    public EntityType EntityType { get; set; }

    public string Name { get; set; }
    public string DisplayName { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public AttributeDataType AttributeType { get; set; }
    public bool IsRequired { get; set; }
    public int OrderIndex { get; set; }
        public bool IsDisplayName { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<AttributeEnumValue> EnumValues { get; set; } = new List<AttributeEnumValue>();

    }

