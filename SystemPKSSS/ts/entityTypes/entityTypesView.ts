import { loadEntityTypes, createEntityType, deleteEntityType, loadEntityTypesByService, updateEntityType } from './entityTypesApi.js';
import { EntityType, NewEntityType, UpdateEntityType } from './entityTypesModel.js';

// Vstupní funkce pro zobrazeni rozhrani pro entity
export function renderEntityTypeTab(serviceId: number, container: HTMLElement) {
  container.innerHTML = `
    <h2>Seznam Typů Entit</h2>
    <div id="entityType-list"></div>
    <div id="new-entityType-editor"></div>
    <button id="new-entityType-button">Nový Typ Entity</button>
  `;

  document.getElementById("new-entityType-button")?.addEventListener("click", () => {
    renderEntityTypeForm(serviceId);
  });

  refreshEntityTypesList(serviceId);
}

// Vykreslení entit ve službě
export function refreshEntityTypesList(serviceId: number) {
  const listContainer = document.getElementById("entityType-list");
  if (!listContainer) return;
  
  loadEntityTypesByService(serviceId).then(entityTypes => {
    listContainer.innerHTML = "";
    
    entityTypes.forEach(entityType => {
      console.log("Loaded entity types:", entityTypes);
      const item = document.createElement("div");

      item.innerHTML = `
        <div>
          <b>${entityType.name}</b><br>
          ${entityType.description ? `Popis: ${entityType.description}<br>` : ""} 
          Vytvořeno: ${entityType.createdAt 
            ? new Date(entityType.createdAt as string).toLocaleString('cs-CZ') 
            : 'Neznámé'}<br>

          <button data-id="${entityType.id}" class="edit-btn">Edit</button>
          <button data-id="${entityType.id}" class="delete-btn">Smazat</button>
          <div id="editor-${entityType.id}" class="inline-editor"></div>
          <div id="delete-${entityType.id}" class="inline-delete"></div>
        </div>
        <hr>
      `;

      listContainer.appendChild(item);
    });

    // Eventy:
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e: any) => {
        const id = parseInt(e.target.dataset.id);
        const editorContainer = document.getElementById(`editor-${id}`);
        if (!editorContainer) return;

        if (editorContainer.innerHTML.trim() !== "") {
          editorContainer.innerHTML = "";
        } else {
          renderEntityTypeEditForm(serviceId, id);
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
          renderEntityTypeDeleteForm(serviceId, id);
        }
      });
    });
  });
}

// Formulář pro přidání nové entityType
function renderEntityTypeForm(serviceId: number) {
  const editorContainer = document.getElementById("new-entityType-editor");
  if (!editorContainer) return;

  editorContainer.innerHTML = `
    <h3>Nový Typ Entity</h3>
    <input id="entityType-name" placeholder="Název typu entity"><br>
    <textarea id="entityType-description" placeholder="Popis"></textarea><br>
    <button id="save-entityType-button">Uložit</button>
    <button id="cancel-entityType-button">Zrušit</button>
  `;

  document.getElementById("save-entityType-button")?.addEventListener("click", () => {
    const name = (document.getElementById("entityType-name") as HTMLInputElement).value;
    const description = (document.getElementById("entityType-description") as HTMLTextAreaElement).value;

  const newEntityType: NewEntityType = { 
  name, 
  description, 
  serviceId,
  visible: true,
  editable: true,
  exportable: true,
  auditable: true
};


    createEntityType(serviceId, newEntityType).then(() => {
      refreshEntityTypesList(serviceId);
      editorContainer.innerHTML = "";
    });
  });

  document.getElementById("cancel-entityType-button")?.addEventListener("click", () => {
    editorContainer.innerHTML = "";
  });
}

// Inline edit formulář
function renderEntityTypeEditForm(serviceId: number, id: number) {
  const editorContainer = document.getElementById(`editor-${id}`);
  if (!editorContainer) return;

  loadEntityTypesByService(serviceId).then(entityTypes => {
    const entityType = entityTypes.find(e => e.id === id);
    if (!entityType) return;

    editorContainer.innerHTML = `
      <h4>Editace:</h4>
      <input id="edit-name-${id}" value="${entityType.name}"><br>
      <textarea id="edit-description-${id}">${entityType.description ?? ""}</textarea><br>
      <button id="save-edit-button-${id}">Uložit změny</button>
      <button id="cancel-edit-button-${id}">Zrušit</button>
    `;

    document.getElementById(`save-edit-button-${id}`)?.addEventListener("click", () => {
      const name = (document.getElementById(`edit-name-${id}`) as HTMLInputElement).value;
      const description = (document.getElementById(`edit-description-${id}`) as HTMLTextAreaElement).value;

      const updatedEntityType: UpdateEntityType = { id, serviceId, name, description,  visible: true,
  editable: true,
  exportable: true,
  auditable: true };

      updateEntityType(serviceId, updatedEntityType).then(() => {
        refreshEntityTypesList(serviceId);
      });
    });

    document.getElementById(`cancel-edit-button-${id}`)?.addEventListener("click", () => {
      editorContainer.innerHTML = "";
    });
  });
}

// Inline delete formulář
function renderEntityTypeDeleteForm(serviceId: number, id: number) {
  const deleteContainer = document.getElementById(`delete-${id}`);
  if (!deleteContainer) return;

  loadEntityTypesByService(serviceId).then(entityTypes => {
    const entityType = entityTypes.find(e => e.id === id);
    if (!entityType) return;

    deleteContainer.innerHTML = `
      <h4>Potvrzení mazání:</h4>
      Opravdu chcete smazat typ entity: <b>${entityType.name}</b>?<br>
      <button id="delete-button-${id}">Smazat</button>
      <button id="cancel-delete-button-${id}">Zrušit</button>
    `;

    document.getElementById(`delete-button-${id}`)?.addEventListener("click", () => {
      deleteEntityType(id).then(() => {
        refreshEntityTypesList(serviceId);
      });
    });

    document.getElementById(`cancel-delete-button-${id}`)?.addEventListener("click", () => {
      deleteContainer.innerHTML = "";
    });
  });
}
