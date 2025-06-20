import { loadAttributeDefinitionsByEntityType, createAttributeDefinition } from "./attributeDefinitionsApi";
import { ATTRIBUTE_TYPE_OPTIONS } from "./attributeDefinitionsModel";
// Vstupní funkce pro zobrazeni rozhrani pro entity
export function renderAttributeDefinitionTab(serviceId, entityTypeId, container) {
    var _a;
    container.innerHTML = `
    <h2>Seznam Vlastností entity</h2>
    <div id="attributeDefinition-list"></div>
    <button id="new-attributeDefinition-button">Nový Typ Vlastnosti</button>
  `;
    (_a = document.getElementById("attributeDefinition-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        renderAttributeDefinitionForm(serviceId, entityTypeId);
    });
    refreshAttributeDefinitionList(serviceId, entityTypeId);
}
// Vykreslení vlastnosti v typu entity ve službě
export function refreshAttributeDefinitionList(serviceId, entityTypeId) {
    const listContainer = document.getElementById("attributeDefinition-list");
    if (!listContainer)
        return;
    loadAttributeDefinitionsByEntityType(serviceId, entityTypeId).then(attributeDefinitions => {
        listContainer.innerHTML = "";
        attributeDefinitions.forEach(attributeDefinition => {
            console.log("Loaded attribute definitions:", attributeDefinitions);
            const item = document.createElement("div");
            item.innerHTML = `
        <div>
          <b>${attributeDefinition.name}</b><br>
         <b> ${attributeDefinition.attributeType}</b><br> 
        <b>${!attributeDefinition.isRequired ? `neni aktivni` : `je aktivni`} </b>
        </div>
        <hr>
      `;
            listContainer.appendChild(item);
        });
    });
}
// Formulář pro přidání nové definice vlastnosti
function renderAttributeDefinitionForm(serviceId, entityTypeId, onSuccess) {
    var _a;
    const editorContainer = document.getElementById("new-attributeDefinition-button");
    if (!editorContainer)
        return;
    // Generuj select s možnostmi typů vlastností
    const optionsHtml = ATTRIBUTE_TYPE_OPTIONS.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join("");
    editorContainer.innerHTML = /*html*/ `
    <h3>Nová vlastnost</h3>
    <form id="attribute-definition-form">
      <input id="attributeDefinition-name" placeholder="Název vlastnosti" required><br>
      <label for="attributeDefinition-attributeType">Typ vlastnosti:</label>
      <select id="attributeDefinition-attributeType" required>
        <option value="">--vyber typ--</option>
        ${optionsHtml}
      </select><br>
      <textarea id="attributeDefinition-description" placeholder="Popis"></textarea><br>
      <button type="submit" id="save-attributeDefinition-button">Uložit</button>
      <button type="button" id="cancel-attributeDefinition-button">Zrušit</button>
    </form>
  `;
    const form = document.getElementById("attribute-definition-form");
    form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById("attributeDefinition-name").value.trim();
        const attributeType = document.getElementById("attributeDefinition-attributeType").value;
        const description = document.getElementById("attributeDefinition-description").value.trim();
        if (!name || !attributeType) {
            alert("Vyplňte název a typ vlastnosti!");
            return;
        }
        // Model pro API (přidej další vlastnosti dle potřeby)
        const newAttributeDefinition = {
            entityTypeId,
            name,
            attributeType,
            isRequired: false,
            orderIndex: 0,
        };
        createAttributeDefinition(serviceId, entityTypeId, newAttributeDefinition)
            .then(() => {
            if (onSuccess)
                onSuccess();
            editorContainer.innerHTML = "";
        });
    };
    (_a = document.getElementById("cancel-attributeDefinition-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        editorContainer.innerHTML = "";
    });
}
