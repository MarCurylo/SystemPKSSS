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
export function createAttributeDefinition(serviceId, entityTypeId, attributeDefinition) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attributeDefinition)
        });
        if (!response.ok) {
            throw new Error("Failed to create attribute definition");
        }
        return yield response.json();
    });
}
