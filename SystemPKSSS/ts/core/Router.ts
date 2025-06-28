import { renderServicesTab, renderServiceDetail } from "../services/servicesView.js";
import { renderEntityTypeTab, renderEntityTypeDetail } from "../entityTypes/entityTypesView.js";
import { renderAttributeDefinitionTab } from "../AttributeDefinitions/attributeDefinitionsView.js";
import { renderEntityTap } from "../Entities/entitiesView.js";

// Hlavní router funkce
export function handleHashChange() {
    const container = document.getElementById("main-container");
    if (!container) return;

    const parts = window.location.hash.slice(1).split('#');
    const section = parts[0] ?? "";
    const id = parts[1] ? parseInt(parts[1]) : null;
    const subSection = parts[2] ?? "";
    const subId = parts[3] ? parseInt(parts[3]) : null;
    const subSubSection = parts[4] ?? "";
    const subSubId = parts[5] ?? "";

if (section === "services") {
    if (!id) {
        // Seznam všech služeb
        renderServicesTab(container);
    } else if (!subSection) {
        // Detail služby
        renderServiceDetail(id, container);
    } else if (subSection === "entitytypes") {
        if (!subId) {
            // Seznam typů entit
            renderEntityTypeTab(id, container);
        } else if (!subSubSection) {
            // Detail typu entity
            renderEntityTypeDetail(id, subId, container);
        } else if (subSubSection === "attributedefinitions") {
            if (!subSubId) {
                // Seznam definic atributů pro daný entityType
                renderAttributeDefinitionTab(id, subId, container);
            } else {
                // Detail konkrétní definice atributu
                // renderAttributeDefinitionDetail(id, subId, subSubId, container);
            }
        } else if (subSubSection === "entities") if (!subSubId) {
                // Seznam definic atributů pro daný entityType
                renderEntityTap(id, subId, container);
            } else {
            container.innerHTML = "<p>Neznámá podstránka typu entity.</p>";
        }
    } else {
        container.innerHTML = "<p>Neznámá podstránka služby.</p>";
    }
} else {
    container.innerHTML = "<h2>Vítejte v systému PKSSS</h2>";
}

// Registrace listenerů
window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange); }