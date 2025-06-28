var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Načti všechny definice atributu v danem entity typu
export function loadAttributeDefinitionsByEntityType(serviceId, entityTypeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/attributeDefinitions`);
        if (!response.ok) {
            throw new Error("Failed to fetch attribute definitions for entity type");
        }
        return yield response.json();
    });
}
// Vytvoř novy attribute definition v typu entity
export function createAttributeDefinition(serviceId, entityTypeId, newAttributeDefinition) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/attributeDefinitions`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAttributeDefinition)
        });
        if (!response.ok) {
            throw new Error("Failed to create attribute definition");
        }
        return yield response.json();
    });
}
//Vytvoř enum moznosti pro konkretni definici attributu
//export async function createAttributeDefinitionEnum(serviceId: number, entityTypeId: number, attributeDefinitionId: number, attributeEnumValue: AttributeEnumValue): Promise<AttributeEnumValue> {
//    const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/attributeDefinitions/${attributeDefinitionId}/attributeEnumValue`, {
//        method: "POST",
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify(attributeEnumValue)
//    });
//    if (!response.ok) {
//        throw new Error("Failed to create attribute definition enum");
//    }
//    return await response.json();
//}
// //nacti detail daneho typu entity
// export async function loadEntityTypeDetail(serviceId: number, entityTypeId: number): Promise<EntityType> {
//     const response = await fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`);
//     if (!response.ok) {
//         throw new Error("Failed to fetch entity type");
//     }
//     return await response.json();
// }
