import { handleHashChange } from "./core/Router.js";
import { renderMainNavigation } from "./core/Navigation.js";

export let currentUserRoles: string[] = [];
export let currentUserName: string | null = null;
export let isAuthenticated: boolean = false;
export let lastAuthError: string | null = null;

export async function loadCurrentUser() {
    try {
        const res = await fetch('/api/users/me', { credentials: 'include' });
        if (res.ok) {
            const user = await res.json();
            currentUserRoles = user.Roles || user.roles || [];
            currentUserName = user.UserName || user.userName || null;
            isAuthenticated = true;
            lastAuthError = null;
        } else if (res.status === 401) {
            // u�ivatel nen� p�ihl�en
            currentUserRoles = [];
            currentUserName = null;
            isAuthenticated = false;
            lastAuthError = "Nep�ihl�en";
        } else if (res.status === 403) {
            // u�ivatel p�ihl�en, ale nem� pr�va
            currentUserRoles = [];
            currentUserName = null;
            isAuthenticated = false;
            lastAuthError = "Nem�te opr�vn�n�";
        } else {
            currentUserRoles = [];
            currentUserName = null;
            isAuthenticated = false;
            lastAuthError = `Chyba p�ihl�en�: ${res.status}`;
        }
    } catch (e) {
        currentUserRoles = [];
        currentUserName = null;
        isAuthenticated = false;
        lastAuthError = "Chyba s API";
    }
}

async function startApp() {
    await loadCurrentUser();
    await renderMainNavigation();
    handleHashChange();
}

window.addEventListener("load", startApp);
window.addEventListener("hashchange", handleHashChange);

// Pomocn� funkce pro dal�� API vol�n� chr�n�n�ch dat
export async function apiFetchJson(url: string, options: RequestInit = {}) {
    // P�idej credentials: 'include' v�dy (pokud u� nen�)
    options.credentials = options.credentials || 'include';
    const res = await fetch(url, options);

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
    return await res.json();
}
