import type { Tag, CreateTag, EntityTagLink, CreateEntityTagLink } from "./tagsModel.js";

// Načtení všech tagů služby
export async function loadTagsByService(serviceId: number): Promise<Tag[]> {
  const response = await fetch(`/services/${serviceId}/tags`);
  if (!response.ok) throw new Error("Nepodařilo se načíst tagy.");
  return response.json();
}

// Vytvoření nového tagu ve službě
export async function createTag(serviceId: number, tag: CreateTag): Promise<Tag> {
  const response = await fetch(`/services/${serviceId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
  });
  if (!response.ok) throw new Error("Nelze vytvořit tag.");
  return response.json();
}

// Aktualizace tagu
export async function updateTag(serviceId: number, tagId: number, tag: CreateTag): Promise<void> {
  const response = await fetch(`/services/${serviceId}/tags/${tagId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
  });
  if (!response.ok) throw new Error("Nelze upravit tag.");
}

// Smazání tagu
export async function deleteTag(serviceId: number, tagId: number): Promise<void> {
  const response = await fetch(`/services/${serviceId}/tags/${tagId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Nelze smazat tag.");
}

// Načtení všech tagů přiřazených k entitě
export async function loadEntityTagLinks(serviceId: number, entityId: number): Promise<EntityTagLink[]> {
  const response = await fetch(`/services/${serviceId}/entities/${entityId}/tags`);
  if (!response.ok) throw new Error("Nepodařilo se načíst tagy entity.");
  return response.json();
}

// Přidání tagu k entitě
export async function addTagToEntity(serviceId: number, entityId: number, link: CreateEntityTagLink): Promise<EntityTagLink> {
  const response = await fetch(`/services/${serviceId}/entities/${entityId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(link),
  });
  if (!response.ok) throw new Error("Nelze přidat tag k entitě.");
  return response.json();
}

// Odebrání tagu z entity
export async function removeTagFromEntity(serviceId: number, entityId: number, linkId: number): Promise<void> {
  const response = await fetch(`/services/${serviceId}/entities/${entityId}/tags/${linkId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Nelze odebrat tag z entity.");
}
