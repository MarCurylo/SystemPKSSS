import { loadServices, createService, updateService } from './servicesApi.js';
import { renderEntityTypesTab, renderEntityTypeForm } from "./entityTypes/entityTypes.js";
export function renderServicesTab(container) {
    var _a;
    container.innerHTML = `<h2>Seznam služeb</h2>
    <div id="services-list"></div>
    <button id="new-service-button">Nová služba</button>`;
    (_a = document.getElementById("new-service-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        renderServiceForm(container);
    });
    refreshServicesList(container);
}
function refreshServicesList(container) {
    const listContainer = document.getElementById("services-list");
    if (!listContainer)
        return;
    loadServices().then(services => {
        listContainer.innerHTML = "";
        services.forEach(service => {
            const item = document.createElement("div");
            item.textContent = service.name;
            // Tlačítko Zobrazit typy entit
            const entityTypesButton = document.createElement("button");
            entityTypesButton.textContent = "Zobrazit typy entit";
            entityTypesButton.addEventListener("click", () => {
                renderEntityTypesTab(service.id, container);
            });
            // Tlačítko Přidat typ entity
            const addEntityTypeButton = document.createElement("button");
            addEntityTypeButton.textContent = "Přidat typ entity";
            addEntityTypeButton.addEventListener("click", () => {
                renderEntityTypeForm(service.id, container);
            });
            item.appendChild(document.createElement("br"));
            item.appendChild(entityTypesButton);
            item.appendChild(addEntityTypeButton);
            listContainer.appendChild(item);
        });
    });
}
function renderServiceForm(container) {
    var _a;
    container.innerHTML = `
    <h2>Nová služba</h2>
    <input id="service-name" placeholder="Název služby"><br>
    <textarea id="service-description" placeholder="Popis služby"></textarea><br>
          <label>Aktivní: <input type="checkbox" id="service-active" "checked" : ""}></label><br>
    <button id="save-service-button">Uložit</button>`;
    (_a = document.getElementById("save-service-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const name = document.getElementById("service-name").value;
        const description = document.getElementById("service-description").value;
        const isActive = document.getElementById("service-active").checked;
        const newService = {
            name,
            description,
            isActive,
        };
        createService(newService).then(() => renderServicesTab(container));
    });
}
function renderServiceEditForm(id, container) {
    loadServices().then(services => {
        var _a;
        const service = services.find(s => s.id === id);
        if (!service)
            return;
        container.innerHTML = `
      <h2>Editace služby</h2>
      <input id="service-name" value="${service.name}"><br>
      <textarea id="service-description">${service.description}</textarea><br>
      <label>Aktivní: <input type="checkbox" id="service-active" ${service.isActive ? "checked" : ""}></label><br>
      <button id="update-service-button">Uložit změny</button>`;
        (_a = document.getElementById("update-service-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            const name = document.getElementById("service-name").value;
            const description = document.getElementById("service-description").value;
            const isActive = document.getElementById("service-active").checked;
            const editedService = {
                id,
                name,
                description,
                isActive
            };
            updateService(editedService).then(() => renderServicesTab(container));
        });
    });
}
//# sourceMappingURL=servicesView.js.map