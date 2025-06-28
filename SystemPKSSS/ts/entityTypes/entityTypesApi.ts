import type { EntityType, NewEntityType, UpdateEntityType } from "./entityTypesModel.js";

// Načti všechny entity type pro danou službu
export async function loadEntityTypes(serviceId: number): Promise<EntityType[]> {
  const response = await fetch(`/services/${serviceId}/entityTypes`);
  if (!response.ok) throw new Error("Failed to fetch entity types");
  return await response.json();
}

// Detail jednoho typu entity podle ID
export async function loadEntityType(serviceId: number, entityTypeId: number): Promise<EntityType> {
  const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`);
  if (!response.ok) throw new Error("Failed to fetch entity type");
  return await response.json();
}

// Vytvoř nový typ entity
export async function createEntityType(serviceId: number, entityType: NewEntityType): Promise<EntityType> {
  const response = await fetch(`/services/${serviceId}/entityTypes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entityType),
  });
  if (!response.ok) throw new Error("Failed to create entity type");
  return await response.json();
}

// Edituj typ entity
export async function updateEntityType(
  serviceId: number,
  entityTypeId: number,
  entityType: UpdateEntityType
): Promise<EntityType> {
  const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entityType),
  });
  if (!response.ok) throw new Error("Failed to update entity type");
  return await response.json();
}

// Nastavení visibility (bonus)
export async function setEntityTypeVisibility(entityTypeId: number, visible: boolean): Promise<EntityType> {
  const response = await fetch(`/entityTypes/${entityTypeId}/visible?visible=${visible}`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error("Failed to set visibility");
  return await response.json();
}

// Smazání typu entity
export async function deleteEntityType(serviceId: number, entityTypeId: number): Promise<void> {
  const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete entity type");
}
