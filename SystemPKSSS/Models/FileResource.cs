using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SystemPKSSS.Models;

namespace SystemPKSSS.Models
{
    public class FileResource
    {
        [Key]
        public int Id { get; set; }

        public string OriginalFileName { get; set; }
        public string FileType {  get; set; }
        public int  FileSize {  get; set; }
        public string StoragePath { get; set; }
        public int UploadedBy { get; set; }
        //public User User {  get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public string Description { get; set; }


        public ICollection<EntityAttributeValue> AttributeValues { get; set; }
        public ICollection<EntityTagLink> TagLinks { get; set; }
        public ICollection<Note> Notes { get; set; }
    }
}
