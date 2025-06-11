"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHashChange = handleHashChange;
var servicesView_js_1 = require("../services/servicesView.js");
// import { renderEntityTypesTab } from "../entityTypes/entityTypesView.js";
// Hlavní router funkce
function handleHashChange() {
    var _a, _b;
    var container = document.getElementById("main-container");
    if (!container)
        return;
    var parts = window.location.hash.slice(1).split('#');
    var section = (_a = parts[0]) !== null && _a !== void 0 ? _a : "";
    var id = parts[1] ? parseInt(parts[1]) : null;
    var subSection = (_b = parts[2]) !== null && _b !== void 0 ? _b : "";
    var subId = parts[3] ? parseInt(parts[3]) : null;
    if (section === "services") {
        if (!id) {
            // seznam všech služeb
            (0, servicesView_js_1.renderServicesTab)(container);
        }
        else if (id && !subSection) {
            // detail služby
            (0, servicesView_js_1.renderServiceDetail)(id, container);
        }
        // else if (subSection === "entitytypes") {
        //     // entity types ve službě
        //     renderEntityTypesTab(id, container);
        // }
        else {
            container.innerHTML = "<p>Neznámá podstránka služby.</p>";
        }
    }
    else {
        container.innerHTML = "<h2>Vítejte v systému PKSSS</h2>";
    }
}
// Registrace listenerů
window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);
