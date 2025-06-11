import { createEntityType, deleteEntityType, loadEntityTypesByService, updateEntityType } from './entityTypesApi.js';
// Vstupní funkce pro zobrazeni rozhrani pro entity
export function renderEntityTypeTab(serviceId, container) {
    var _a;
    container.innerHTML = `
    <h2>Seznam Typů Entit</h2>
    <div id="entityType-list"></div>
    <div id="new-entityType-editor"></div>
    <button id="new-entityType-button">Nový Typ Entity</button>
  `;
    (_a = document.getElementById("new-entityType-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        renderEntityTypeForm(serviceId);
    });
    refreshEntityTypesList(serviceId);
}
// Vykreslení entit ve službě
export function refreshEntityTypesList(serviceId) {
    const listContainer = document.getElementById("entityType-list");
    if (!listContainer)
        return;
    loadEntityTypesByService(serviceId).then(entityTypes => {
        listContainer.innerHTML = "";
        entityTypes.forEach(entityType => {
            const item = document.createElement("div");
            item.innerHTML = `
        <div>
          <b>${entityType.name}</b><br>
          ${entityType.description ? `Popis: ${entityType.description}<br>` : ""} 
          Vytvořeno: ${entityType.createdAt
                ? new Date(entityType.createdAt).toLocaleString('cs-CZ')
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
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                const editorContainer = document.getElementById(`editor-${id}`);
                if (!editorContainer)
                    return;
                if (editorContainer.innerHTML.trim() !== "") {
                    editorContainer.innerHTML = "";
                }
                else {
                    renderEntityTypeEditForm(serviceId, id);
                }
            });
        });
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                const deleteContainer = document.getElementById(`delete-${id}`);
                if (!deleteContainer)
                    return;
                if (deleteContainer.innerHTML.trim() !== "") {
                    deleteContainer.innerHTML = "";
                }
                else {
                    renderEntityTypeDeleteForm(serviceId, id);
                }
            });
        });
    });
}
// Formulář pro přidání nové entityType
function renderEntityTypeForm(serviceId) {
    var _a, _b;
    const editorContainer = document.getElementById("new-entityType-editor");
    if (!editorContainer)
        return;
    editorContainer.innerHTML = `
    <h3>Nový Typ Entity</h3>
    <input id="entityType-name" placeholder="Název typu entity"><br>
    <textarea id="entityType-description" placeholder="Popis"></textarea><br>
    <button id="save-entityType-button">Uložit</button>
    <button id="cancel-entityType-button">Zrušit</button>
  `;
    (_a = document.getElementById("save-entityType-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const name = document.getElementById("entityType-name").value;
        const description = document.getElementById("entityType-description").value;
        const newEntityType = { name, description, serviceId };
        createEntityType(serviceId, newEntityType).then(() => {
            refreshEntityTypesList(serviceId);
            editorContainer.innerHTML = "";
        });
    });
    (_b = document.getElementById("cancel-entityType-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        editorContainer.innerHTML = "";
    });
}
// Inline edit formulář
function renderEntityTypeEditForm(serviceId, id) {
    const editorContainer = document.getElementById(`editor-${id}`);
    if (!editorContainer)
        return;
    loadEntityTypesByService(serviceId).then(entityTypes => {
        var _a, _b, _c;
        const entityType = entityTypes.find(e => e.id === id);
        if (!entityType)
            return;
        editorContainer.innerHTML = `
      <h4>Editace:</h4>
      <input id="edit-name-${id}" value="${entityType.name}"><br>
      <textarea id="edit-description-${id}">${(_a = entityType.description) !== null && _a !== void 0 ? _a : ""}</textarea><br>
      <button id="save-edit-button-${id}">Uložit změny</button>
      <button id="cancel-edit-button-${id}">Zrušit</button>
    `;
        (_b = document.getElementById(`save-edit-button-${id}`)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            const name = document.getElementById(`edit-name-${id}`).value;
            const description = document.getElementById(`edit-description-${id}`).value;
            const updatedEntityType = { id, serviceId, name, description };
            updateEntityType(serviceId, updatedEntityType).then(() => {
                refreshEntityTypesList(serviceId);
            });
        });
        (_c = document.getElementById(`cancel-edit-button-${id}`)) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            editorContainer.innerHTML = "";
        });
    });
}
// Inline delete formulář
function renderEntityTypeDeleteForm(serviceId, id) {
    const deleteContainer = document.getElementById(`delete-${id}`);
    if (!deleteContainer)
        return;
    loadEntityTypesByService(serviceId).then(entityTypes => {
        var _a, _b;
        const entityType = entityTypes.find(e => e.id === id);
        if (!entityType)
            return;
        deleteContainer.innerHTML = `
      <h4>Potvrzení mazání:</h4>
      Opravdu chcete smazat typ entity: <b>${entityType.name}</b>?<br>
      <button id="delete-button-${id}">Smazat</button>
      <button id="cancel-delete-button-${id}">Zrušit</button>
    `;
        (_a = document.getElementById(`delete-button-${id}`)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            deleteEntityType(id).then(() => {
                refreshEntityTypesList(serviceId);
            });
        });
        (_b = document.getElementById(`cancel-delete-button-${id}`)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            deleteContainer.innerHTML = "";
        });
    });
}
//# sourceMappingURL=entityTypesView.js.map