import { handleHashChange } from "./core/Router.js";
import { renderMainNavigation } from "./core/Navigation.js";

export let currentUserRoles: string[] = [];
export let currentUserName: string | null = null;


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


async function startApp() {
    await loadCurrentUser();       
    await renderMainNavigation();   
    handleHashChange();             
}

window.addEventListener("load", startApp);
window.addEventListener("hashchange", handleHashChange);
