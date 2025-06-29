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
import { currentUserRoles } from '../app.js'; // uprav cestu k aktuálnímu uložení
export function renderEntityTypeTab(serviceId, container) {
    var _a;
    container.innerHTML = `
    <h2>Seznam typů entit</h2>
    <div id="entityType-list" style="margin-bottom:2em;"></div>
    ${currentUserRoles.includes("Admin")
        ? `<div><button id="new-entityType-button" class="button">Nový typ entity</button></div>
           <div id="new-entityType-editor"></div>`
        : ""}
  `;
    if (currentUserRoles.includes("Admin")) {
        let open = false;
        (_a = document.getElementById("new-entityType-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            open = !open;
            const editor = document.getElementById("new-entityType-editor");
            if (editor) {
                if (open) {
                    renderEntityTypeForm(serviceId, editor, () => {
                        open = false;
                    });
                }
                else {
                    editor.innerHTML = "";
                }
            }
        });
    }
    refreshEntityTypesList(serviceId);
}
export function refreshEntityTypesList(serviceId) {
    const listContainer = document.getElementById("entityType-list");
    if (!listContainer)
        return;
    loadEntityTypes(serviceId).then(entityTypes => {
        listContainer.innerHTML = "";
        if (entityTypes.length === 0) {
            listContainer.innerHTML = "<p>Žádné typy entit.</p>";
            return;
        }
        entityTypes.forEach(entityType => {
            const canEdit = currentUserRoles.includes("Admin");
            const item = document.createElement("div");
            item.classList.add("editor-block", "animated-fadein");
            item.style.marginBottom = "1.2em";
            item.innerHTML = `
        <div style="font-size:1.22em; font-weight:700; margin-bottom:0.6em;">
          ${entityType.name}
        </div>
        <div style="margin-bottom:0.5em;">
          <strong>Popis:</strong> ${entityType.description ? entityType.description : "<i>Nezadán</i>"}
        </div>
        <div style="margin-bottom:0.5em;">
          <strong>Datum založení:</strong>
          ${entityType.createdAt ? new Date(entityType.createdAt).toLocaleString('cs-CZ') : 'Neznámé'}
        </div>
        <div style="margin-bottom:0.5em;">
          <strong>Poznámky povoleny:</strong>
          <span style="color:${entityType.auditable ? '#7da308' : '#b38d0e'}">
            ${entityType.auditable ? "Ano" : "Ne"}
          </span>
        </div>
        <div style="margin-bottom:0.8em;">
          ${canEdit ? `<button data-id="${entityType.id}" class="button edit-btn">Edit</button>` : ""}
          ${canEdit ? `<button data-id="${entityType.id}" class="button danger delete-btn">Smazat</button>` : ""}
          <button data-id="${entityType.id}" class="button secondary detail-btn">Detail typu</button>
        </div>
        <div id="editor-${entityType.id}" class="inline-editor"></div>
        <div id="delete-${entityType.id}" class="inline-delete"></div>
      `;
            listContainer.appendChild(item);
        });
        if (currentUserRoles.includes("Admin")) {
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
                        renderEntityTypeEditForm(serviceId, id, editorContainer);
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
                        renderEntityTypeDeleteForm(serviceId, id, deleteContainer);
                    }
                });
            });
        }
        document.querySelectorAll(".detail-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                window.location.hash = `#services#${serviceId}#entitytypes#${id}`;
            });
        });
    });
}
function renderEntityTypeForm(serviceId, editorContainer, onClose) {
    var _a, _b;
    if (!currentUserRoles.includes("Admin")) {
        alert("Nemáte oprávnění vytvářet typy entit.");
        return;
    }
    editorContainer.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:380px;">
      <h3 style="margin-top:0;">Nový typ entity</h3>
      <form>
        <div style="margin-bottom:1.1em;">
          <label style="font-weight:600;display:block;margin-bottom:0.3em;">Název:</label>
          <input id="entityType-name" placeholder="Název typu entity" required class="input-lg" style="width:100%;">
        </div>
        <div style="margin-bottom:1.1em;">
          <label style="font-weight:600;display:block;margin-bottom:0.3em;">Popis:</label>
          <textarea id="entityType-description" placeholder="Popis" class="input-lg" style="width:100%;"></textarea>
        </div>
        <div style="margin-bottom:1.1em;">
          <label>
            <input type="checkbox" id="entityType-auditable" checked>
            Tento typ entity umožňuje poznámky
          </label>
        </div>
        <div style="margin-top:1.1em;display:flex;gap:1em;">
          <button id="save-entityType-button" type="button" class="button">Uložit</button>
          <button id="cancel-entityType-button" type="button" class="button secondary">Zrušit</button>
        </div>
      </form>
    </div>
  `;
    (_a = document.getElementById("save-entityType-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const name = document.getElementById("entityType-name").value;
        if (!name) {
            alert("Název typu entity nesmí být prázdný!");
            return;
        }
        const description = document.getElementById("entityType-description").value;
        const auditable = document.getElementById("entityType-auditable").checked;
        const newEntityType = {
            name,
            description,
            serviceId,
            visible: true,
            editable: true,
            exportable: true,
            auditable
        };
        createEntityType(serviceId, newEntityType).then(() => {
            refreshEntityTypesList(serviceId);
            renderMainNavigation({ CollapseState: true });
            editorContainer.innerHTML = "";
            if (onClose)
                onClose();
        });
    });
    (_b = document.getElementById("cancel-entityType-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        editorContainer.innerHTML = "";
        if (onClose)
            onClose();
    });
}
function renderEntityTypeEditForm(serviceId, id, editorContainer) {
    if (!currentUserRoles.includes("Admin")) {
        alert("Nemáte oprávnění upravovat typy entit.");
        return;
    }
    loadEntityTypes(serviceId).then(entityTypes => {
        var _a, _b, _c;
        const entityType = entityTypes.find(e => e.id === id);
        if (!entityType)
            return;
        editorContainer.innerHTML = `
      <div class="editor-block animated-fadein" style="max-width:380px;">
        <h4>Editace typu entity</h4>
        <div style="margin-bottom:1.1em;">
          <label style="font-weight:600;display:block;margin-bottom:0.3em;">Název:</label>
          <input id="edit-name-${id}" value="${entityType.name}" class="input-lg" style="width:100%;">
        </div>
        <div style="margin-bottom:1.1em;">
          <label style="font-weight:600;display:block;margin-bottom:0.3em;">Popis:</label>
          <textarea id="edit-description-${id}" class="input-lg" style="width:100%;">${(_a = entityType.description) !== null && _a !== void 0 ? _a : ""}</textarea>
        </div>
        <div style="margin-bottom:1.1em;">
          <label>
            <input type="checkbox" id="edit-auditable-${id}" ${entityType.auditable ? "checked" : ""}>
            Tento typ entity umožňuje poznámky
          </label>
        </div>
        <div style="margin-top:1.1em;display:flex;gap:1em;">
          <button id="save-edit-button-${id}" type="button" class="button">Uložit změny</button>
          <button id="cancel-edit-button-${id}" type="button" class="button secondary">Zrušit</button>
        </div>
      </div>
    `;
        (_b = document.getElementById(`save-edit-button-${id}`)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            const name = document.getElementById(`edit-name-${id}`).value;
            const description = document.getElementById(`edit-description-${id}`).value;
            const auditable = document.getElementById(`edit-auditable-${id}`).checked;
            const updatedEntityType = {
                id,
                serviceId,
                name,
                description,
                visible: true,
                editable: true,
                exportable: true,
                auditable
            };
            updateEntityType(serviceId, id, updatedEntityType).then(() => {
                refreshEntityTypesList(serviceId);
                renderMainNavigation({ CollapseState: true });
                editorContainer.innerHTML = "";
            });
        });
        (_c = document.getElementById(`cancel-edit-button-${id}`)) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            editorContainer.innerHTML = "";
        });
    });
}
function renderEntityTypeDeleteForm(serviceId, id, deleteContainer) {
    if (!currentUserRoles.includes("Admin")) {
        alert("Nemáte oprávnění mazat typy entit.");
        return;
    }
    loadEntityTypes(serviceId).then(entityTypes => {
        var _a, _b;
        const entityType = entityTypes.find(e => e.id === id);
        if (!entityType)
            return;
        deleteContainer.innerHTML = `
      <div class="editor-block animated-fadein" style="max-width:380px;">
        <h4>Potvrzení mazání</h4>
        <div style="margin-bottom:1.2em;">
          Opravdu chcete smazat typ entity: <b>${entityType.name}</b>?
        </div>
        <div style="display:flex;gap:1em;">
          <button id="delete-button-${id}" type="button" class="button danger">Smazat</button>
          <button id="cancel-delete-button-${id}" type="button" class="button secondary">Zrušit</button>
        </div>
      </div>
    `;
        (_a = document.getElementById(`delete-button-${id}`)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            deleteEntityType(serviceId, id).then(() => {
                refreshEntityTypesList(serviceId);
                renderMainNavigation({ CollapseState: true });
                deleteContainer.innerHTML = "";
            });
        });
        (_b = document.getElementById(`cancel-delete-button-${id}`)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            deleteContainer.innerHTML = "";
        });
    });
}
export function renderEntityTypeDetail(serviceId, id, container) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const [entityType, attributeDefinitions] = yield Promise.all([
            loadEntityTypeDetail(serviceId, id),
            loadAttributeDefinitionsByEntityType(serviceId, id)
        ]);
        if (!entityType) {
            container.innerHTML = "<p>Typ Entity nenalezen.</p>";
            return;
        }
        container.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:580px;">
      <h2 style="margin-top:0;">${entityType.name}</h2>
      <div style="margin-bottom:1em;"><strong>Popis:</strong> ${(_a = entityType.description) !== null && _a !== void 0 ? _a : "<i>Nezadán</i>"}</div>
      <div style="margin-bottom:1em;">
        <strong>Poznámky povoleny:</strong>
        <span style="color:${entityType.auditable ? "#7da308" : "#b38d0e"};">${entityType.auditable ? "Ano" : "Ne"}</span>
      </div>
      <div style="margin-bottom:1em;">
        <strong>Datum založení:</strong> ${entityType.createdAt
            ? new Date(entityType.createdAt).toLocaleString('cs-CZ')
            : 'Neznámé'}
      </div>
      <div style="margin-bottom:1.5em;">
        <a href="#services#${entityType.serviceId}#entitytypes#${entityType.id}#attributedefinitions" class="button secondary">Atributy typu entity</a>
        <a href="#services#${entityType.serviceId}#entitytypes#${entityType.id}#entities" class="button secondary" style="margin-left:1.1em;">Entity</a>
      </div>
      <div id="attributes-container" style="margin-top:1.3em;"></div>
    </div>
  `;
        const attributesContainer = container.querySelector("#attributes-container");
        if (!attributeDefinitions || attributeDefinitions.length === 0) {
            attributesContainer.innerHTML = "<p>Žádné atributy.</p>";
            return;
        }
        attributesContainer.innerHTML = attributeDefinitions.map(attributeDefinition => `
    <div style="margin-bottom:0.85em;">
      <strong>${attributeDefinition.name}</strong>
      <span style="margin-left:1em;font-size:0.97em;color:#95702c;">${attributeDefinition.attributeType}</span>
      <span style="margin-left:1.1em;color:${attributeDefinition.isRequired ? "#7da308" : "#b38d0e"};">
        ${attributeDefinition.isRequired ? "Povinný" : "Nepovinný"}
      </span>
    </div>
  `).join("");
    });
}
