var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Načti všechny entity type pro danou službu
export function loadEntityTypes(serviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes`);
        if (!response.ok)
            throw new Error("Failed to fetch entity types");
        return yield response.json();
    });
}
// Detail jednoho typu entity podle ID
export function loadEntityType(serviceId, entityTypeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`);
        if (!response.ok)
            throw new Error("Failed to fetch entity type");
        return yield response.json();
    });
}
// Vytvoř nový typ entity
export function createEntityType(serviceId, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entityType),
        });
        if (!response.ok)
            throw new Error("Failed to create entity type");
        return yield response.json();
    });
}
// Edituj typ entity
export function updateEntityType(serviceId, entityTypeId, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entityType),
        });
        if (!response.ok)
            throw new Error("Failed to update entity type");
        return yield response.json();
    });
}
// Nastavení visibility (bonus)
export function setEntityTypeVisibility(entityTypeId, visible) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/entityTypes/${entityTypeId}/visible?visible=${visible}`, {
            method: "PUT",
        });
        if (!response.ok)
            throw new Error("Failed to set visibility");
        return yield response.json();
    });
}
// Smazání typu entity
export function deleteEntityType(serviceId, entityTypeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`, {
            method: "DELETE",
        });
        if (!response.ok)
            throw new Error("Failed to delete entity type");
    });
}
