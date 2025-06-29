var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadEntitiesByEntityType, createEntity, loadEntityDetail, updateEntity } from "./entitiesApi.js";
import { loadAttributeDefinitionsByEntityType } from "../AttributeDefinitions/attributeDefinitionsApi.js";
import { loadEntityType } from "../entityTypes/entityTypesApi.js";
import { loadTagsByService } from "../Tags/tagsApi.js";
import { loadEntityTags, createEntityTagLink, deleteEntityTagLink } from "../Tags/entityTagsApi.js";
import { currentUserRoles } from "../app.js";
// --- HLAVNÍ VIEW / TAB ENTIT ---
export function renderEntityTap(serviceId, entityTypeId, container) {
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
    loadAttributeDefinitionsByEntityType(serviceId, entityTypeId).then((attributeDefinitions) => {
        var _a;
        if (currentUserRoles.includes("Admin")) {
            (_a = document.getElementById("new-entity-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                renderEntityForm(serviceId, entityTypeId, {}, attributeDefinitions, () => {
                    refreshEntityList(serviceId, entityTypeId, attributeDefinitions);
                    const editor = document.getElementById("entity-editor");
                    if (editor)
                        editor.innerHTML = "";
                });
            });
        }
        refreshEntityList(serviceId, entityTypeId, attributeDefinitions);
    });
}
// --- VÝPIS ENTIT ---
let lastOpenedEntityId = null;
export function refreshEntityList(serviceId, entityTypeId, attributeDefinitions) {
    return __awaiter(this, void 0, void 0, function* () {
        const listContainer = document.getElementById("entity-list");
        if (!listContainer)
            return;
        const entities = yield loadEntitiesByEntityType(serviceId, entityTypeId);
        if (entities.length === 0) {
            listContainer.innerHTML = "<p>Žádné entity pro tento typ zatím neexistují.</p>";
            return;
        }
        listContainer.innerHTML = entities.map(entity => {
            const attributesHtml = attributeDefinitions.map((def) => {
                var _a, _b, _c, _d, _e;
                const valueObj = (_a = entity.attributeValues) === null || _a === void 0 ? void 0 : _a.find((v) => v.attributeDefinitionId === def.id);
                let value = "";
                switch (def.attributeType) {
                    case "Boolean":
                        value = (valueObj === null || valueObj === void 0 ? void 0 : valueObj.valueBoolean) !== undefined
                            ? (valueObj.valueBoolean ? "✔️ Ano" : "❌ Ne")
                            : "";
                        break;
                    case "Date":
                        value = (valueObj === null || valueObj === void 0 ? void 0 : valueObj.valueDate)
                            ? new Date(valueObj.valueDate).toLocaleDateString('cs-CZ')
                            : "";
                        break;
                    case "Number":
                        value = (_c = (_b = valueObj === null || valueObj === void 0 ? void 0 : valueObj.valueNumber) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "";
                        break;
                    case "Enum":
                        value = (_d = valueObj === null || valueObj === void 0 ? void 0 : valueObj.valueString) !== null && _d !== void 0 ? _d : "";
                        break;
                    default:
                        value = (_e = valueObj === null || valueObj === void 0 ? void 0 : valueObj.valueString) !== null && _e !== void 0 ? _e : "";
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
            btn.addEventListener("click", (e) => {
                const entityId = parseInt(e.target.dataset.entityId);
                const detailPanel = document.getElementById("entity-detail-panel");
                if (lastOpenedEntityId === entityId) {
                    detailPanel.innerHTML = "";
                    lastOpenedEntityId = null;
                }
                else {
                    renderEntityDetail(serviceId, entityTypeId, entityId, detailPanel);
                    lastOpenedEntityId = entityId;
                }
            });
        });
    });
}
// --- FORMULÁŘ NOVÉ ENTITY ---
export function renderEntityForm(serviceId, entityTypeId, entity, attributeDefinitions, onSuccess) {
    var _a;
    if (!currentUserRoles.includes("Admin")) {
        alert("Nemáte oprávnění vytvářet entity.");
        return;
    }
    const editorContainer = document.getElementById("entity-editor");
    if (!editorContainer)
        return;
    const fieldsHtml = attributeDefinitions
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(def => {
        var _a, _b;
        switch (def.attributeType) {
            case "Boolean":
                return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="checkbox" id="attr-${def.id}" class="styled-checkbox"></label>`;
            case "Enum":
                const options = (_b = (_a = def.enumValues) === null || _a === void 0 ? void 0 : _a.map(opt => `<option value="${opt.value}">${opt.value}</option>`).join("")) !== null && _b !== void 0 ? _b : "";
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
    editorContainer.innerHTML = /*html*/ `
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
    const form = document.getElementById("entity-form");
    form.onsubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const attributeValues = [];
        for (const def of attributeDefinitions) {
            const element = document.getElementById(`attr-${def.id}`);
            switch (def.attributeType) {
                case "Boolean":
                    attributeValues.push({
                        attributeDefinitionId: def.id,
                        valueBoolean: element.checked
                    });
                    break;
                case "Date":
                    attributeValues.push(element.value
                        ? { attributeDefinitionId: def.id, valueDate: new Date(element.value).toISOString() }
                        : { attributeDefinitionId: def.id });
                    break;
                case "Number":
                    attributeValues.push(element.value
                        ? { attributeDefinitionId: def.id, valueNumber: Number(element.value) }
                        : { attributeDefinitionId: def.id });
                    break;
                case "Enum":
                    attributeValues.push(element.value
                        ? { attributeDefinitionId: def.id, valueString: element.value }
                        : { attributeDefinitionId: def.id });
                    break;
                default:
                    attributeValues.push(element.value
                        ? { attributeDefinitionId: def.id, valueString: element.value }
                        : { attributeDefinitionId: def.id });
            }
        }
        yield createEntity(serviceId, entityTypeId, { attributeValues });
        if (onSuccess)
            onSuccess();
        editorContainer.innerHTML = "";
    });
    (_a = document.getElementById("cancel-entity-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        editorContainer.innerHTML = "";
    });
}
// --- EDITACE ENTITY ---
function renderEntityEditForm(serviceId, entityTypeId, entity, attributeDefinitions, container) {
    var _a;
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
        var _a, _b, _c, _d, _e;
        const attr = (_a = entity.attributeValues) === null || _a === void 0 ? void 0 : _a.find(a => a.attributeDefinitionId === def.id);
        switch (def.attributeType) {
            case "Boolean":
                return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="checkbox" id="edit-attr-${def.id}" class="styled-checkbox" ${(attr === null || attr === void 0 ? void 0 : attr.valueBoolean) ? "checked" : ""}></label>`;
            case "Enum":
                const options = (_c = (_b = def.enumValues) === null || _b === void 0 ? void 0 : _b.map(opt => `<option value="${opt.value}" ${(attr === null || attr === void 0 ? void 0 : attr.valueString) === opt.value ? "selected" : ""}>${opt.value}</option>`).join("")) !== null && _c !== void 0 ? _c : "";
                return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <select id="edit-attr-${def.id}" class="input-lg">${options}</select></label>`;
            case "Date":
                const dateVal = (attr === null || attr === void 0 ? void 0 : attr.valueDate) ? new Date(attr.valueDate).toISOString().slice(0, 10) : "";
                return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="date" id="edit-attr-${def.id}" class="input-lg" value="${dateVal}"></label>`;
            case "Number":
                return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="number" id="edit-attr-${def.id}" class="input-lg" value="${(_d = attr === null || attr === void 0 ? void 0 : attr.valueNumber) !== null && _d !== void 0 ? _d : ""}"></label>`;
            default:
                return `<label style="display:block;margin-bottom:0.8em;"><span style="font-weight:600;">${def.displayName}:</span> <input type="text" id="edit-attr-${def.id}" placeholder="${def.displayName}" class="input-lg" value="${(_e = attr === null || attr === void 0 ? void 0 : attr.valueString) !== null && _e !== void 0 ? _e : ""}"></label>`;
        }
    })
        .join("");
    editContainer.innerHTML = /*html*/ `
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
    const form = document.getElementById("entity-edit-form");
    const errorDiv = document.getElementById("entity-edit-error");
    form.onsubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        e.preventDefault();
        if (errorDiv)
            errorDiv.textContent = "";
        const attributeValues = [];
        for (const def of attributeDefinitions) {
            const element = document.getElementById(`edit-attr-${def.id}`);
            switch (def.attributeType) {
                case "Boolean":
                    attributeValues.push({
                        attributeDefinitionId: def.id,
                        valueBoolean: element.checked
                    });
                    break;
                case "Date":
                    attributeValues.push(element.value
                        ? { attributeDefinitionId: def.id, valueDate: new Date(element.value).toISOString() }
                        : { attributeDefinitionId: def.id });
                    break;
                case "Number":
                    attributeValues.push(element.value
                        ? { attributeDefinitionId: def.id, valueNumber: Number(element.value) }
                        : { attributeDefinitionId: def.id });
                    break;
                case "Enum":
                    attributeValues.push(element.value
                        ? { attributeDefinitionId: def.id, valueString: element.value }
                        : { attributeDefinitionId: def.id });
                    break;
                default:
                    attributeValues.push(element.value
                        ? { attributeDefinitionId: def.id, valueString: element.value }
                        : { attributeDefinitionId: def.id });
            }
        }
        try {
            yield updateEntity(serviceId, entityTypeId, entity.id, { attributeValues });
            editContainer.innerHTML = "";
            yield renderEntityDetail(serviceId, entityTypeId, entity.id, container);
        }
        catch (err) {
            if (errorDiv)
                errorDiv.textContent = (_a = err.message) !== null && _a !== void 0 ? _a : "Chyba při ukládání.";
        }
    });
    (_a = document.getElementById("cancel-entity-edit-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        editContainer.innerHTML = "";
    });
}
// --- DETAIL ENTITY ---
export function renderEntityDetail(serviceId, entityTypeId, entityId, container) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let entity;
        try {
            entity = yield loadEntityDetail(serviceId, entityTypeId, entityId);
        }
        catch (_b) {
            container.innerHTML = "<p>Entitu se nepodařilo načíst.</p>";
            return;
        }
        const attributeDefinitions = yield loadAttributeDefinitionsByEntityType(serviceId, entityTypeId);
        const entityType = yield loadEntityType(serviceId, entityTypeId);
        let attributesHtml = "";
        if (entity.attributeValues && entity.attributeValues.length > 0) {
            attributesHtml = entity.attributeValues.map(attr => {
                var _a, _b, _c, _d;
                const def = attributeDefinitions.find(d => d.id === attr.attributeDefinitionId);
                let value = (_d = (_c = (_b = (_a = attr.valueString) !== null && _a !== void 0 ? _a : attr.valueNumber) !== null && _b !== void 0 ? _b : attr.valueBoolean) !== null && _c !== void 0 ? _c : attr.valueDate) !== null && _d !== void 0 ? _d : "";
                if ((def === null || def === void 0 ? void 0 : def.attributeType) === "Date" && attr.valueDate) {
                    value = new Date(attr.valueDate).toLocaleDateString("cs-CZ");
                }
                if ((def === null || def === void 0 ? void 0 : def.attributeType) === "Boolean" && typeof attr.valueBoolean === "boolean") {
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
        }
        else {
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
        ${entityType.auditable
            ? `<button id="show-notes-btn" class="button secondary">Zápisy</button>`
            : `<i style="color:#888;">Tento typ entity nemá zápisy povoleny.</i>`}
        ${currentUserRoles.includes("Admin")
            ? `<button id="edit-entity-btn" class="button">Upravit</button>`
            : ""}
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
            (_a = document.getElementById("close-entity-detail-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
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
            notesBtn === null || notesBtn === void 0 ? void 0 : notesBtn.addEventListener("click", () => {
                window.location.hash = `#services#${serviceId}#entitytypes#${entityTypeId}#entities#${entityId}#notes`;
            });
        }
        // --- Tagy ---
        const tagsContainer = document.getElementById("entity-tags-container");
        const addTagBtn = document.getElementById("add-tag-btn");
        const addTagFormContainer = document.getElementById("add-tag-form-container");
        function refreshEntityTags() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const entityTags = yield loadEntityTags(serviceId, entityId);
                    const allTags = yield loadTagsByService(serviceId);
                    if (entityTags.length === 0) {
                        tagsContainer.innerHTML = `<span style="color:#999;">Žádné tagy.</span>`;
                    }
                    else {
                        tagsContainer.innerHTML = `
          <div style="display:flex;flex-wrap:wrap;gap:0.5em 0.9em;">
            ${entityTags.map(link => {
                            const tag = allTags.find(t => t.id === link.tagId);
                            if (!tag)
                                return "";
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
                        btn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                            const btnEl = e.currentTarget;
                            const linkId = Number(btnEl.dataset.linkId);
                            if (confirm("Opravdu odebrat tag?")) {
                                try {
                                    yield deleteEntityTagLink(serviceId, entityId, linkId);
                                    yield refreshEntityTags();
                                }
                                catch (_a) {
                                    alert("Chyba při odstraňování tagu.");
                                }
                            }
                        }));
                    });
                }
                catch (_a) {
                    tagsContainer.innerHTML = "<span style='color:red;'>Chyba při načítání tagů.</span>";
                }
            });
        }
        yield refreshEntityTags();
        addTagBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
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
            const selectTag = document.getElementById("select-tag");
            const confirmAddBtn = document.getElementById("confirm-add-tag");
            const cancelAddBtn = document.getElementById("cancel-add-tag");
            const tagErrorDiv = document.getElementById("tag-error");
            try {
                const allTags = yield loadTagsByService(serviceId);
                allTags.forEach(tag => {
                    const option = document.createElement("option");
                    option.value = tag.id.toString();
                    option.textContent = tag.name;
                    selectTag.appendChild(option);
                });
            }
            catch (_a) {
                tagErrorDiv.textContent = "Chyba při načítání tagů.";
            }
            confirmAddBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                tagErrorDiv.textContent = "";
                const selectedTagId = Number(selectTag.value);
                if (!selectedTagId) {
                    tagErrorDiv.textContent = "Vyberte tag.";
                    return;
                }
                try {
                    yield createEntityTagLink(serviceId, entityId, { entityId, tagId: selectedTagId });
                    addTagFormContainer.style.display = "none";
                    addTagFormContainer.innerHTML = "";
                    yield refreshEntityTags();
                }
                catch (_a) {
                    tagErrorDiv.textContent = "Chyba při přidávání tagu.";
                }
            }));
            cancelAddBtn.addEventListener("click", () => {
                addTagFormContainer.style.display = "none";
                addTagFormContainer.innerHTML = "";
            });
        }));
    });
}
