var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadAttributeDefinitionsByEntityType, createAttributeDefinition, patchIsDisplayName, 
// +++ přidáme import, pokud existuje API pro mazání:
deleteAttributeDefinition } from "./attributeDefinitionsApi.js";
import { ATTRIBUTE_TYPE_OPTIONS } from "./attributeDefinitionsModel.js";
import { currentUserRoles } from "../app.js";
// Hlavní tab - seznam vlastností
export function renderAttributeDefinitionTab(serviceId, entityTypeId, container) {
    var _a;
    container.innerHTML = `
    <h2>Seznam vlastností entity</h2>
    <div id="attributeDefinition-list" style="margin-bottom:2em;"></div>
    ${currentUserRoles.includes("Admin")
        ? `<div><button id="new-attributeDefinition-button" class="button">Nový typ vlastnosti</button></div>
           <div id="new-attributeDefinition-editor"></div>`
        : ""}
  `;
    if (currentUserRoles.includes("Admin")) {
        let open = false;
        (_a = document.getElementById("new-attributeDefinition-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            open = !open;
            const editor = document.getElementById("new-attributeDefinition-editor");
            if (editor) {
                if (open) {
                    renderAttributeDefinitionForm(serviceId, entityTypeId, editor, () => {
                        open = false;
                    });
                }
                else {
                    editor.innerHTML = "";
                }
            }
        });
    }
    refreshAttributeDefinitionList(serviceId, entityTypeId);
}
// Výpis všech attribute definitions (každý v editor-block stylu)
export function refreshAttributeDefinitionList(serviceId, entityTypeId) {
    const listContainer = document.getElementById("attributeDefinition-list");
    if (!listContainer)
        return;
    loadAttributeDefinitionsByEntityType(serviceId, entityTypeId).then(attributeDefinitions => {
        listContainer.innerHTML = "";
        if (attributeDefinitions.length === 0) {
            listContainer.innerHTML = `<p>Žádné vlastnosti nejsou definovány.</p>`;
            return;
        }
        attributeDefinitions.forEach(attributeDefinition => {
            const canEdit = currentUserRoles.includes("Admin");
            const item = document.createElement("div");
            item.classList.add("editor-block", "animated-fadein");
            item.style.marginBottom = "1.2em";
            item.innerHTML = `
        <div style="display:flex;align-items:flex-start;gap:1.3em;">
          <div style="flex:1;">
            <div style="font-size:1.10em; font-weight:700;">
              ${attributeDefinition.name}
              <span style="margin-left:0.8em;font-size:0.98em;color:#95702c;">${attributeDefinition.attributeType}</span>
            </div>
            <div style="margin-top:0.6em;">
              <label style="font-weight:500;display:flex;align-items:center;gap:0.55em;">
                <input 
                  type="checkbox"
                  class="styled-checkbox display-as-name-checkbox"
                  data-attr-id="${attributeDefinition.id}"
                  data-entity-type-id="${attributeDefinition.entityTypeId}"
                  ${attributeDefinition.isDisplayName ? "checked" : ""}
                  ${canEdit ? "" : "disabled"}
                >
                <span style="font-size:0.98em;">Zobrazit jako jméno</span>
              </label>
              ${canEdit ? `
                <button data-id="${attributeDefinition.id}" class="button danger delete-attr-btn" style="margin-left:1em;">Smazat</button>
              ` : ""}
            </div>
          </div>
        </div>
      `;
            listContainer.appendChild(item);
        });
        // Max. 2 checked logika
        function enforceMaxTwoChecked() {
            if (!listContainer)
                return;
            const allCheckboxes = Array.from(listContainer.querySelectorAll(".display-as-name-checkbox"));
            const checkedCount = allCheckboxes.filter(cb => cb.checked).length;
            allCheckboxes.forEach(cb => {
                var _a, _b;
                if (!cb.checked && checkedCount >= 2) {
                    cb.disabled = true;
                    (_a = cb.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add("disabled");
                }
                else {
                    if (currentUserRoles.includes("Admin")) {
                        cb.disabled = false;
                        (_b = cb.parentElement) === null || _b === void 0 ? void 0 : _b.classList.remove("disabled");
                    }
                }
            });
        }
        if (currentUserRoles.includes("Admin")) {
            // Checkbox - změna displayName
            listContainer.querySelectorAll(".display-as-name-checkbox").forEach(cb => {
                cb.addEventListener("change", () => __awaiter(this, void 0, void 0, function* () {
                    const attrId = Number(cb.getAttribute("data-attr-id"));
                    const isChecked = cb.checked;
                    try {
                        yield patchIsDisplayName(serviceId, entityTypeId, attrId, isChecked);
                        refreshAttributeDefinitionList(serviceId, entityTypeId);
                    }
                    catch (e) {
                        alert("Chyba při ukládání 'Zobrazit jako jméno': " + e.message);
                    }
                    enforceMaxTwoChecked();
                }));
            });
            // Smazání vlastnosti
            listContainer.querySelectorAll(".delete-attr-btn").forEach(btn => {
                btn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const id = Number(e.target.getAttribute("data-id"));
                    if (confirm("Opravdu chcete tuto vlastnost smazat?")) {
                        try {
                            yield deleteAttributeDefinition(serviceId, entityTypeId, id);
                            refreshAttributeDefinitionList(serviceId, entityTypeId);
                        }
                        catch (err) {
                            alert("Chyba při mazání: " + ((_a = err.message) !== null && _a !== void 0 ? _a : err));
                        }
                    }
                }));
            });
        }
        enforceMaxTwoChecked();
    });
}
// Formulář pro novou vlastnost (bez checkboxu! a s filtrem typů)
function renderAttributeDefinitionForm(serviceId, entityTypeId, editorContainer, onClose) {
    var _a;
    if (!currentUserRoles.includes("Admin")) {
        alert("Nemáte oprávnění přidávat nové vlastnosti.");
        return;
    }
    const blockedTypes = ["Image", "File", "Soubor", "Obrázek"];
    const optionsHtml = ATTRIBUTE_TYPE_OPTIONS
        .filter(opt => !blockedTypes.includes(opt.value) && !blockedTypes.includes(opt.label))
        .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
        .join("");
    editorContainer.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:390px;">
      <h3 style="margin-top:0;">Nová vlastnost</h3>
      <form>
        <div style="margin-bottom:1em;">
          <label style="font-weight:600;display:block;margin-bottom:0.3em;">Název:</label>
          <input id="attributeDefinition-name" placeholder="Název vlastnosti" required class="input-lg">
        </div>
        <div style="margin-bottom:1em;">
          <label style="font-weight:600;display:block;margin-bottom:0.3em;">Typ vlastnosti:</label>
          <select id="attributeDefinition-attributeType" required class="input-lg">
            <option value="">--vyber typ--</option>
            ${optionsHtml}
          </select>
        </div>
        <div style="margin-top:1em;display:flex;gap:1em;">
          <button type="submit" id="save-attributeDefinition-button" class="button">Uložit</button>
          <button type="button" id="cancel-attributeDefinition-button" class="button secondary">Zrušit</button>
        </div>
      </form>
      <div id="enum-values-section" style="margin-top:1.4em;"></div>
    </div>
  `;
    const form = editorContainer.querySelector("form");
    form.onsubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const name = document.getElementById("attributeDefinition-name").value.trim();
        const attributeType = document.getElementById("attributeDefinition-attributeType").value;
        if (!name || !attributeType) {
            alert("Vyplňte název a typ vlastnosti!");
            return;
        }
        const newAttributeDefinition = {
            entityTypeId,
            name,
            displayName: name,
            attributeType,
            isRequired: false,
            orderIndex: 0,
            isDisplayName: false
        };
        try {
            const created = yield createAttributeDefinition(serviceId, entityTypeId, newAttributeDefinition);
            if (attributeType === "Enum" && created && created.id) {
                renderEnumValuesEditor(serviceId, entityTypeId, created.id, () => {
                    refreshAttributeDefinitionList(serviceId, entityTypeId);
                    if (onClose)
                        onClose();
                    editorContainer.innerHTML = "";
                });
            }
            else {
                refreshAttributeDefinitionList(serviceId, entityTypeId);
                if (onClose)
                    onClose();
                editorContainer.innerHTML = "";
            }
        }
        catch (e) {
            alert("Chyba při vytváření atributu: " + e.message);
        }
    });
    (_a = document.getElementById("cancel-attributeDefinition-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        editorContainer.innerHTML = "";
        if (onClose)
            onClose();
    });
}
// Editor enum hodnot (editor-block styl)
function renderEnumValuesEditor(serviceId, entityTypeId, attributeDefinitionId, onFinish) {
    var _a, _b;
    const editorContainer = document.getElementById("enum-values-section");
    if (!editorContainer)
        return;
    editorContainer.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:370px;margin-top:0;">
      <h4 style="margin-top:0;">Možnosti výběru (enum)</h4>
      <div id="enum-values-list" style="margin-bottom:1.1em;"></div>
      <div style="display:flex;gap:1em;">
        <button type="button" id="add-enum-value" class="button secondary" style="min-width:110px;">Přidat možnost</button>
        <button type="button" id="finish-enum-values" class="button">Hotovo</button>
      </div>
    </div>
  `;
    let enumValues = [];
    function renderList() {
        const list = document.getElementById("enum-values-list");
        if (!list)
            return;
        list.innerHTML = "";
        enumValues.forEach((value, idx) => {
            var _a, _b;
            const item = document.createElement("div");
            item.style.display = "flex";
            item.style.alignItems = "center";
            item.style.gap = "0.7em";
            item.style.marginBottom = "0.4em";
            item.innerHTML = `
        <input type="text" value="${value}" placeholder="Možnost ${idx + 1}" class="input-lg" style="max-width:210px;">
        <button type="button" data-idx="${idx}" class="button danger" style="min-width:40px;" title="Smazat">🗑️</button>
      `;
            (_a = item.querySelector("input")) === null || _a === void 0 ? void 0 : _a.addEventListener("input", (e) => {
                enumValues[idx] = e.target.value;
            });
            (_b = item.querySelector("button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
                enumValues.splice(idx, 1);
                renderList();
            });
            list.appendChild(item);
        });
    }
    (_a = document.getElementById("add-enum-value")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        enumValues.push("");
        renderList();
    });
    (_b = document.getElementById("finish-enum-values")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        if (enumValues.length === 0) {
            alert("Musíte zadat alespoň jednu možnost.");
            return;
        }
        if (enumValues.some(x => !x.trim())) {
            alert("Žádná možnost nesmí být prázdná.");
            return;
        }
        try {
            for (let i = 0; i < enumValues.length; i++) {
                yield createAttributeEnumValue(serviceId, entityTypeId, attributeDefinitionId, {
                    id: 0,
                    attributeDefinitionId,
                    value: enumValues[i],
                    displayOrder: i
                });
            }
            if (onFinish)
                onFinish();
        }
        catch (e) {
            alert("Chyba při ukládání možností: " + e.message);
        }
    }));
    enumValues = [""];
    renderList();
}
// POST - enum value
function createAttributeEnumValue(serviceId, entityTypeId, attributeDefinitionId, enumValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/services/${serviceId}/entityTypes/${entityTypeId}/attributeDefinitions/${attributeDefinitionId}/attributeEnumValue`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enumValue)
        });
        if (!response.ok) {
            throw new Error("Failed to create enum value");
        }
        return yield response.json();
    });
}
