var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Načti všechny entity v dané službě a typu
export function loadEntitiesByEntityType(serviceId, entityTypeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/entities`);
        if (!response.ok) {
            // Vypiš text chyby (pravděpodobně HTML chybová stránka nebo JSON s popisem)
            const text = yield response.text();
            console.error("Failed to fetch entities for entity type:", text);
            throw new Error(text);
        }
        return yield response.json();
    });
}
// Vytvoř novou entitu ve službě konkrétního typu
export function createEntity(serviceId, entityTypeId, newEntity) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/entities`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEntity)
        });
        if (!response.ok) {
            const text = yield response.text();
            console.error("Failed to create entity:", text);
            throw new Error(text);
        }
        return yield response.json();
    });
}
// Načti detail jedné entity
export function loadEntityDetail(serviceId, entityTypeId, entityId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/entities/${entityId}`);
        if (!response.ok) {
            const text = yield response.text();
            console.error("Failed to fetch entity:", text);
            throw new Error(text);
        }
        return yield response.json();
    });
}
export function updateEntity(serviceId, entityTypeId, entityId, updatedEntity // stejné jako při vytváření: { attributeValues: EntityAttributeValue[] }
) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/entities/${entityId}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEntity)
        });
        if (!response.ok) {
            const text = yield response.text();
            console.error("Failed to update entity:", text);
            throw new Error(text);
        }
        return yield response.json();
    });
}
