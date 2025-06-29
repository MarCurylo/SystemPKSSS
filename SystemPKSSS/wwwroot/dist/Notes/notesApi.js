var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Pomocná funkce na sestavení URL (aby se nemusel opakovat zápis všude)
function notesUrl(serviceId, entityTypeId, entityId, noteId) {
    let url = `/services/${serviceId}/entityTypes/${entityTypeId}/entities/${entityId}/notes`;
    if (noteId !== undefined)
        url += `/${noteId}`;
    return url;
}
// Načte všechny poznámky k dané entitě
export function loadNotes(serviceId, entityTypeId, entityId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(notesUrl(serviceId, entityTypeId, entityId));
        if (!res.ok)
            throw new Error("Nelze načíst poznámky");
        return yield res.json();
    });
}
// Přidá novou poznámku k entitě
export function createNote(serviceId, entityTypeId, entityId, note) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(notesUrl(serviceId, entityTypeId, entityId), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note)
        });
        if (!res.ok)
            throw new Error("Nelze přidat poznámku");
        return yield res.json();
    });
}
// Načte detail jedné poznámky
export function loadNote(serviceId, entityTypeId, entityId, noteId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(notesUrl(serviceId, entityTypeId, entityId, noteId));
        if (!res.ok)
            throw new Error("Poznámka nenalezena");
        return yield res.json();
    });
}
// Aktualizuje poznámku
export function updateNote(serviceId, entityTypeId, entityId, noteId, note) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(notesUrl(serviceId, entityTypeId, entityId, noteId), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note)
        });
        if (!res.ok)
            throw new Error("Nepodařilo se upravit poznámku");
    });
}
// Smaže poznámku
export function deleteNote(serviceId, entityTypeId, entityId, noteId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(notesUrl(serviceId, entityTypeId, entityId, noteId), {
            method: "DELETE"
        });
        if (!res.ok)
            throw new Error("Nepodařilo se smazat poznámku");
    });
}
