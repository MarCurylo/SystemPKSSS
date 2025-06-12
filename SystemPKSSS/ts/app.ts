import { handleHashChange } from "./core/Router.js";
import { renderMainNavigation } from "./core/Navigation.js";

async function startApp() {
  await renderMainNavigation();  // čekáme na načtení services a vykreslení navigace
  handleHashChange();            // teprve poté spouštíme router
}

window.addEventListener("load", startApp);
window.addEventListener("hashchange", handleHashChange);
