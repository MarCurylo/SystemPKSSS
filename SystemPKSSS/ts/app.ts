import { renderServicesTab } from './services/servicesView.js';
import { handleHashChange } from "./core/Router.js";

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);

function loadApp() {
  const container = document.getElementById('main-container');
  if (!container) return;

  const hash = window.location.hash || '#services';

  switch (hash) {
    case '#services':
      renderServicesTab(container);
      break;
    default:
      container.innerHTML = '<h2>404 - Nenalezeno</h2>';
  }
}

window.addEventListener('hashchange', loadApp);
window.addEventListener('load', loadApp);
