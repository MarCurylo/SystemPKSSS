import { loadServices, createService, updateService, deleteService } from './servicesApi.js';
import { renderTagsTab } from "../Tags/tagsView.js";
import { renderEntityTypeTab } from '../entityTypes/entityTypesView.js';
import { currentUserRoles } from '../app.js';
import { renderMainNavigation } from '../core/Navigation.js';
// --- SEZNAM SLUŽEB (TAB) ---
export function renderServicesTab(container) {
    var _a;
    container.innerHTML = `
    <h2>Seznam služeb</h2>
    <div id="services-list"></div>
    ${currentUserRoles.includes("Admin") ? `
      <div>
        <button id="new-service-button" class="button">Nová služba</button>
      </div>
    ` : ""}
    <div id="new-service-editor"></div>
  `;
    if (currentUserRoles.includes("Admin")) {
        (_a = document.getElementById("new-service-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            const editor = document.getElementById("new-service-editor");
            // Toggle – pokud je panel otevřený, zavřu ho; jinak ho otevřu
            if (editor && editor.innerHTML.trim() !== "") {
                editor.innerHTML = "";
            }
            else {
                renderServiceForm();
            }
        });
    }
    refreshServicesList();
}
function refreshServicesList() {
    const listContainer = document.getElementById("services-list");
    if (!listContainer)
        return;
    loadServices().then(services => {
        listContainer.innerHTML = "";
        services.forEach(service => {
            const canEdit = currentUserRoles.includes("Admin");
            const item = document.createElement("div");
            item.innerHTML = `
        <div>
          <b>${service.name}</b> - ${service.isActive ? "Aktivní" : "Neaktivní"}
          ${service.description ? `<br>Popis služby: ${service.description}<br>` : ""}
          Vytvořeno: ${service.createdAt ? new Date(service.createdAt).toLocaleString('cs-CZ') : 'Neznámé'}<br>
          <b>${!service.isActive ? `neni aktivni` : `je aktivni`}</b><br>
          ${canEdit ? `<button data-id="${service.id}" class="button edit-btn">Edit</button>` : ""}
          ${canEdit ? `<button data-id="${service.id}" class="button danger delete-btn">Smazat</button>` : ""}
          <button data-id="${service.id}" class="button secondary detail-btn">Detail služby</button>
          <button data-id="${service.id}" class="button secondary entitytypes-btn">Typy entit</button>
          <div id="editor-${service.id}"></div>
          <div id="delete-${service.id}"></div>
        </div>
        <hr>
      `;
            listContainer.appendChild(item);
        });
        if (currentUserRoles.includes("Admin")) {
            document.querySelectorAll(".edit-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const id = parseInt(e.target.dataset.id);
                    const editorContainer = document.getElementById(`editor-${id}`);
                    // Toggle – pokud je otevřeno, zavřu; jinak otevřu
                    if (editorContainer && editorContainer.innerHTML.trim() !== "") {
                        editorContainer.innerHTML = "";
                    }
                    else {
                        // zavřeme ostatní editory (jen pro jistotu)
                        document.querySelectorAll('[id^="editor-"]').forEach(e => { if (e !== editorContainer)
                            e.innerHTML = ""; });
                        renderServiceEditForm(id);
                    }
                });
            });
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const id = parseInt(e.target.dataset.id);
                    const deleteContainer = document.getElementById(`delete-${id}`);
                    if (deleteContainer && deleteContainer.innerHTML.trim() !== "") {
                        deleteContainer.innerHTML = "";
                    }
                    else {
                        // zavřeme ostatní delete
                        document.querySelectorAll('[id^="delete-"]').forEach(e => { if (e !== deleteContainer)
                            e.innerHTML = ""; });
                        renderServiceDeleteForm(id);
                    }
                });
            });
        }
        document.querySelectorAll(".detail-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                window.location.hash = `services#${id}`;
            });
        });
        document.querySelectorAll(".entitytypes-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                window.location.hash = `services#${id}#entitytypes`;
            });
        });
    });
}
// --- NOVÁ SLUŽBA (panel) ---
function renderServiceForm() {
    var _a, _b;
    if (!currentUserRoles.includes("Admin")) {
        alert("Nemáte oprávnění vytvářet služby.");
        return;
    }
    const editorContainer = document.getElementById("new-service-editor");
    if (!editorContainer)
        return;
    editorContainer.innerHTML = `
    <div class="editor-block animated-fadein">
      <h3>Nová služba</h3>
      <form>
        <input id="service-name" placeholder="Název služby" required class="input-lg"><br>
        <textarea id="service-description" placeholder="Popis služby" class="input-lg"></textarea><br>
        <label>Aktivní: <input type="checkbox" id="service-active" checked></label><br>
        <button type="submit" id="save-service-button" class="button">Uložit</button>
        <button id="cancel-service-button" class="button secondary">Zrušit</button>
      </form>
    </div>
  `;
    (_a = document.getElementById("save-service-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
        e.preventDefault();
        const name = document.getElementById("service-name").value;
        if (!name) {
            alert("Název služby nesmí být prázdný!");
            return;
        }
        const description = document.getElementById("service-description").value;
        const isActive = document.getElementById("service-active").checked;
        const newService = { name, description, isActive };
        createService(newService).then(() => {
            refreshServicesList();
            editorContainer.innerHTML = "";
            renderMainNavigation();
        });
    });
    (_b = document.getElementById("cancel-service-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
        e.preventDefault();
        editorContainer.innerHTML = "";
    });
}
// --- EDITACE (panel) ---
function renderServiceEditForm(id) {
    if (!currentUserRoles.includes("Admin")) {
        alert("Nemáte oprávnění upravovat služby.");
        return;
    }
    const editorContainer = document.getElementById(`editor-${id}`);
    if (!editorContainer)
        return;
    loadServices().then(services => {
        var _a, _b, _c;
        const service = services.find(s => s.id === id);
        if (!service)
            return;
        editorContainer.innerHTML = `
      <div class="editor-block animated-fadein">
        <h4>Editace:</h4>
        <input id="edit-name-${id}" value="${service.name}" class="input-lg"><br>
        <textarea id="edit-description-${id}" class="input-lg">${(_a = service.description) !== null && _a !== void 0 ? _a : ""}</textarea><br>
        <label>Aktivní: <input type="checkbox" id="edit-active-${id}" ${service.isActive ? "checked" : ""}></label><br>
        <button id="save-edit-button-${id}" class="button">Uložit změny</button>
        <button id="cancel-edit-button-${id}" class="button secondary">Zrušit</button>
      </div>
    `;
        (_b = document.getElementById(`save-edit-button-${id}`)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            const name = document.getElementById(`edit-name-${id}`).value;
            const description = document.getElementById(`edit-description-${id}`).value;
            const isActive = document.getElementById(`edit-active-${id}`).checked;
            const editedService = { id, name, description, isActive };
            updateService(editedService).then(() => {
                refreshServicesList();
                editorContainer.innerHTML = "";
            });
        });
        (_c = document.getElementById(`cancel-edit-button-${id}`)) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            editorContainer.innerHTML = "";
        });
    });
}
// --- MAZÁNÍ (panel) ---
function renderServiceDeleteForm(id) {
    if (!currentUserRoles.includes("Admin")) {
        alert("Nemáte oprávnění mazat služby.");
        return;
    }
    const deleteContainer = document.getElementById(`delete-${id}`);
    if (!deleteContainer)
        return;
    loadServices().then(services => {
        var _a, _b;
        const service = services.find(s => s.id === id);
        if (!service)
            return;
        deleteContainer.innerHTML = `
      <div class="editor-block animated-fadein">
        <h4>Potvrzení mazání:</h4>
        <label id="delete-name-${id}">${service.name}</label><br>
        <label>Opravdu chcete smazat službu: ${service.name}?</label><br>
        <button id="delete-button-${id}" class="button danger">Smazat</button>
        <button id="cancel-delete-button-${id}" class="button secondary">Zrušit</button>
      </div>
    `;
        (_a = document.getElementById(`delete-button-${id}`)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            deleteService(service).then(() => {
                refreshServicesList();
                deleteContainer.innerHTML = "";
                renderMainNavigation();
            });
        });
        (_b = document.getElementById(`cancel-delete-button-${id}`)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            deleteContainer.innerHTML = "";
        });
    });
}
// --- DETAIL SLUŽBY (2panely) ---
export function renderServiceDetail(serviceId, container) {
    container.innerHTML = `
    <div id="service-detail-row" style="display:flex;gap:2.5rem;align-items:flex-start;">
      <div id="service-detail-panel" style="flex:1;min-width:320px;max-width:500px"></div>
      <div style="flex:1.2;min-width:320px;position:relative;">
        <div id="entity-types-panel"></div>
      </div>
    </div>
  `;
    renderServiceDetailPanel(serviceId, document.getElementById("service-detail-panel"));
}
// Panel vlevo, tlačítko toggleuje panel vpravo (zobrazení/skrývání editor-blocku)
function renderServiceDetailPanel(serviceId, container) {
    loadServices().then(services => {
        const service = services.find(s => s.id === serviceId);
        if (!service) {
            container.innerHTML = "<p>Služba nenalezena.</p>";
            return;
        }
        container.innerHTML = `
      <div class="editor-block animated-fadein">
        <h2>${service.name}</h2>
        <div style="margin-bottom:1em;">
          <strong>Popis služby:</strong><br>
          <span>${service.description ? service.description : "<i>Nezadán</i>"}</span>
        </div>
        <div style="margin-bottom:1em;">
          <strong>Datum založení:</strong> ${service.createdAt
            ? new Date(service.createdAt).toLocaleString('cs-CZ')
            : 'Neznámé'}
        </div>
        <div style="margin-bottom:1.1em;">
          <strong>Stav:</strong> <span style="color:${service.isActive ? "#7da308" : "#b38d0e"};">
            ${service.isActive ? "Aktivní" : "Neaktivní"}
          </span>
        </div>
        <div style="margin-bottom:1.2em;">
          <strong>Typy entit:</strong><br>
          <button class="button secondary" id="toggle-entity-types">Typy entit</button>
        </div>
        <div>
          <div id="service-tags-container" style="margin-top:0.5em;"></div>
        </div>
      </div>
    `;
        // Tagy služby
        const el = container.querySelector("#service-tags-container");
        if (el && el instanceof HTMLElement) {
            renderTagsTab(service.id, el);
        }
        // Toggle panel vpravo (box se vloží/vymaže podle stavu)
        const toggleBtn = container.querySelector("#toggle-entity-types");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                const entityPanel = document.getElementById("entity-types-panel");
                if (!entityPanel)
                    return;
                if (entityPanel.innerHTML.trim() !== "") {
                    // SCHOVAT
                    entityPanel.innerHTML = "";
                }
                else {
                    // UKÁZAT (vlož box)
                    entityPanel.innerHTML = `<div class="editor-block animated-fadein" id="entity-types-inner"></div>`;
                    const inner = document.getElementById("entity-types-inner");
                    if (inner)
                        renderEntityTypeTab(serviceId, inner);
                }
            });
        }
    });
}
