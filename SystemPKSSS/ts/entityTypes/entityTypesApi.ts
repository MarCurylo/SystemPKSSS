import { EntityType } from "./entityTypesModel";

// Načti všechny entity ve sluzbe
export async function loadEntityTypesByService(serviceId: number): Promise<EntityType[]> {
    const response = await fetch(`/services/${serviceId}/entityTypes`);
    if (!response.ok) {
        throw new Error("Failed to fetch entitytypes");
    }
    return await response.json();
}
