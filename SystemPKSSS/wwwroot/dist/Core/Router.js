import { renderAuthForms } from "./authModule.js";
import { renderServicesTab, renderServiceDetail } from "../services/servicesView.js";
import { renderEntityTypeTab, renderEntityTypeDetail } from "../entityTypes/entityTypesView.js";
import { renderAttributeDefinitionTab } from "../AttributeDefinitions/attributeDefinitionsView.js";
import { renderEntityTap, renderEntityDetail } from "../Entities/entitiesView.js";
import { renderNotesSection } from "../Notes/notesView.js";
import { renderAdminUsersTab } from "../Users/adminUserView.js";
import { renderAdminView } from "../Users/superView.js";
export function handleHashChange() {
    var _a, _b, _c, _d;
    const container = document.getElementById("main-container");
    if (!container)
        return;
    const hash = window.location.hash;
    // LOGIN / REGISTRACE
    if (hash === "#/login" || hash === "#/register") {
        renderAuthForms();
        return;
    }
    // ADMIN - SPRÁVA UŽIVATELŮ
    if (hash === "#/admin-users") {
        renderAdminUsersTab(container);
        return;
    }
    // ADMIN - SUPERVIEW
    if (hash === "#adminview") {
        renderAdminView(container);
        return;
    }
    // Ostatní routování
    const parts = window.location.hash.slice(1).split('#');
    const section = (_a = parts[0]) !== null && _a !== void 0 ? _a : "";
    const id = parts[1] ? parseInt(parts[1]) : null;
    const subSection = (_b = parts[2]) !== null && _b !== void 0 ? _b : "";
    const subId = parts[3] ? parseInt(parts[3]) : null;
    const subSubSection = (_c = parts[4]) !== null && _c !== void 0 ? _c : "";
    const subSubId = parts[5] ? parseInt(parts[5]) : null;
    const extraSection = (_d = parts[6]) !== null && _d !== void 0 ? _d : "";
    if (section === "services") {
        if (!id) {
            renderServicesTab(container);
        }
        else if (!subSection) {
            renderServiceDetail(id, container);
        }
        else if (subSection === "entitytypes") {
            if (!subId) {
                renderEntityTypeTab(id, container);
            }
            else if (!subSubSection) {
                renderEntityTypeDetail(id, subId, container);
            }
            else if (subSubSection === "attributedefinitions") {
                if (!subSubId) {
                    renderAttributeDefinitionTab(id, subId, container);
                }
                else {
                    // renderAttributeDefinitionDetail(id, subId, subSubId, container);
                }
            }
            else if (subSubSection === "entities") {
                if (!subSubId) {
                    renderEntityTap(id, subId, container);
                }
                else if (extraSection === "notes") {
                    renderNotesSection(id, subId, subSubId, container);
                }
                else {
                    renderEntityDetail(id, subId, subSubId, container);
                }
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
        container.innerHTML = "<h2>Vítejte v systému PKSSS </h2> <p>možná se vám bude hodit nápověda, najdete ji vlevo dole. Na každé stránce, kterou navšítvíte bude jiná </p>";
    }
}
window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);
