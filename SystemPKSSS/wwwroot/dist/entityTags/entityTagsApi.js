var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Načtení tagů přiřazených k entitě
export function loadEntityTags(serviceId, entityId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`/services/${serviceId}/entities/${entityId}/tags`);
        if (!res.ok)
            throw new Error("Nelze načíst tagy entity");
        return res.json();
    });
}
// Přidání tagu k entitě
export function createEntityTagLink(serviceId, entityId, dto) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`/services/${serviceId}/entities/${entityId}/tags`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
        });
        if (!res.ok)
            throw new Error("Nelze přidat tag");
        return res.json();
    });
}
// Odebrání tagu z entity
export function deleteEntityTagLink(serviceId, entityId, linkId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`/services/${serviceId}/entities/${entityId}/tags/${linkId}`, {
            method: "DELETE",
        });
        if (!res.ok)
            throw new Error("Nelze smazat tag");
    });
}
