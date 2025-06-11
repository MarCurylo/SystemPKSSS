import { loadServices, createService, updateService, deleteService } from './servicesApi.js';
import { refreshEntityTypesList } from '../entityTypes/entityTypesView.js';
// Vstupní funkce pro zobrazení seznamu služeb
export function renderServicesTab(container) {
    var _a;
    container.innerHTML = `
    <h2>Seznam služeb</h2>
    <div id="services-list"></div>
    <button id="new-service-button">Nová služba</button>
  `;
    (_a = document.getElementById("new-service-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        renderServiceForm(container);
    });
    refreshServicesList(container);
}
// Načtení a vykreslení seznamu služeb
function refreshServicesList(container) {
    const listContainer = document.getElementById("services-list");
    if (!listContainer)
        return;
    loadServices().then(services => {
        listContainer.innerHTML = "";
        services.forEach(service => {
            const item = document.createElement("div");
            item.innerHTML = `
        <b>${service.name}</b> - ${service.isActive ? "Aktivní" : "Neaktivní"}
        ${service.description ? `Popis služby: ${service.description}<br>` : ""} 
        Vytvořeno: ${service.createdAt
                ? new Date(service.createdAt).toLocaleString('cs-CZ')
                : 'Neznámé'}<br>

        <button data-id="${service.id}" class="edit-btn">Edit</button>
        <button data-id="${service.id}" class="delete-btn">Smazat</button>
        <button data-id="${service.id}" class="detail-btn">Detail služby</button>
        <button data-id="${service.id}" class="entitytypes-btn">Typy entit</button>
        <hr>
      `;
            listContainer.appendChild(item);
        });
        // Event listenery na tlačítka
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                renderServiceEditForm(id, container);
            });
        });
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                deleteService(id).then(() => refreshServicesList(container));
            });
        });
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
// Formulář pro přidání nové služby
function renderServiceForm(container) {
    var _a;
    container.innerHTML = `
    <h2>Nová služba</h2>
    <input id="service-name" placeholder="Název služby"><br>
    <textarea id="service-description" placeholder="Popis služby"></textarea><br>
    <label>Aktivní: <input type="checkbox" id="service-active" checked></label><br>
    <button id="save-service-button">Uložit</button>
  `;
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
// Formulář pro editaci existující služby
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
      <button id="update-service-button">Uložit změny</button>
    `;
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
// Detail služby (pro volání z routeru)
export function renderServiceDetail(id, container) {
    loadServices().then(services => {
        var _a;
        const service = services.find(s => s.id === id);
        if (!service) {
            container.innerHTML = "<p>Služba nenalezena.</p>";
            return;
        }
        container.innerHTML = `
      <h2>Jméno služby: ${service.name}</h2>
      <h5>Popis:</h5>${(_a = service.description) !== null && _a !== void 0 ? _a : "Nezadán"}
      <h5>Datum založení:</h5>${service.createdAt
            ? new Date(service.createdAt).toLocaleString('cs-CZ')
            : 'Neznámé'}
      <hr>
      <a href="#services#${service.id}#entitytypes" class="btn btn-secondary">Typy entit</a>
    `;
        refreshEntityTypesList(service.id, container);
    });
}
//# sourceMappingURL=servicesView.js.map