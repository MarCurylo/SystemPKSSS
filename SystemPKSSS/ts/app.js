"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var servicesView_js_1 = require("./services/servicesView.js");
var Router_js_1 = require("./core/Router.js");
window.addEventListener("hashchange", Router_js_1.handleHashChange);
window.addEventListener("load", Router_js_1.handleHashChange);
function loadApp() {
    var container = document.getElementById('main-container');
    if (!container)
        return;
    var hash = window.location.hash || '#services';
    switch (hash) {
        case '#services':
            (0, servicesView_js_1.renderServicesTab)(container);
            break;
        default:
            container.innerHTML = '<h2>404 - Nenalezeno</h2>';
    }
}
window.addEventListener('hashchange', loadApp);
window.addEventListener('load', loadApp);
