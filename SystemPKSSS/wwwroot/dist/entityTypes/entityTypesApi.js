var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Načti všechny druhy entit
export function loadEntityTypes() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("/entitytypes");
        if (!response.ok) {
            throw new Error("Failed to fetch entity types");
        }
        return yield response.json();
    });
}
//nacti detail daneho typu entity
export function loadEntityTypeDetail(serviceId, entityTypeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch entity type");
        }
        return yield response.json();
    });
}
// Načti všechny druhy entit ve sluzbe
export function loadEntityTypesByService(serviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes`);
        if (!response.ok) {
            throw new Error("Failed to fetch entity types for service");
        }
        return yield response.json();
    });
}
// Vytvoř novy druh entity ve sluzbe
export function createEntityType(serviceId, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entityType)
        });
        if (!response.ok) {
            throw new Error("Failed to create entity type");
        }
        return yield response.json();
    });
}
// Update existující druh entity
export function updateEntityType(serviceId, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!entityType.id) {
            throw new Error("EntityType ID is required for update");
        }
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityType.id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entityType)
        });
        if (!response.ok) {
            throw new Error("Failed to update entity type");
        }
        return yield response.json();
    });
}
// Smazání druhu entity
export function deleteEntityType(entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!entityType.id) {
            throw new Error("EntityType ID is required for delete");
        }
        const response = yield fetch(`/entityTypes/${entityType.id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error("Failed to delete entity type");
        }
    });
}
