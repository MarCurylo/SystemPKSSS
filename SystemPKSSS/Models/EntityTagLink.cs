using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SystemPKSSS.Models;

namespace SystemPKSSS.Models
{
public class EntityTagLink
{
    [Key]
    public int Id { get; set; }

    public int EntityId { get; set; }
    public Entity Entity { get; set; }

    public int TagId { get; set; }
    public Tag Tag { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
}
