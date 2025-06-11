import { renderServicesTab } from './servicesView.js';

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
