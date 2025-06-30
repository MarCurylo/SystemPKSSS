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
export let isAuthenticated = false;
export let lastAuthError = null;
export function loadCurrentUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch('/api/users/me', { credentials: 'include' });
            if (res.ok) {
                const user = yield res.json();
                currentUserRoles = user.Roles || user.roles || [];
                currentUserName = user.UserName || user.userName || null;
                isAuthenticated = true;
                lastAuthError = null;
            }
            else if (res.status === 401) {
                // u�ivatel nen� p�ihl�en
                currentUserRoles = [];
                currentUserName = null;
                isAuthenticated = false;
                lastAuthError = "Nep�ihl�en";
            }
            else if (res.status === 403) {
                // u�ivatel p�ihl�en, ale nem� pr�va
                currentUserRoles = [];
                currentUserName = null;
                isAuthenticated = false;
                lastAuthError = "Nem�te opr�vn�n�";
            }
            else {
                currentUserRoles = [];
                currentUserName = null;
                isAuthenticated = false;
                lastAuthError = `Chyba p�ihl�en�: ${res.status}`;
            }
        }
        catch (e) {
            currentUserRoles = [];
            currentUserName = null;
            isAuthenticated = false;
            lastAuthError = "Chyba s API";
        }
    });
}
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadCurrentUser();
        yield renderMainNavigation();
        handleHashChange();
    });
}
window.addEventListener("load", startApp);
window.addEventListener("hashchange", handleHashChange);
// Pomocn� funkce pro dal�� API vol�n� chr�n�n�ch dat
export function apiFetchJson(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, options = {}) {
        // P�idej credentials: 'include' v�dy (pokud u� nen�)
        options.credentials = options.credentials || 'include';
        const res = yield fetch(url, options);
        if (res.status === 401) {
            // Nep�ihl�en - m��e� p�esm�rovat na login
            isAuthenticated = false;
            lastAuthError = "Nep�ihl�en";
            // M��e� nap�. zobrazit v�zvu k p�ihl�en�, nebo p�esm�rovat
            return null;
        }
        if (res.status === 403) {
            // Nem� pr�va
            lastAuthError = "Nem�te opr�vn�n�";
            return null;
        }
        if (!res.ok) {
            // Jin� chyba
            lastAuthError = `Chyba: ${res.status}`;
            return null;
        }
        // �sp�ch, vra� data
        lastAuthError = null;
        return yield res.json();
    });
}
