import { loadServices, createService, updateService, deleteService, toggleServiceActivation } from './services.js';

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

  loadServices().then(services=> {
    listContainer.innerHTML = "";
    services.forEach(service => {
      const item = document.createElement("div");
        item.innerHTML = `<b>${service.name}</b> - ${service.isActive ? "Aktivní" : "Neaktivní"}
        Vytvořeno: ${new Date(service.createdAt).toLocaleString('cs-CZ')}<br>
        <button data-id="${service.id}" class="edit-btn">Edit</button>
        <button data-id="${service.id}" class="delete-btn">Smazat</button>`;
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
    createService(name, description, isActive).then(() => renderServicesTab(container));
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
      updateService(id, name, description, isActive).then(() => renderServicesTab(container));
    });
  });
}
