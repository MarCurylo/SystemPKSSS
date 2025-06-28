import { Entity } from "./entitiesModel";

// Načti všechny entity v dane sluzbe, jendoho typu
export async function loadEntitiesByEntityType(serviceId: number, entityTypeId: number): Promise<Entity[]> {
    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/entities`);
    if (!response.ok) {
        throw new Error("Failed to fetch entities for entity type");
    }
    return await response.json();
}

// Vytvoř novou entity ve sluzbe konkretniho typu
export async function createEntity(serviceId: number, entityTypeId: number, newEntity: Entity): Promise<Entity> {
    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/entities`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntity)
    });

    if (!response.ok) {
        throw new Error("Failed to entity");
    }

    return await response.json();
}

//nacti detail dane entity
export async function loadEntityDetail(serviceId: number, entityTypeId: number, entityId: number): Promise<Entity> {
    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/entities/${entityId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch entity");
    }
    return await response.json();
}