export interface EntityType {
  id: number;
  serviceId: number;
  name: string;
  description?: string;
  createdAt: string;
}

// Načtení entity types pro konkrétní službu
export async function loadEntityTypesByService(serviceId: number): Promise<EntityType[]> {
    const response = await fetch(`/services/${serviceId}/entityTypes`);
    if (!response.ok) {
        throw new Error("Failed to fetch entity types");
    }
    return await response.json();
}

// Přidání entity type do konkrétní služby
export async function createEntityTypeForService(serviceId: number, name: string): Promise<EntityType> {
    const entityType = { name, serviceId };

    const response = await fetch("/entityTypes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entityType)
    });

    if (!response.ok) {
        throw new Error("Failed to create entity type");
    }
    return await response.json();
}
