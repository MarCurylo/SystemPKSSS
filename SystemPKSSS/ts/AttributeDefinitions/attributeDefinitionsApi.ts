import { AttributeDefinition, NewAttributeDefinition } from "./attributeDefinitionsModel";
import { AttributeEnumValue } from "../AttributeDefinitionEnumValues/attributeEnumValuesModel";

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
    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAttributeDefinition)
    });

    if (!response.ok) {
        throw new Error("Failed to create attribute definition");
    }

    return await response.json();
}

//Vytvoř enum moznosti pro konkretni definici attributu
export async function createAttributeDefinitionEnum(serviceId: number, entityTypeId: number, attributeDefinitionId: number, attributeEnumValue: AttributeEnumValue): Promise<AttributeEnumValue> {
    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/attributeDefinitions/${attributeDefinitionId}/attributeEnumValue`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attributeEnumValue)
    });

    if (!response.ok) {
        throw new Error("Failed to create attribute definition enum");
    }

    return await response.json();
}

// //nacti detail daneho typu entity
// export async function loadEntityTypeDetail(serviceId: number, entityTypeId: number): Promise<EntityType> {
//     const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`);
//     if (!response.ok) {
//         throw new Error("Failed to fetch entity type");
//     }
//     return await response.json();
// }