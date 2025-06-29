import { AttributeDefinition, NewAttributeDefinition } from "./attributeDefinitionsModel.js";

// Načti všechny definice atributu v danem entity typu
export async function loadAttributeDefinitionsByEntityType(serviceId: number, entityTypeId: number): Promise<AttributeDefinition[]> {
    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/attributeDefinitions`);
    if (!response.ok) {
        throw new Error("Failed to fetch attribute definitions for entity type");
    }
    return await response.json();
}

// Vytvoř novy attribute definition v typu entity
export async function createAttributeDefinition(serviceId: number, entityTypeId: number, newAttributeDefinition: NewAttributeDefinition): Promise<AttributeDefinition> {
    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/attributeDefinitions`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAttributeDefinition)
    });

    if (!response.ok) {
        throw new Error("Failed to create attribute definition");
    }

    return await response.json();
}
// Smaž attribute definition v daném entity typu
export async function deleteAttributeDefinition(
    serviceId: number,
    entityTypeId: number,
    attributeDefinitionId: number
): Promise<void> {
    const response = await fetch(
        `/services/${serviceId}/entityTypes/${entityTypeId}/attributeDefinitions/${attributeDefinitionId}`,
        {
            method: "DELETE"
        }
    );
    if (!response.ok) {
        throw new Error("Failed to delete attribute definition");
    }
}

// PATCH endpoint pro nastavení isDisplayName (je-li v backendu)
export async function patchIsDisplayName(
    serviceId: number,
    entityTypeId: number,
    attributeDefinitionId: number,
    isDisplayName: boolean
): Promise<void> {
    const response = await fetch(
        `/services/${serviceId}/entityTypes/${entityTypeId}/attributeDefinitions/${attributeDefinitionId}`,
        {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDisplayName })
        }
    );
    if (!response.ok) {
        throw new Error("Failed to update display as name");
    }
}
