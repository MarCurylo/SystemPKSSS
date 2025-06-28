import { loadEntitiesByEntityType, createEntity } from "./entitiesApi.js";
import { loadAttributeDefinitionsByEntityType } from "../AttributeDefinitions/attributeDefinitionsApi.js";
// Zobrazení entit v typu entity
export function renderEntityTap(serviceId, entityTypeId, container) {
    container.innerHTML = `
    <h2>Seznam entit</h2>
    <div id="entity-list"></div>
    <button id="new-entity-button">Nová entita</button>
    <div id="entity-editor"></div>
  `;
    loadAttributeDefinitionsByEntityType(serviceId, entityTypeId).then((attributeDefinitions) => {
        var _a;
        (_a = document.getElementById("new-entity-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            renderEntityForm(serviceId, entityTypeId, {}, attributeDefinitions, () => {
                refreshEntityList(serviceId, entityTypeId, attributeDefinitions);
                const editor = document.getElementById("entity-editor");
                if (editor)
                    editor.innerHTML = "";
            });
        });
        refreshEntityList(serviceId, entityTypeId, attributeDefinitions);
    });
}
// Vykreslení entit ve službě
export function refreshEntityList(serviceId, entityTypeId, attributeDefinitions) {
    const listContainer = document.getElementById("entity-list");
    if (!listContainer)
        return;
    loadEntitiesByEntityType(serviceId, entityTypeId).then((entities) => {
        listContainer.innerHTML = "";
        if (entities.length === 0) {
            listContainer.innerHTML = "<p>Žádné entity pro tento typ zatím neexistují.</p>";
            return;
        }
        entities.forEach(entity => {
            const item = document.createElement("div");
            const attributesHtml = attributeDefinitions
                .map((def) => {
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
                return `<strong>${def.displayName}:</strong> ${value}`;
            })
                .join("<br>");
            item.innerHTML = `
        <div class="mb-3">
          <b>ID:</b> ${entity.id}<br>
          ${attributesHtml}
        </div>
        <hr>
      `;
            listContainer.appendChild(item);
        });
    });
}
export function renderEntityForm(serviceId, entityTypeId, entity, attributeDefinitions, onSuccess) {
    var _a;
    const editorContainer = document.getElementById("entity-editor");
    if (!editorContainer)
        return;
    const fieldsHtml = attributeDefinitions
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(def => {
        var _a, _b;
        switch (def.attributeType) {
            case "Boolean":
                return `<label>${def.displayName}: <input type="checkbox" id="attr-${def.id}"></label><br>`;
            case "Enum":
                const options = (_b = (_a = def.enumValues) === null || _a === void 0 ? void 0 : _a.map(opt => `<option value="${opt.value}">${opt.value}</option>`).join("")) !== null && _b !== void 0 ? _b : "";
                return `<label>${def.displayName}: <select id="attr-${def.id}">${options}</select></label><br>`;
            case "Date":
                return `<label>${def.displayName}: <input type="date" id="attr-${def.id}"></label><br>`;
            case "Number":
                return `<label>${def.displayName}: <input type="number" id="attr-${def.id}"></label><br>`;
            default:
                return `<label>${def.displayName}: <input type="text" id="attr-${def.id}" placeholder="${def.displayName}"></label><br>`;
        }
    })
        .join("");
    editorContainer.innerHTML = /*html*/ `
    <h3>Nová entita</h3>
    <form id="entity-form">
      ${fieldsHtml}
      <button type="submit" id="save-entity-button">Uložit</button>
      <button type="button" id="cancel-entity-button">Zrušit</button>
    </form>
  `;
    const form = document.getElementById("entity-form");
    form.onsubmit = (e) => {
        e.preventDefault();
        const attributeValues = attributeDefinitions.map(def => {
            const element = document.getElementById(`attr-${def.id}`);
            switch (def.attributeType) {
                case "Boolean":
                    return {
                        attributeDefinitionId: def.id,
                        valueBoolean: element.checked
                    };
                case "Date":
                    return element.value
                        ? { attributeDefinitionId: def.id, valueDate: new Date(element.value).toISOString() }
                        : { attributeDefinitionId: def.id };
                case "Number":
                    return element.value
                        ? { attributeDefinitionId: def.id, valueNumber: Number(element.value) }
                        : { attributeDefinitionId: def.id };
                case "Enum":
                    return element.value
                        ? { attributeDefinitionId: def.id, valueString: element.value }
                        : { attributeDefinitionId: def.id };
                default:
                    return element.value
                        ? { attributeDefinitionId: def.id, valueString: element.value }
                        : { attributeDefinitionId: def.id };
            }
        });
        createEntity(serviceId, entityTypeId, { attributeValues }).then(() => {
            if (onSuccess)
                onSuccess();
            editorContainer.innerHTML = "";
        });
    };
    (_a = document.getElementById("cancel-entity-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        editorContainer.innerHTML = "";
    });
}
