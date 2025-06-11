import { loadServices, createService, updateService, deleteService } from './servicesApi.js';
import { Service, NewService, UpdateService } from './servicesModel.js';
import { refreshEntityTypesList } from '../entityTypes/entityTypesView.js';

// Vstupní funkce pro zobrazení celé sekce služeb
export function renderServicesTab(container: HTMLElement) {
  container.innerHTML = `
    <h2>Seznam služeb</h2>
    <div id="services-list"></div>
    <div id="new-service-editor"></div>
    <button id="new-service-button">Nová služba</button>
  `;

  document.getElementById("new-service-button")?.addEventListener("click", () => {
    renderServiceForm();
  });

  refreshServicesList();
}

// Vykreslení seznamu služeb
function refreshServicesList() {
  const listContainer = document.getElementById("services-list");
  if (!listContainer) return;

  loadServices().then(services => {
    listContainer.innerHTML = "";

    services.forEach(service => {
      const item = document.createElement("div");

      item.innerHTML = `
        <div>
          <b>${service.name}</b> - ${service.isActive ? "Aktivní" : "Neaktivní"}
          ${service.description ? `Popis služby: ${service.description}<br>` : ""} 
          Vytvořeno: ${service.createdAt
            ? new Date(service.createdAt as string).toLocaleString('cs-CZ')
            : 'Neznámé'}<br>

          <button data-id="${service.id}" class="edit-btn">Edit</button>
          <button data-id="${service.id}" class="delete-btn">Smazat</button>
          <button data-id="${service.id}" class="detail-btn">Detail služby</button>
          <button data-id="${service.id}" class="entitytypes-btn">Typy entit</button>

          <div id="editor-${service.id}" class="inline-editor"></div>
          <div id="delete-${service.id}" class="inline-delete"></div>
        </div>
        <hr>
      `;

      listContainer.appendChild(item);
    });

    // Event listenery:

document.querySelectorAll(".edit-btn").forEach(btn => {
  btn.addEventListener("click", (e: any) => {
    const id = parseInt(e.target.dataset.id);
    const editorContainer = document.getElementById(`editor-${id}`);
    if (!editorContainer) return;

    if (editorContainer.innerHTML.trim() !== "") {
      editorContainer.innerHTML = "";
    } else {
      renderServiceEditForm(id);
    }
  });
});
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e: any) => {
        const id = parseInt(e.target.dataset.id);
        const deleteContainer = document.getElementById(`delete-${id}`);
        if (!deleteContainer) return;
        if (deleteContainer.innerHTML.trim() !== "") {
            deleteContainer.innerHTML = "";
        } else {
            renderServiceDeleteForm(id)
        }
      });
    });

     document.querySelectorAll(".detail-btn").forEach(btn => {
      btn.addEventListener("click", (e: any) => {
        const id = parseInt(e.target.dataset.id);
        window.location.hash = `services#${id}`;
      });
    });

    document.querySelectorAll(".entitytypes-btn").forEach(btn => {
      btn.addEventListener("click", (e: any) => {
        const id = parseInt(e.target.dataset.id);
        window.location.hash = `services#${id}#entitytypes`;
      });
    });
  });
}

// Formulář pro přidání nové služby
function renderServiceForm() {
  const editorContainer = document.getElementById("new-service-editor");
  if (!editorContainer) return;

  editorContainer.innerHTML = `
    <h3>Nová služba</h3>
    <input id="service-name" placeholder="Název služby"><br>
    <textarea id="service-description" placeholder="Popis služby"></textarea><br>
    <label>Aktivní: <input type="checkbox" id="service-active" checked></label><br>
    <button id="save-service-button">Uložit</button>
    <button id="cancel-service-button">Zrušit</button>
  `;

  document.getElementById("save-service-button")?.addEventListener("click", () => {
    const name = (document.getElementById("service-name") as HTMLInputElement).value;
    const description = (document.getElementById("service-description") as HTMLTextAreaElement).value;
    const isActive = (document.getElementById("service-active") as HTMLInputElement).checked;

    const newService: NewService = { name, description, isActive };

    createService(newService).then(() => {
      refreshServicesList();
      editorContainer.innerHTML = "";
    });
  });

  document.getElementById("cancel-service-button")?.addEventListener("click", () => {
    editorContainer.innerHTML = "";
    
  });
}

// Formulář pro inline editaci konkrétní služby
function renderServiceEditForm(id: number) {
  const editorContainer = document.getElementById(`editor-${id}`);
  if (!editorContainer) return;

  loadServices().then(services => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    editorContainer.innerHTML = `
      <h4>Editace:</h4>
      <input id="edit-name-${id}" value="${service.name}"><br>
      <textarea id="edit-description-${id}">${service.description ?? ""}</textarea><br>
      <label>Aktivní: <input type="checkbox" id="edit-active-${id}" ${service.isActive ? "checked" : ""}></label><br>
      <button id="save-edit-button-${id}">Uložit změny</button>
      <button id="cancel-edit-button-${id}">Zrušit</button>
    `;

    document.getElementById(`save-edit-button-${id}`)?.addEventListener("click", () => {
      const name = (document.getElementById(`edit-name-${id}`) as HTMLInputElement).value;
      const description = (document.getElementById(`edit-description-${id}`) as HTMLTextAreaElement).value;
      const isActive = (document.getElementById(`edit-active-${id}`) as HTMLInputElement).checked;

      const editedService: UpdateService = { id, name, description, isActive };

      updateService(editedService).then(() => {
        refreshServicesList();
      });
    });

    document.getElementById(`cancel-edit-button-${id}`)?.addEventListener("click", () => {
      editorContainer.innerHTML = "";
    }

);
    document.getElementById(`entitytypes-btn-${id}`)?.addEventListener("click", () => {
      editorContainer.innerHTML = "";
    });
  });
}
// Formulář pro mazani konkretni sluzby
function renderServiceDeleteForm(id: number) {
  const deleteContainer = document.getElementById(`delete-${id}`);
  if (!deleteContainer) return;

  loadServices().then(services => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    deleteContainer.innerHTML = `
      <h4>Potvrzeni mazani:</h4>
      <label id="delete-name-${id}" value="${service.name}"></label><br>
      <label> Opravdu chcete smazat sluzbu: ${service.name} </label>
      <button id="delete-button-${id}">Smazat</button>
      <button id="cancel-delete-button-${id}">Zrušit</button>
    `;

    document.getElementById(`delete-button-${id}`)?.addEventListener("click", () => {
      deleteService(service.id).then(() => {
        refreshServicesList();
      });
    });

    document.getElementById(`cancel-delete-button-${id}`)?.addEventListener("click", () => {
      deleteContainer.innerHTML = "";
    }

);
  });
}

// Detail služby (pro router)
export function renderServiceDetail(id: number, container: HTMLElement) {
  loadServices().then(services => {
    const service = services.find(s => s.id === id);
    if (!service) {
      container.innerHTML = "<p>Služba nenalezena.</p>";
      return;
    }

    container.innerHTML = `
      <h2>Jméno služby: ${service.name}</h2>
      <h5>Popis:</h5>${service.description ?? "Nezadán"}
      <h5>Datum založení:</h5>${service.createdAt 
        ? new Date(service.createdAt as string).toLocaleString('cs-CZ')
        : 'Neznámé'}
      <hr>
      <a href="#services#${service.id}#entitytypes" class="btn btn-secondary">Typy entit</a>
    `;

    refreshEntityTypesList(service.id, container);
  });
}
