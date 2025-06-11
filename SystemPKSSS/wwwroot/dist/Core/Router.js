import { renderServicesTab, renderServiceDetail } from "../services/servicesView.js";
// import { renderEntityTypesTab } from "../entityTypes/entityTypesView.js";
// Hlavní router funkce
export function handleHashChange() {
    var _a, _b;
    const container = document.getElementById("main-container");
    if (!container)
        return;
    const parts = window.location.hash.slice(1).split('#');
    const section = (_a = parts[0]) !== null && _a !== void 0 ? _a : "";
    const id = parts[1] ? parseInt(parts[1]) : null;
    const subSection = (_b = parts[2]) !== null && _b !== void 0 ? _b : "";
    const subId = parts[3] ? parseInt(parts[3]) : null;
    if (section === "services") {
        if (!id) {
            // seznam všech služeb
            renderServicesTab(container);
        }
        else if (id && !subSection) {
            // detail služby
            renderServiceDetail(id, container);
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
//# sourceMappingURL=Router.js.map