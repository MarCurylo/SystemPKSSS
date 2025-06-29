import { Entity, EntityAttributeValue } from "./entitiesModel.js";
import { AttributeDefinition } from "../AttributeDefinitions/attributeDefinitionsModel.js";
import { loadEntitiesByEntityType, createEntity, loadEntityDetail, updateEntity } from "./entitiesApi.js";
import { loadAttributeDefinitionsByEntityType } from "../AttributeDefinitions/attributeDefinitionsApi.js";
import { loadEntityType } from "../entityTypes/entityTypesApi.js";
import { loadTagsByService } from "../Tags/tagsApi.js";
import { loadEntityTags, createEntityTagLink, deleteEntityTagLink } from "../Tags/entityTagsApi.js";
import { currentUserRoles } from "../app.js";

// --- HLAVNÍ VIEW / TAB ENTIT ---
export function renderEntityTap(serviceId: number, entityTypeId: number, container: HTMLElement) {
  container.innerHTML = `
    <h2 style="margin-bottom:1.2em;">Seznam entit</h2>
    <div style="display:flex;gap:2.2em;align-items:flex-start;">
      <div style="flex:1;min-width:320px;max-width:600px;">
        ${currentUserRoles.includes("Admin")
          ? `<div style="margin-bottom:1.3em;">
               <button id="new-entity-button" class="button">Nová entita</button>
             </div>`
          : ""}
        <div id="entity-list"></div>
        <div id="entity-editor"></div>
      </div>
      <div id="entity-detail-panel" style="flex:1.2;min-width:330px;max-width:670px;position:relative;"></div>
    </div>
  `;

  loadAttributeDefinitionsByEntityType(serviceId, entityTypeId).then((attributeDefinitions: AttributeDefinition[]) => {
    if (currentUserRoles.includes("Admin")) {
      document.getElementById("new-entity-button")?.addEventListener("click", () => {
        renderEntityForm(serviceId, entityTypeId, {}, attributeDefinitions, () => {
          refreshEntityList(serviceId, entityTypeId, attributeDefinitions);
          const editor = document.getElementById("entity-editor");
          if (editor) editor.innerHTML = "";
        });
      });
    }
    refreshEntityList(serviceId, entityTypeId, attributeDefinitions);
  });
}

// --- VÝPIS ENTIT ---
let lastOpenedEntityId: number | null = null;

export async function refreshEntityList(
  serviceId: number,
  entityTypeId: number,
  attributeDefinitions: AttributeDefinition[]
) {
  const listContainer = document.getElementById("entity-list");
  if (!listContainer) return;

  const entities = await loadEntitiesByEntityType(serviceId, entityTypeId);

  if (entities.length === 0) {
    listContainer.innerHTML = "<p>Žádné entity pro tento typ zatím neexistují.</p>";
    return;
  }

  listContainer.innerHTML = entities.map(entity => {
    const attributesHtml = attributeDefinitions.map((def: AttributeDefinition) => {
      const valueObj = entity.attributeValues?.find((v: EntityAttributeValue) => v.attributeDefinitionId === def.id);
      let value = "";
      switch (def.attributeType) {
        case "Boolean":
          value = valueObj?.valueBoolean !== undefined
            ? (valueObj.valueBoolean ? "✔️ Ano" : "❌ Ne")
            : "";
          break;
        case "Date":
          value = valueObj?.valueDate
            ? new Date(valueObj.valueDate).toLocaleDateString('cs-CZ')
            : "";
          break;
        case "Number":
          value = valueObj?.valueNumber?.toString() ?? "";
          break;
        case "Enum":
          value = valueObj?.valueString ?? "";
          break;
        default:
          value = valueObj?.valueString ?? "";
      }
      return `
        <tr>
          <td style="font-weight:600; color:#a27808; padding:0.17em 1.2em 0.17em 0;min-width:120px;">${def.displayName}</td>
          <td style="font-size:1.05em;">${value}</td>
        </tr>
      `;
    }).join("");

    return `
      <div class="editor-block animated-fadein" style="margin-bottom:1.1em;max-width:520px;">
        <div style="display:flex;align-items:center;margin-bottom:0.7em;">
          <span style="color:#a27808;font-weight:700;letter-spacing:0.02em;">ID:</span>
          <span style="margin-left:0.5em;">${entity.id}</span>
          <button class="entity-detail-btn button" data-entity-id="${entity.id}" style="margin-left:auto;">Detail</button>
        </div>
        <table style="border:none; background:transparent; box-shadow:none; font-size:1.08em; margin-bottom:0; width:auto;">
          <tbody>
            ${attributesHtml}
          </tbody>
        </table>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".entity-detail-btn").forEach(btn => {
    btn.addEventListener("click", (e: any) => {
      const entityId = parseInt(e.target.dataset.entityId);
      const detailPanel = document.getElementById("entity-detail-panel")!;
      if (lastOpenedEntityId === entityId) {
        detailPanel.innerHTML = "";
        lastOpenedEntityId = null;
      } else {
        renderEntityDetail(serviceId, entityTypeId, entityId, detailPanel);
        lastOpenedEntityId = entityId;
      }
    });
  });
}

// --- FORMULÁŘ NOVÉ ENTITY ---
export function renderEntityForm(
  serviceId: number,
  entityTypeId: number,
  entity: Partial<Entity>,
  attributeDefinitions: AttributeDefinition[],
  onSuccess?: () => void
) {
  if (!currentUserRoles.includes("Admin")) {
    alert("Nemáte oprávnění vytvářet entity.");
    return;
  }
  const editorContainer = document.getElementById("entity-editor");
  if (!editorContainer) return;

  const fieldsHtml = attributeDefinitions
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(def => {
      switch (def.attributeType) {
        case "Boolean":
          return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="checkbox" id="attr-${def.id}" class="styled-checkbox"></label>`;
        case "Enum":
          const options = def.enumValues?.map(opt => `<option value="${opt.value}">${opt.value}</option>`).join("") ?? "";
          return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <select id="attr-${def.id}" class="input-lg">${options}</select></label>`;
        case "Date":
          return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="date" id="attr-${def.id}" class="input-lg"></label>`;
        case "Number":
          return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="number" id="attr-${def.id}" class="input-lg"></label>`;
        default:
          return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="text" id="attr-${def.id}" placeholder="${def.displayName}" class="input-lg"></label>`;
      }
    })
    .join("");

  editorContainer.innerHTML = /*html*/`
    <div class="editor-block animated-fadein" style="max-width:480px;padding:1.7em 2em;">
      <h3 style="margin-top:0;">Nová entita</h3>
      <form id="entity-form">
        ${fieldsHtml}
        <div style="display:flex;justify-content:flex-end;gap:1em;margin-top:1.3em;">
          <button type="submit" id="save-entity-button" class="button">Uložit</button>
          <button type="button" id="cancel-entity-button" class="button secondary">Zrušit</button>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById("entity-form") as HTMLFormElement;
  form.onsubmit = async (e) => {
    e.preventDefault();

    const attributeValues: EntityAttributeValue[] = [];
    for (const def of attributeDefinitions) {
      const element = document.getElementById(`attr-${def.id}`) as HTMLInputElement | HTMLSelectElement;
      switch (def.attributeType) {
        case "Boolean":
          attributeValues.push({
            attributeDefinitionId: def.id,
            valueBoolean: (element as HTMLInputElement).checked
          });
          break;
        case "Date":
          attributeValues.push(
            element.value
              ? { attributeDefinitionId: def.id, valueDate: new Date(element.value).toISOString() }
              : { attributeDefinitionId: def.id }
          );
          break;
        case "Number":
          attributeValues.push(
            element.value
              ? { attributeDefinitionId: def.id, valueNumber: Number(element.value) }
              : { attributeDefinitionId: def.id }
          );
          break;
        case "Enum":
          attributeValues.push(
            element.value
              ? { attributeDefinitionId: def.id, valueString: element.value }
              : { attributeDefinitionId: def.id }
          );
          break;
        default:
          attributeValues.push(
            element.value
              ? { attributeDefinitionId: def.id, valueString: element.value }
              : { attributeDefinitionId: def.id }
          );
      }
    }

    await createEntity(serviceId, entityTypeId, { attributeValues });

    if (onSuccess) onSuccess();
    editorContainer.innerHTML = "";
  };

  document.getElementById("cancel-entity-button")?.addEventListener("click", () => {
    editorContainer.innerHTML = "";
  });
}

// --- EDITACE ENTITY ---
function renderEntityEditForm(
  serviceId: number,
  entityTypeId: number,
  entity: Entity,
  attributeDefinitions: AttributeDefinition[],
  container: HTMLElement
) {
  const editContainerId = "entity-edit-form-container";
  let editContainer = document.getElementById(editContainerId);
  if (!editContainer) {
    editContainer = document.createElement("div");
    editContainer.id = editContainerId;
    container.appendChild(editContainer);
  }

  const fieldsHtml = attributeDefinitions
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(def => {
      const attr = entity.attributeValues?.find(a => a.attributeDefinitionId === def.id);

      switch (def.attributeType) {
        case "Boolean":
          return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="checkbox" id="edit-attr-${def.id}" class="styled-checkbox" ${attr?.valueBoolean ? "checked" : ""}></label>`;
        case "Enum":
          const options = def.enumValues?.map(opt =>
            `<option value="${opt.value}" ${attr?.valueString === opt.value ? "selected" : ""}>${opt.value}</option>`
          ).join("") ?? "";
          return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <select id="edit-attr-${def.id}" class="input-lg">${options}</select></label>`;
        case "Date":
          const dateVal = attr?.valueDate ? new Date(attr.valueDate).toISOString().slice(0,10) : "";
          return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="date" id="edit-attr-${def.id}" class="input-lg" value="${dateVal}"></label>`;
        case "Number":
          return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="number" id="edit-attr-${def.id}" class="input-lg" value="${attr?.valueNumber ?? ""}"></label>`;
        default:
          return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="text" id="edit-attr-${def.id}" placeholder="${def.displayName}" class="input-lg" value="${attr?.valueString ?? ""}"></label>`;
      }
    })
    .join("");

  editContainer.innerHTML = /*html*/`
    <div class="editor-block animated-fadein" style="max-width:480px;padding:1.7em 2em;margin:2em auto;">
      <h3 style="margin-top:0;">Upravit entitu</h3>
      <form id="entity-edit-form">
        ${fieldsHtml}
        <div style="display:flex;justify-content:flex-end;gap:1em;margin-top:1.3em;">
          <button type="submit" id="save-entity-edit-btn" class="button">Uložit změny</button>
          <button type="button" id="cancel-entity-edit-btn" class="button secondary">Zrušit</button>
        </div>
      </form>
      <div id="entity-edit-error" style="color:red; margin-top:1em;"></div>
    </div>
  `;

  const form = document.getElementById("entity-edit-form") as HTMLFormElement;
  const errorDiv = document.getElementById("entity-edit-error");
  form.onsubmit = async (e) => {
    e.preventDefault();
    if (errorDiv) errorDiv.textContent = "";
    const attributeValues: EntityAttributeValue[] = [];
    for (const def of attributeDefinitions) {
      const element = document.getElementById(`edit-attr-${def.id}`) as HTMLInputElement | HTMLSelectElement;
      switch (def.attributeType) {
        case "Boolean":
          attributeValues.push({
            attributeDefinitionId: def.id,
            valueBoolean: (element as HTMLInputElement).checked
          });
          break;
        case "Date":
          attributeValues.push(
            element.value
              ? { attributeDefinitionId: def.id, valueDate: new Date(element.value).toISOString() }
              : { attributeDefinitionId: def.id }
          );
          break;
        case "Number":
          attributeValues.push(
            element.value
              ? { attributeDefinitionId: def.id, valueNumber: Number(element.value) }
              : { attributeDefinitionId: def.id }
          );
          break;
        case "Enum":
          attributeValues.push(
            element.value
              ? { attributeDefinitionId: def.id, valueString: element.value }
              : { attributeDefinitionId: def.id }
          );
          break;
        default:
          attributeValues.push(
            element.value
              ? { attributeDefinitionId: def.id, valueString: element.value }
              : { attributeDefinitionId: def.id }
          );
      }
    }

    try {
      await updateEntity(serviceId, entityTypeId, entity.id, { attributeValues });
      editContainer.innerHTML = "";
      await renderEntityDetail(serviceId, entityTypeId, entity.id, container);
    } catch (err) {
      if (errorDiv) errorDiv.textContent = (err as Error).message ?? "Chyba při ukládání.";
    }
  };

  document.getElementById("cancel-entity-edit-btn")?.addEventListener("click", () => {
    editContainer.innerHTML = "";
  });
}

// --- DETAIL ENTITY ---
export async function renderEntityDetail(
  serviceId: number,
  entityTypeId: number,
  entityId: number,
  container: HTMLElement
) {
  let entity;
  try {
    entity = await loadEntityDetail(serviceId, entityTypeId, entityId);
  } catch {
    container.innerHTML = "<p>Entitu se nepodařilo načíst.</p>";
    return;
  }

  const attributeDefinitions: AttributeDefinition[] = await loadAttributeDefinitionsByEntityType(serviceId, entityTypeId);
  const entityType = await loadEntityType(serviceId, entityTypeId);

  let attributesHtml = "";
  if (entity.attributeValues && entity.attributeValues.length > 0) {
    attributesHtml = entity.attributeValues.map(attr => {
      const def = attributeDefinitions.find(d => d.id === attr.attributeDefinitionId);
      let value = attr.valueString ?? attr.valueNumber ?? attr.valueBoolean ?? attr.valueDate ?? "";
      if (def?.attributeType === "Date" && attr.valueDate) {
        value = new Date(attr.valueDate).toLocaleDateString("cs-CZ");
      }
      if (def?.attributeType === "Boolean" && typeof attr.valueBoolean === "boolean") {
        value = attr.valueBoolean ? "✔️ Ano" : "❌ Ne";
      }
      return `
        <tr>
          <td style="font-weight:600;color:#a27808;min-width:130px;padding:0.17em 1.2em 0.17em 0;">${def ? def.displayName : attr.attributeDefinitionId}</td>
          <td style="font-size:1.05em;">${value}</td>
        </tr>
      `;
    }).join("");
    attributesHtml = `<table style="border:none; background:transparent; box-shadow:none; font-size:1.08em; margin-bottom:0; margin-top:0.6em;"><tbody>${attributesHtml}</tbody></table>`;
  } else {
    attributesHtml = "<i>Žádné hodnoty atributů</i>";
  }

  const isSplit = container.id === "entity-detail-panel";

  container.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:600px;padding:2em 2.2em;margin:0 auto;position:relative;">
      ${isSplit ? `<button id="close-entity-detail-btn" title="Zavřít detail" style="position:absolute;top:1.1em;right:1.1em;font-size:1.5em; background:none; border:none; color:#b3a373; cursor:pointer;">×</button>` : ""}
      <h3 style="margin-top:0;">Detail entity ${entityId}</h3>
      <div style="color:#95702c;margin-bottom:0.6em;">
        <b>Datum vytvoření:</b> ${entity.createdAt ? new Date(entity.createdAt).toLocaleString("cs-CZ") : "-"}
      </div>
      ${attributesHtml}
      <div style="margin-top:1.7em;margin-bottom:1.2em;display:flex;gap:1em;">
        ${
          entityType.auditable
            ? `<button id="show-notes-btn" class="button secondary">Zápisy</button>`
            : `<i style="color:#888;">Tento typ entity nemá zápisy povoleny.</i>`
        }
        ${
          currentUserRoles.includes("Admin")
            ? `<button id="edit-entity-btn" class="button">Upravit</button>`
            : ""
        }
      </div>
      <h4 style="margin-top:2em;margin-bottom:0.6em;">Tagy</h4>
      <div id="entity-tags-container"></div>
      <div style="margin-top:0.5em;">
        <button id="add-tag-btn" class="button secondary" style="font-size:0.99em;">Přidat tag</button>
      </div>
      <div id="add-tag-form-container" style="display:none; margin-top: 1em;"></div>
    </div>
    <div id="entity-edit-form-container"></div>
  `;

  if (isSplit) {
    document.getElementById("close-entity-detail-btn")?.addEventListener("click", () => {
      container.innerHTML = "";
      lastOpenedEntityId = null;
    });
  }

  const editBtn = document.getElementById("edit-entity-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      renderEntityEditForm(serviceId, entityTypeId, entity, attributeDefinitions, container);
    });
  }

  if (entityType.auditable) {
    const notesBtn = document.getElementById("show-notes-btn");
    notesBtn?.addEventListener("click", () => {
      window.location.hash = `#services#${serviceId}#entitytypes#${entityTypeId}#entities#${entityId}#notes`;
    });
  }

  // --- Tagy ---
  const tagsContainer = document.getElementById("entity-tags-container")!;
  const addTagBtn = document.getElementById("add-tag-btn")!;
  const addTagFormContainer = document.getElementById("add-tag-form-container")!;

  async function refreshEntityTags() {
    try {
      const entityTags = await loadEntityTags(serviceId, entityId);
      const allTags = await loadTagsByService(serviceId);

      if (entityTags.length === 0) {
        tagsContainer.innerHTML = `<span style="color:#999;">Žádné tagy.</span>`;
      } else {
        tagsContainer.innerHTML = `
          <div style="display:flex;flex-wrap:wrap;gap:0.5em 0.9em;">
            ${entityTags.map(link => {
              const tag = allTags.find(t => t.id === link.tagId);
              if (!tag) return "";
              return `
                <span style="display:inline-flex;align-items:center; background:${tag.color}; color:#fff; font-weight:600; padding:6px 20px; border-radius:0.8em; box-shadow:0 2px 8px 0 rgba(140,120,0,0.07); font-size:1.02em;">
                  ${tag.name}
                  <button data-link-id="${link.id}" class="remove-tag-btn" title="Odebrat" style="margin-left:0.5em;background:none;border:none;color:#fff;font-size:1.15em;cursor:pointer;">×</button>
                </span>
              `;
            }).join("")}
          </div>
        `;
      }

      tagsContainer.querySelectorAll(".remove-tag-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const btnEl = e.currentTarget as HTMLElement;
          const linkId = Number(btnEl.dataset.linkId);
          if (confirm("Opravdu odebrat tag?")) {
            try {
              await deleteEntityTagLink(serviceId, entityId, linkId);
              await refreshEntityTags();
            } catch {
              alert("Chyba při odstraňování tagu.");
            }
          }
        });
      });
    } catch {
      tagsContainer.innerHTML = "<span style='color:red;'>Chyba při načítání tagů.</span>";
    }
  }

  await refreshEntityTags();

  addTagBtn.addEventListener("click", async () => {
    addTagFormContainer.style.display = "block";
    addTagFormContainer.innerHTML = `
      <div style="display:flex;align-items:center;gap:1em;">
        <select id="select-tag" class="input-lg" style="width:170px;">
          <option value="">Vyber tag</option>
        </select>
        <button id="confirm-add-tag" class="button" style="font-size:0.98em;">Přidat</button>
        <button id="cancel-add-tag" class="button secondary" style="font-size:0.98em;">Zrušit</button>
      </div>
      <div id="tag-error" style="color:red; margin-top:0.5em;"></div>
    `;

    const selectTag = document.getElementById("select-tag") as HTMLSelectElement;
    const confirmAddBtn = document.getElementById("confirm-add-tag") as HTMLButtonElement;
    const cancelAddBtn = document.getElementById("cancel-add-tag") as HTMLButtonElement;
    const tagErrorDiv = document.getElementById("tag-error") as HTMLElement;

    try {
      const allTags = await loadTagsByService(serviceId);
      allTags.forEach(tag => {
        const option = document.createElement("option");
        option.value = tag.id.toString();
        option.textContent = tag.name;
        selectTag.appendChild(option);
      });
    } catch {
      tagErrorDiv.textContent = "Chyba při načítání tagů.";
    }

    confirmAddBtn.addEventListener("click", async () => {
      tagErrorDiv.textContent = "";
      const selectedTagId = Number(selectTag.value);
      if (!selectedTagId) {
        tagErrorDiv.textContent = "Vyberte tag.";
        return;
      }

      try {
        await createEntityTagLink(serviceId, entityId, { entityId, tagId: selectedTagId });
        addTagFormContainer.style.display = "none";
        addTagFormContainer.innerHTML = "";
        await refreshEntityTags();
      } catch {
        tagErrorDiv.textContent = "Chyba při přidávání tagu.";
      }
    });

    cancelAddBtn.addEventListener("click", () => {
      addTagFormContainer.style.display = "none";
      addTagFormContainer.innerHTML = "";
    });
  });
}
