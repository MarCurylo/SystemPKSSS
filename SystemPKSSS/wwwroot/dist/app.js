import { handleHashChange } from "./core/Router.js";
window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);
