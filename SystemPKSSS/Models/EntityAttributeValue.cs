﻿using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using SystemPKSSS.Models;
public class EntityAttributeValue
{
    [Key]
    public int Id { get; set; }

    public int EntityId { get; set; }
    public Entity Entity { get; set; }

    public int AttributeDefinitionId { get; set; }
    public AttributeDefinition AttributeDefinition { get; set; }

    public string? ValueString { get; set; }
    public decimal? ValueNumber { get; set; }
    public DateTimeOffset? ValueDate { get; set; }
    public bool? ValueBoolean { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
