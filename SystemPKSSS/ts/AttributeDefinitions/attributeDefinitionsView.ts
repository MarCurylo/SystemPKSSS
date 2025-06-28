import { renderMainNavigation } from "../core/Navigation.js";
import { loadAttributeDefinitionsByEntityType, createAttributeDefinition } from "./attributeDefinitionsApi.js";
import { AttributeDefinition, NewAttributeDefinition} from "./attributeDefinitionsModel.js";
import {  ATTRIBUTE_TYPE_OPTIONS, AttributeDataType } from "./attributeDefinitionsModel.js";

// Vstupní funkce pro zobrazeni rozhrani pro entity
export function renderAttributeDefinitionTab(serviceId: number, entityTypeId: number, container: HTMLElement) {
  container.innerHTML = `
    <h2>Seznam vlastností entity</h2>
    <div id="attributeDefinition-list"></div>
    <button id="new-attributeDefinition-button">Nový typ vlastnosti</button>
    <div id="attributeDefinition-editor"></div>
  `;

  document.getElementById("new-attributeDefinition-button")?.addEventListener("click", () => {
    renderAttributeDefinitionForm(serviceId, entityTypeId, () => {
      refreshAttributeDefinitionList(serviceId, entityTypeId);
      // Po uložení skryj editor
      const editor = document.getElementById("attributeDefinition-editor");
      if (editor) editor.innerHTML = "";
    });
  });

  refreshAttributeDefinitionList(serviceId, entityTypeId);
}

// Vykreslení vlastnosti v typu entity ve službě
export function refreshAttributeDefinitionList(serviceId: number, entityTypeId: number) {
  const listContainer = document.getElementById("attributeDefinition-list");
  if (!listContainer) return;
  
  loadAttributeDefinitionsByEntityType(serviceId, entityTypeId).then(attributeDefinitions => {
    listContainer.innerHTML = "";
    
    attributeDefinitions.forEach(attributeDefinition => {
      console.log("Loaded attribute definitions:", attributeDefinitions);
      const item = document.createElement("div");

      item.innerHTML = `
        <div>
          <b>${attributeDefinition.name}</b><br>
         <b> ${attributeDefinition.attributeType}</b><br> 
        <b>${!attributeDefinition.isRequired ? `neni povinný` : `je povinný`} </b>
        </div>
        <hr>
      `;

      listContainer.appendChild(item);
    });
  });
}



function renderAttributeDefinitionForm(serviceId: number, entityTypeId: number, onSuccess?: () => void) {
  const editorContainer = document.getElementById("attributeDefinition-editor");
  if (!editorContainer) return;

  // Generuj select s možnostmi typů vlastností
  const optionsHtml = ATTRIBUTE_TYPE_OPTIONS.map(
    opt => `<option value="${opt.value}">${opt.label}</option>`
  ).join("");

  editorContainer.innerHTML = /*html*/`
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

  const form = document.getElementById("attribute-definition-form") as HTMLFormElement;
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = (document.getElementById("attributeDefinition-name") as HTMLInputElement).value.trim();
    const attributeType = (document.getElementById("attributeDefinition-attributeType") as HTMLSelectElement).value as AttributeDataType;
    const description = (document.getElementById("attributeDefinition-description") as HTMLTextAreaElement).value.trim();
    
    if (!name || !attributeType) {
      alert("Vyplňte název a typ vlastnosti!");
      return;
    }

    const newAttributeDefinition: NewAttributeDefinition = {
      entityTypeId,
      name,
      displayName: name,
      attributeType,
      isRequired: false,
      orderIndex: 0,
    };
    createAttributeDefinition(serviceId, entityTypeId, newAttributeDefinition)
      .then(() => {
        if (onSuccess) onSuccess();
        editorContainer.innerHTML = "";
      });
  };

  document.getElementById("cancel-attributeDefinition-button")?.addEventListener("click", () => {
    editorContainer.innerHTML = "";
  });
}
