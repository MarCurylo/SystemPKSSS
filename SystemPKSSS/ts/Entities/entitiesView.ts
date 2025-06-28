import { Entity } from "./entitiesModel.js";
import { AttributeDefinition } from "../AttributeDefinitions/attributeDefinitionsModel.js";
import { EntityAttributeValue } from "../AttributeDefinitions/attributeDefinitionsModel.js";
import { loadEntitiesByEntityType, createEntity } from "./entitiesApi.js";
import { loadAttributeDefinitionsByEntityType } from "../AttributeDefinitions/attributeDefinitionsApi.js";


// Zobrazeni entit v typu entity
export function renderEntityTap(serviceId: number, entityTypeId: number, container: HTMLElement) {
  container.innerHTML = `
    <h2>Seznam entit</h2>
    <div id="entity-list"></div>
    <button id="new-entity-button">Nový typ vlastnosti</button>
    <div id="entity-editor"></div>
  `;

  document.getElementById("new-entity-button")?.addEventListener("click", () => {
    renderEntityForm(serviceId, entityTypeId, () => {
      refreshEntityList(serviceId, entityTypeId);
      // Po uložení skryj editor
      const editor = document.getElementById("attributeDefinition-editor");
      if (editor) editor.innerHTML = "";
    });
  });

  refreshEntityList(serviceId, entityTypeId);
}

// Vykreslení entyt ve službě
export function refreshEntityList(serviceId: number, entityTypeId: number) {
  const listContainer = document.getElementById("entity-list");
  if (!listContainer) return;

  loadAttributeDefinitionsByEntityType(serviceId, entityTypeId).then((attributeDefinitions: AttributeDefinition[]) => {
    loadEntitiesByEntityType(serviceId, entityTypeId).then((entities: Entity[]) => {
      listContainer.innerHTML = "";

      entities.forEach(entity => {
        const item = document.createElement("div");

        const attributesHtml = attributeDefinitions
          .map((def: AttributeDefinition) => {
            const valueObj: EntityAttributeValue | undefined = entity.attributeValues?.find(
              (v: EntityAttributeValue) => v.attributeDefinitionId === def.id
            );

            const value = valueObj?.value ?? "";
            const rendered = renderAttributeValue(def.attributeType, value);
            return `<strong>${def.displayName}:</strong> ${rendered}`;
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
  });
}



export function renderEntityForm(
  serviceId: number,
  entityTypeId: number,
  entity: Entity,
  attributeDefinitions: AttributeDefinition[],
  onSuccess?: () => void
) {
  const editorContainer = document.getElementById("entity-editor");
  if (!editorContainer) return;

  const fieldsHtml = attributeDefinitions
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(def => {
      switch (def.attributeType) {
        case "Boolean":
          return `<label>${def.displayName}: <input type="checkbox" id="attr-${def.id}"></label><br>`;
        case "Enum":
          const options = def.enumValues?.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join("") ?? "";
          return `<label>${def.displayName}: <select id="attr-${def.id}">${options}</select></label><br>`;
        case "Date":
          return `<label>${def.displayName}: <input type="date" id="attr-${def.id}"></label><br>`;
        default:
          return `<label>${def.displayName}: <input type="text" id="attr-${def.id}" placeholder="${def.displayName}"></label><br>`;
      }
    })
    .join("");

  editorContainer.innerHTML = /*html*/`
    <h3>Nová entita</h3>
    <form id="entity-form">
      ${fieldsHtml}
      <button type="submit" id="save-entity-button">Uložit</button>
      <button type="button" id="cancel-entity-button">Zrušit</button>
    </form>
  `;

  const form = document.getElementById("entity-form") as HTMLFormElement;
  form.onsubmit = (e) => {
    e.preventDefault();

    const attributeValues: EntityAttributeValue[] = attributeDefinitions.map(def => {
      const element = document.getElementById(`attr-${def.id}`) as HTMLInputElement | HTMLSelectElement;
      let value = "";

      switch (def.attributeType) {
        case "Boolean":
          value = (element as HTMLInputElement).checked.toString(); break;
        default:
          value = element.value.trim(); break;
      }

      return {
        id: 0, // bude ignorováno při vytváření
        attributeDefinitionId: def.id,
        value,
      };
    });

    createEntity(serviceId, entityTypeId, entity, { attributeValues }).then(() => {
      if (onSuccess) onSuccess();
      editorContainer.innerHTML = "";
    });
  };

  document.getElementById("cancel-entity-button")?.addEventListener("click", () => {
    editorContainer.innerHTML = "";
  });
}


export function renderAttributeValue(type: string, value: string): string {
  switch (type) {
    case "Boolean":
      return value === "true" ? "✔️ Ano" : "❌ Ne";
    case "Image":
      return `<img src="${value}" style="max-height: 100px;" alt="obrázek">`;
    case "File":
      return `<a href="${value}" target="_blank">📎 Soubor</a>`;
    default:
      return value;
  }
}
