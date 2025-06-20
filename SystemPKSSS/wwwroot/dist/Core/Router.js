import { renderServicesTab, renderServiceDetail } from "../services/servicesView.js";
import { renderEntityTypeTab, renderEntityTypeDetail } from "../entityTypes/entityTypesView.js";
import { renderAttributeDefinitionTab } from "../AttributeDefinitions/attributeDefinitionsView.js";
// Hlavní router funkce
export function handleHashChange() {
    var _a, _b, _c, _d;
    const container = document.getElementById("main-container");
    if (!container)
        return;
    const parts = window.location.hash.slice(1).split('#');
    const section = (_a = parts[0]) !== null && _a !== void 0 ? _a : "";
    const id = parts[1] ? parseInt(parts[1]) : null;
    const subSection = (_b = parts[2]) !== null && _b !== void 0 ? _b : "";
    const subId = parts[3] ? parseInt(parts[3]) : null;
    const subSubSection = (_c = parts[4]) !== null && _c !== void 0 ? _c : "";
    const subSubId = (_d = parts[5]) !== null && _d !== void 0 ? _d : "";
    if (section === "services") {
        if (!id) {
            // Seznam všech služeb
            renderServicesTab(container);
        }
        else if (!subSection) {
            // Detail služby
            renderServiceDetail(id, container);
        }
        else if (subSection === "entitytypes") {
            if (!subId) {
                // Seznam typů entit
                renderEntityTypeTab(id, container);
            }
            else if (!subSubSection) {
                // Detail typu entity
                renderEntityTypeDetail(id, subId, container);
            }
            else if (subSubSection === "attributedefinitions") {
                if (!subSubId) {
                    // Seznam definic atributů pro daný entityType
                    renderAttributeDefinitionTab(id, subId, container);
                }
                else {
                    // Detail konkrétní definice atributu
                    // renderAttributeDefinitionDetail(id, subId, subSubId, container);
                }
            }
            else if (subSubSection === "enumvalues" && subSubId) {
                // Seznam/Detail ENUM hodnot pro danou definici atributu
                // renderAttributeEnumValuesTab(id, subId, subSubId, container);
            }
            else {
                container.innerHTML = "<p>Neznámá podstránka typu entity.</p>";
            }
        }
        else {
            container.innerHTML = "<p>Neznámá podstránka služby.</p>";
        }
    }
    else {
        container.innerHTML = "<h2>Vítejte v systému PKSSS</h2>";
    }
    // Registrace listenerů
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("load", handleHashChange);
}
