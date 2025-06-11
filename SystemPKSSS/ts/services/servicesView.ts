import { loadServices, createService, updateService, deleteService,toggleServiceActivation } from './servicesApi.js';
import { Service } from './servicesModel.js';
import { renderEntityTypesTab, renderEntityTypeForm } from "./entityTypes/entityTypes.js";

export function renderServicesTab(container: HTMLElement) {
  container.innerHTML = `<h2>Seznam služeb</h2>
    <div id="services-list"></div>
    <button id="new-service-button">Nová služba</button>`;

  document.getElementById("new-service-button")?.addEventListener("click", () => {
    renderServiceForm(container);
  });

  refreshServicesList(container);
}


function refreshServicesList(container: HTMLElement) {
  const listContainer = document.getElementById("services-list");
  if (!listContainer) return;

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


function renderServiceForm(container: HTMLElement) {
  container.innerHTML = `
    <h2>Nová služba</h2>
    <input id="service-name" placeholder="Název služby"><br>
    <textarea id="service-description" placeholder="Popis služby"></textarea><br>
          <label>Aktivní: <input type="checkbox" id="service-active" "checked" : ""}></label><br>
    <button id="save-service-button">Uložit</button>`;

  document.getElementById("save-service-button")?.addEventListener("click", () => {
    const name = (document.getElementById("service-name") as HTMLInputElement).value;
    const description = (document.getElementById("service-description") as HTMLTextAreaElement).value;
    const isActive = (document.getElementById("service-active") as HTMLInputElement).checked;
    const newService: Service = {
      name,
      description,
      isActive,
    }
    createService(newService).then(() => renderServicesTab(container));
  });
}

function renderServiceEditForm(id: number, container: HTMLElement) {
  loadServices().then(services => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    container.innerHTML = `
      <h2>Editace služby</h2>
      <input id="service-name" value="${service.name}"><br>
      <textarea id="service-description">${service.description}</textarea><br>
      <label>Aktivní: <input type="checkbox" id="service-active" ${service.isActive ? "checked" : ""}></label><br>
      <button id="update-service-button">Uložit změny</button>`;

    document.getElementById("update-service-button")?.addEventListener("click", () => {
      const name = (document.getElementById("service-name") as HTMLInputElement).value;
      const description = (document.getElementById("service-description") as HTMLTextAreaElement).value;
      const isActive = (document.getElementById("service-active") as HTMLInputElement).checked;
          const editedService: Service = {
            id,
      name,
      description,
      isActive
    }
      updateService(editedService).then(() => renderServicesTab(container));
    });
  });
}
