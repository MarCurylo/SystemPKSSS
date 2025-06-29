import { Entity, EntityAttributeValue, CreateEntity } from "./entitiesModel.js";

// Načti všechny entity v dané službě a typu
export async function loadEntitiesByEntityType(serviceId: number, entityTypeId: number): Promise<Entity[]> {
    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/entities`);
    if (!response.ok) {
        // Vypiš text chyby (pravděpodobně HTML chybová stránka nebo JSON s popisem)
        const text = await response.text();
        console.error("Failed to fetch entities for entity type:", text);
        throw new Error(text);
    }
    return await response.json();
}

// Vytvoř novou entitu ve službě konkrétního typu
export async function createEntity(
    serviceId: number,
    entityTypeId: number,
    newEntity: CreateEntity
): Promise<Entity> {
    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/entities`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntity)
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("Failed to create entity:", text);
        throw new Error(text);
    }

    return await response.json();
}

// Načti detail jedné entity
export async function loadEntityDetail(serviceId: number, entityTypeId: number, entityId: number): Promise<Entity> {
    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/entities/${entityId}`);
    if (!response.ok) {
        const text = await response.text();
        console.error("Failed to fetch entity:", text);
        throw new Error(text);
    }
    return await response.json();
}

export async function updateEntity(
    serviceId: number,
    entityTypeId: number,
    entityId: number,
    updatedEntity: CreateEntity // stejné jako při vytváření: { attributeValues: EntityAttributeValue[] }
): Promise<Entity> {
    const response = await fetch(
        `/services/${serviceId}/entityTypes/${entityTypeId}/entities/${entityId}`,
        {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEntity)
        }
    );

    if (!response.ok) {
        const text = await response.text();
        console.error("Failed to update entity:", text);
        throw new Error(text);
    }

    return await response.json();
}