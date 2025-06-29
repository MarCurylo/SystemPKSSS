

export interface EntityTagLinkDto {
  id: number;
  entityId: number;
  tagId: number;
  createdAt: string;
}

export interface CreateEntityTagLinkDto {
  entityId: number;
  tagId: number;
}

// Načtení tagů přiřazených k entitě
export async function loadEntityTags(serviceId: number, entityId: number): Promise<EntityTagLinkDto[]> {
  const res = await fetch(`/services/${serviceId}/entities/${entityId}/tags`);
  if (!res.ok) throw new Error("Nelze načíst tagy entity");
  return res.json();
}

// Přidání tagu k entitě
export async function createEntityTagLink(serviceId: number, entityId: number, dto: CreateEntityTagLinkDto): Promise<EntityTagLinkDto> {
  const res = await fetch(`/services/${serviceId}/entities/${entityId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Nelze přidat tag");
  return res.json();
}

// Odebrání tagu z entity
export async function deleteEntityTagLink(serviceId: number, entityId: number, linkId: number): Promise<void> {
  const res = await fetch(`/services/${serviceId}/entities/${entityId}/tags/${linkId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Nelze smazat tag");
}
