using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using SystemPKSSS.Models;
public class Entity
{
    [Key]
    public int Id { get; set; }

    public int EntityTypeId { get; set; }
    public SystemPKSSS.Models.EntityType EntityType { get; set; }

    public int ServiceId { get; set; }
    public Service Service { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }

    public ICollection<EntityAttributeValue> AttributeValues { get; set; } = new List<EntityAttributeValue>();
    public ICollection<EntityTagLink> TagLinks { get; set; } = new List<EntityTagLink>();
    public ICollection<Note> Notes { get; set; } = new List<Note>();
}
