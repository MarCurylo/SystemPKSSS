import {
  loadEntityTypes,
  createEntityType,
  deleteEntityType,
  updateEntityType,
  loadEntityType as loadEntityTypeDetail,
} from './entityTypesApi.js';
import { EntityType, NewEntityType, UpdateEntityType } from './entityTypesModel.js';
import { loadAttributeDefinitionsByEntityType } from '../AttributeDefinitions/attributeDefinitionsApi.js';
import { renderMainNavigation } from '../core/Navigation.js';
import { currentUserRoles } from '../app.js'; // uprav cestu k aktuálnímu uložení

export function renderEntityTypeTab(serviceId: number, container: HTMLElement) {
  container.innerHTML = `
    <h2>Seznam typů entit</h2>
    <div id="entityType-list" style="margin-bottom:2em;"></div>
    ${
      currentUserRoles.includes("Admin")
        ? `<div><button id="new-entityType-button" class="button">Nový typ entity</button></div>
           <div id="new-entityType-editor"></div>`
        : ""
    }
  `;

  if (currentUserRoles.includes("Admin")) {
    let open = false;
    document.getElementById("new-entityType-button")?.addEventListener("click", () => {
      open = !open;
      const editor = document.getElementById("new-entityType-editor");
      if (editor) {
        if (open) {
          renderEntityTypeForm(serviceId, editor, () => {
            open = false;
          });
        } else {
          editor.innerHTML = "";
        }
      }
    });
  }

  refreshEntityTypesList(serviceId);
}

export function refreshEntityTypesList(serviceId: number) {
  const listContainer = document.getElementById("entityType-list");
  if (!listContainer) return;

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
          ${entityType.createdAt ? new Date(entityType.createdAt as string).toLocaleString('cs-CZ') : 'Neznámé'}
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
        btn.addEventListener("click", (e: any) => {
          const id = parseInt(e.target.dataset.id);
          const editorContainer = document.getElementById(`editor-${id}`);
          if (!editorContainer) return;
          if (editorContainer.innerHTML.trim() !== "") {
            editorContainer.innerHTML = "";
          } else {
            renderEntityTypeEditForm(serviceId, id, editorContainer);
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
            renderEntityTypeDeleteForm(serviceId, id, deleteContainer);
          }
        });
      });
    }

    document.querySelectorAll(".detail-btn").forEach(btn => {
      btn.addEventListener("click", (e: any) => {
        const id = parseInt(e.target.dataset.id);
        window.location.hash = `#services#${serviceId}#entitytypes#${id}`;
      });
    });
  });
}

function renderEntityTypeForm(serviceId: number, editorContainer: HTMLElement, onClose?: () => void) {
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

  document.getElementById("save-entityType-button")?.addEventListener("click", () => {
    const name = (document.getElementById("entityType-name") as HTMLInputElement).value;
    if (!name){
      alert("Název typu entity nesmí být prázdný!");
      return;
    }
    const description = (document.getElementById("entityType-description") as HTMLTextAreaElement).value;
    const auditable = (document.getElementById("entityType-auditable") as HTMLInputElement).checked;

    const newEntityType: NewEntityType = { 
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
      if (onClose) onClose();
    });
  });

  document.getElementById("cancel-entityType-button")?.addEventListener("click", () => {
    editorContainer.innerHTML = "";
    if (onClose) onClose();
  });
}

function renderEntityTypeEditForm(serviceId: number, id: number, editorContainer: HTMLElement) {
  if (!currentUserRoles.includes("Admin")) {
    alert("Nemáte oprávnění upravovat typy entit.");
    return;
  }

  loadEntityTypes(serviceId).then(entityTypes => {
    const entityType = entityTypes.find(e => e.id === id);
    if (!entityType) return;

    editorContainer.innerHTML = `
      <div class="editor-block animated-fadein" style="max-width:380px;">
        <h4>Editace typu entity</h4>
        <div style="margin-bottom:1.1em;">
          <label style="font-weight:600;display:block;margin-bottom:0.3em;">Název:</label>
          <input id="edit-name-${id}" value="${entityType.name}" class="input-lg" style="width:100%;">
        </div>
        <div style="margin-bottom:1.1em;">
          <label style="font-weight:600;display:block;margin-bottom:0.3em;">Popis:</label>
          <textarea id="edit-description-${id}" class="input-lg" style="width:100%;">${entityType.description ?? ""}</textarea>
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

    document.getElementById(`save-edit-button-${id}`)?.addEventListener("click", () => {
      const name = (document.getElementById(`edit-name-${id}`) as HTMLInputElement).value;
      const description = (document.getElementById(`edit-description-${id}`) as HTMLTextAreaElement).value;
      const auditable = (document.getElementById(`edit-auditable-${id}`) as HTMLInputElement).checked;

      const updatedEntityType: UpdateEntityType = {
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

    document.getElementById(`cancel-edit-button-${id}`)?.addEventListener("click", () => {
      editorContainer.innerHTML = "";
    });
  });
}

function renderEntityTypeDeleteForm(serviceId: number, id: number, deleteContainer: HTMLElement) {
  if (!currentUserRoles.includes("Admin")) {
    alert("Nemáte oprávnění mazat typy entit.");
    return;
  }

  loadEntityTypes(serviceId).then(entityTypes => {
    const entityType = entityTypes.find(e => e.id === id);
    if (!entityType) return;

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

    document.getElementById(`delete-button-${id}`)?.addEventListener("click", () => {
      deleteEntityType(serviceId, id).then(() => {
        refreshEntityTypesList(serviceId);
        renderMainNavigation({ CollapseState: true });
        deleteContainer.innerHTML = "";
      });
    });

    document.getElementById(`cancel-delete-button-${id}`)?.addEventListener("click", () => {
      deleteContainer.innerHTML = "";
    });
  });
}

export async function renderEntityTypeDetail(serviceId: number, id: number, container: HTMLElement) {
  const [entityType, attributeDefinitions] = await Promise.all([
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
      <div style="margin-bottom:1em;"><strong>Popis:</strong> ${entityType.description ?? "<i>Nezadán</i>"}</div>
      <div style="margin-bottom:1em;">
        <strong>Poznámky povoleny:</strong>
        <span style="color:${entityType.auditable ? "#7da308" : "#b38d0e"};">${entityType.auditable ? "Ano" : "Ne"}</span>
      </div>
      <div style="margin-bottom:1em;">
        <strong>Datum založení:</strong> ${entityType.createdAt 
          ? new Date(entityType.createdAt as string).toLocaleString('cs-CZ')
          : 'Neznámé'}
      </div>
      <div style="margin-bottom:1.5em;">
        <a href="#services#${entityType.serviceId}#entitytypes#${entityType.id}#attributedefinitions" class="button secondary">Atributy typu entity</a>
        <a href="#services#${entityType.serviceId}#entitytypes#${entityType.id}#entities" class="button secondary" style="margin-left:1.1em;">Entity</a>
      </div>
      <div id="attributes-container" style="margin-top:1.3em;"></div>
    </div>
  `;

  const attributesContainer = container.querySelector("#attributes-container") as HTMLElement;
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
}
