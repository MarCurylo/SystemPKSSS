var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { handleHashChange } from "./core/Router.js";
import { renderMainNavigation } from "./core/Navigation.js";
export let currentUserRoles = [];
export let currentUserName = null;
/**
 * Načte aktuálního přihlášeného uživatele a jeho role z backendu.
 */
export function loadCurrentUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch('/api/users/me', { credentials: 'include' });
            if (res.ok) {
                const user = yield res.json();
                currentUserRoles = user.Roles || user.roles || [];
                currentUserName = user.UserName || user.userName || null;
            }
            else {
                currentUserRoles = [];
                currentUserName = null;
            }
        }
        catch (_a) {
            currentUserRoles = [];
            currentUserName = null;
        }
    });
}
/**
 * Spustí se po načtení stránky.
 * Nejprve načte aktuálního uživatele, pak vykreslí navigaci,
 * a nakonec spustí router, který zobrazí správnou stránku podle URL.
 */
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadCurrentUser(); // načti uživatele a role
        yield renderMainNavigation(); // vykresli menu/nav
        handleHashChange(); // vykresli stránku podle URL hash
    });
}
window.addEventListener("load", startApp);
window.addEventListener("hashchange", handleHashChange);
