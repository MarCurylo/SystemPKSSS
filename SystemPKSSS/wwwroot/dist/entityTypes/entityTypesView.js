var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadEntityTypes, createEntityType, deleteEntityType, updateEntityType, loadEntityType as loadEntityTypeDetail, } from './entityTypesApi.js';
import { loadAttributeDefinitionsByEntityType } from '../AttributeDefinitions/attributeDefinitionsApi.js';
import { renderMainNavigation } from '../core/Navigation.js';
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
    loadEntityTypes(serviceId).then(entityTypes => {
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
          <button data-id="${entityType.id}" class="detail-btn">Detail Entity</button>
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
        document.querySelectorAll(".detail-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                window.location.hash = `#services#${serviceId}#entitytypes#${id}`;
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
    <form>
      <input id="entityType-name" placeholder="Název typu entity" required><br>
      <textarea id="entityType-description" placeholder="Popis"></textarea><br>
      <button id="save-entityType-button" type="button">Uložit</button>
      <button id="cancel-entityType-button" type="button">Zrušit</button>
    </form>
  `;
    (_a = document.getElementById("save-entityType-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const name = document.getElementById("entityType-name").value;
        if (!name) {
            alert("název typy entity nesmi byt prazdny!");
            return;
        }
        const description = document.getElementById("entityType-description").value;
        const newEntityType = {
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
            renderMainNavigation({ CollapseState: true });
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
    loadEntityTypes(serviceId).then(entityTypes => {
        var _a, _b, _c;
        const entityType = entityTypes.find(e => e.id === id);
        if (!entityType)
            return;
        editorContainer.innerHTML = `
      <h4>Editace:</h4>
      <input id="edit-name-${id}" value="${entityType.name}"><br>
      <textarea id="edit-description-${id}">${(_a = entityType.description) !== null && _a !== void 0 ? _a : ""}</textarea><br>
      <button id="save-edit-button-${id}" type="button">Uložit změny</button>
      <button id="cancel-edit-button-${id}" type="button">Zrušit</button>
    `;
        (_b = document.getElementById(`save-edit-button-${id}`)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            const name = document.getElementById(`edit-name-${id}`).value;
            const description = document.getElementById(`edit-description-${id}`).value;
            const updatedEntityType = {
                id,
                serviceId,
                name,
                description,
                visible: true,
                editable: true,
                exportable: true,
                auditable: true
            };
            updateEntityType(serviceId, id, updatedEntityType).then(() => {
                refreshEntityTypesList(serviceId);
                renderMainNavigation({ CollapseState: true });
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
    loadEntityTypes(serviceId).then(entityTypes => {
        var _a, _b;
        const entityType = entityTypes.find(e => e.id === id);
        if (!entityType)
            return;
        deleteContainer.innerHTML = `
      <h4>Potvrzení mazání:</h4>
      Opravdu chcete smazat typ entity: <b>${entityType.name}</b>?<br>
      <button id="delete-button-${id}" type="button">Smazat</button>
      <button id="cancel-delete-button-${id}" type="button">Zrušit</button>
    `;
        (_a = document.getElementById(`delete-button-${id}`)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            deleteEntityType(serviceId, id).then(() => {
                refreshEntityTypesList(serviceId);
                renderMainNavigation({ CollapseState: true });
            });
        });
        (_b = document.getElementById(`cancel-delete-button-${id}`)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            deleteContainer.innerHTML = "";
        });
    });
}
// Detail typu entity (pro router)
export function renderEntityTypeDetail(serviceId, id, container) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // Nejprve načti vše paralelně
        const [entityType, attributeDefinitions] = yield Promise.all([
            loadEntityTypeDetail(serviceId, id),
            loadAttributeDefinitionsByEntityType(serviceId, id)
        ]);
        if (!entityType) {
            container.innerHTML = "<p>Typ Entity nenalezen.</p>";
            return;
        }
        container.innerHTML = `
    <h2>Jméno typu Entity: ${entityType.name}</h2>
    <h5>Popis:</h5>${(_a = entityType.description) !== null && _a !== void 0 ? _a : "Nezadán"}
    <h5>Datum založení:</h5>${entityType.createdAt
            ? new Date(entityType.createdAt).toLocaleString('cs-CZ')
            : 'Neznámé'}
    <a href="#services#${entityType.serviceId}#entitytypes#${entityType.id}#attributedefinitions" class="btn btn-secondary">Atributy typu entity</a>
    <div id="attributes-container"></div>
        <a href="#services#${entityType.serviceId}#entitytypes#${entityType.id}#entities" class="btn btn-secondary">Entity</a>
    <div id="attributes-container"></div>
  `;
        const attributesContainer = container.querySelector("#attributes-container");
        if (attributeDefinitions.length === 0) {
            attributesContainer.innerHTML = "<p>Žádné atributy.</p>";
            return;
        }
        attributeDefinitions.forEach(attributeDefinition => {
            const item = document.createElement("div");
            item.innerHTML = `
      <b>${attributeDefinition.name}</b><br>
      <b>${attributeDefinition.attributeType}</b><br>
      <b>${!attributeDefinition.isRequired ? `neni aktivni` : `je aktivni`} </b>
      <hr>
    `;
            attributesContainer.appendChild(item);
        });
    });
}
