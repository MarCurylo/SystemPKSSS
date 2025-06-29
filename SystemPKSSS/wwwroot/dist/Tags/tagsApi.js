var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Načtení všech tagů služby
export function loadTagsByService(serviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/tags`);
        if (!response.ok)
            throw new Error("Nepodařilo se načíst tagy.");
        return response.json();
    });
}
// Vytvoření nového tagu ve službě
export function createTag(serviceId, tag) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/tags`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tag),
        });
        if (!response.ok)
            throw new Error("Nelze vytvořit tag.");
        return response.json();
    });
}
// Aktualizace tagu
export function updateTag(serviceId, tagId, tag) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/tags/${tagId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tag),
        });
        if (!response.ok)
            throw new Error("Nelze upravit tag.");
    });
}
// Smazání tagu
export function deleteTag(serviceId, tagId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/tags/${tagId}`, {
            method: "DELETE",
        });
        if (!response.ok)
            throw new Error("Nelze smazat tag.");
    });
}
// Načtení všech tagů přiřazených k entitě
export function loadEntityTagLinks(serviceId, entityId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entities/${entityId}/tags`);
        if (!response.ok)
            throw new Error("Nepodařilo se načíst tagy entity.");
        return response.json();
    });
}
// Přidání tagu k entitě
export function addTagToEntity(serviceId, entityId, link) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entities/${entityId}/tags`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(link),
        });
        if (!response.ok)
            throw new Error("Nelze přidat tag k entitě.");
        return response.json();
    });
}
// Odebrání tagu z entity
export function removeTagFromEntity(serviceId, entityId, linkId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entities/${entityId}/tags/${linkId}`, {
            method: "DELETE",
        });
        if (!response.ok)
            throw new Error("Nelze odebrat tag z entity.");
    });
}
