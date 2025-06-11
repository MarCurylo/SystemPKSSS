import { loadServices, createService, updateService, deleteService,toggleServiceActivation } from './servicesApi.js';
import { Service } from './servicesModel.js';
import {refreshEntityTypesList} from './entityTypes/entityTypesView.js'

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

      item.innerHTML = `
        <b>${service.name}</b> - ${service.isActive ? "Aktivní" : "Neaktivní"}
        ${service.description ? `Popis služby: ${service.description}<br>` : ""} 
        Vytvořeno: ${service.createdAt
          ? new Date(service.createdAt as string).toLocaleString('cs-CZ')
          : 'Neznámé'}<br>

        <button data-id="${service.id}" class="edit-btn">Edit</button>
        <button data-id="${service.id}" class="delete-btn">Smazat</button>
        <button data-id="${service.id}" class="detail-btn">Detail Sluzby</button>
        <button data-id="${service.id}" class="entitytypes-btn">Zobrazit typy entit</button>
        <hr>
      `;

      listContainer.appendChild(item);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e: any) => {
        const id = parseInt(e.target.dataset.id);
        renderServiceEditForm(id, container);
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e: any) => {
        const id = parseInt(e.target.dataset.id);
        deleteService(id).then(() => refreshServicesList(container));
      });
    });

    document.querySelectorAll(".entitytypes-btn").forEach(btn => {
      btn.addEventListener("click", (e: any) => {
        const id = parseInt(e.target.dataset.id);
        const service = services.find(s => s.id === id);
        if (service) {
          container.innerHTML = `<h2>Typy entit pro službu: ${service.name}</h2><div id="entity-types-list"></div>`;
          refreshEntityTypesList(service.id, container);
        }
      });
    });
        document.querySelectorAll(".detail-btn").forEach(btn => {
      btn.addEventListener("click", (e: any) => {
        const id = parseInt(e.target.dataset.id);
        const service = services.find(s => s.id === id);
        if (service) {
          window.location.hash = `services#${id}`;
          container.innerHTML = 
          `<h2>Jmeno sluzby: ${service.name}</h2>
          <h5>Co je v teto sluzbe:</h3>
          <div id="entity-types-list"></div>
          <h5>Kdy byla sluzba zalozena</h5>
          ${service.createdAt
          ? new Date(service.createdAt as string).toLocaleString('cs-CZ')
          : 'Neznámé'}<hr>
          ${service.description ? `Popis služby: ${service.description}<br>` : ""} 
          `;
          refreshEntityTypesList(service.id, container);
        }
      });
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
