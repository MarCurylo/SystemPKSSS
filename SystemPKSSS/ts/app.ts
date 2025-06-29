import { handleHashChange } from "./core/Router.js";
import { renderMainNavigation } from "./core/Navigation.js";

export let currentUserRoles: string[] = [];
export let currentUserName: string | null = null;

/**
 * Načte aktuálního přihlášeného uživatele a jeho role z backendu.
 */
export async function loadCurrentUser() {
    try {
        const res = await fetch('/api/users/me', { credentials: 'include' });
        if (res.ok) {
            const user = await res.json();
            currentUserRoles = user.Roles || user.roles || [];
            currentUserName = user.UserName || user.userName || null;
        } else {
            currentUserRoles = [];
            currentUserName = null;
        }
    } catch {
        currentUserRoles = [];
        currentUserName = null;
    }
}

/**
 * Spustí se po načtení stránky.
 * Nejprve načte aktuálního uživatele, pak vykreslí navigaci,
 * a nakonec spustí router, který zobrazí správnou stránku podle URL.
 */
async function startApp() {
    await loadCurrentUser();        // načti uživatele a role
    await renderMainNavigation();   // vykresli menu/nav
    handleHashChange();             // vykresli stránku podle URL hash
}

window.addEventListener("load", startApp);
window.addEventListener("hashchange", handleHashChange);
