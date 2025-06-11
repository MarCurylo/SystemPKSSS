import { EntityType, NewEntityType, UpdateEntityType } from "./entityTypesModel";
// Načti všechny druhy entit
export async function loadEntityTypes(): Promise<EntityType[]> {
    const response = await fetch("/entitytypes");
    if (!response.ok) {
        throw new Error("Failed to fetch entity types");
    }
    return await response.json();
}

// Načti všechny druhy entit ve sluzbe
export async function loadEntityTypesByService(serviceId: number): Promise<EntityType[]> {
    const response = await fetch(`/services/${serviceId}/entityTypes`);
    if (!response.ok) {
        throw new Error("Failed to fetch entity types for service");
    }
    return await response.json();
}

// Vytvoř novy druh entity ve sluzbe
export async function createEntityType(serviceId: number, entityType: NewEntityType): Promise<EntityType> {
    const response = await fetch(`/services/${serviceId}/entityTypes`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entityType)
    });

    if (!response.ok) {
        throw new Error("Failed to create entity type");
    }

    return await response.json();
}

// Update existující druh entity
export async function updateEntityType(serviceId: number, entityType: UpdateEntityType): Promise<EntityType> {
    if (!entityType.id) {
        throw new Error("EntityType ID is required for update");
    }

    const response = await fetch(`/services/${serviceId}/entityTypes/${entityType.id}`, { 
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entityType)
    });

    if (!response.ok) {
        throw new Error("Failed to update entity type");
    }

    return await response.json();
}

// Smazání druhu entity
export async function deleteEntityType(id: number): Promise<void> {
    const response = await fetch(`/entitytypes/${id}`, { method: "DELETE" });

    if (!response.ok) {
        throw new Error("Failed to delete entity type");
    }
}