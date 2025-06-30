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
            // uivatel není pøihlášen
            currentUserRoles = [];
            currentUserName = null;
            isAuthenticated = false;
            lastAuthError = "Nepøihlášen";
        } else if (res.status === 403) {
            // uivatel pøihlášen, ale nemá práva
            currentUserRoles = [];
            currentUserName = null;
            isAuthenticated = false;
            lastAuthError = "Nemáte oprávnìní";
        } else {
            currentUserRoles = [];
            currentUserName = null;
            isAuthenticated = false;
            lastAuthError = `Chyba pøihlášení: ${res.status}`;
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

// Pomocná funkce pro další API volání chránìnıch dat
export async function apiFetchJson(url: string, options: RequestInit = {}) {
    // Pøidej credentials: 'include' vdy (pokud u není)
    options.credentials = options.credentials || 'include';
    const res = await fetch(url, options);

    if (res.status === 401) {
        // Nepøihlášen - mùeš pøesmìrovat na login
        isAuthenticated = false;
        lastAuthError = "Nepøihlášen";
        // Mùeš napø. zobrazit vızvu k pøihlášení, nebo pøesmìrovat
        return null;
    }
    if (res.status === 403) {
        // Nemá práva
        lastAuthError = "Nemáte oprávnìní";
        return null;
    }
    if (!res.ok) {
        // Jiná chyba
        lastAuthError = `Chyba: ${res.status}`;
        return null;
    }

    // úspìch, vra data
    lastAuthError = null;
    return await res.json();
}
