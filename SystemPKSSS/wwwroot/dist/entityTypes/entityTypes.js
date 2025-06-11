var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Načtení entity types pro konkrétní službu
export function loadEntityTypesByService(serviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes`);
        if (!response.ok) {
            throw new Error("Failed to fetch entity types");
        }
        return yield response.json();
    });
}
// Přidání entity type do konkrétní služby
export function createEntityTypeForService(serviceId, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const entityType = { name, serviceId };
        const response = yield fetch("/entityTypes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entityType)
        });
        if (!response.ok) {
            throw new Error("Failed to create entity type");
        }
        return yield response.json();
    });
}
//# sourceMappingURL=entityTypes.js.map