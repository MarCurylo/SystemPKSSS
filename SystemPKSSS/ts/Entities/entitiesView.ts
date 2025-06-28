import { Entity, EntityAttributeValue, CreateEntity } from "./entitiesModel.js";
import { AttributeDefinition } from "../AttributeDefinitions/attributeDefinitionsModel.js";
import { loadEntitiesByEntityType, createEntity } from "./entitiesApi.js";
import { loadAttributeDefinitionsByEntityType } from "../AttributeDefinitions/attributeDefinitionsApi.js";

// Zobrazení entit v typu entity
export function renderEntityTap(serviceId: number, entityTypeId: number, container: HTMLElement) {
  container.innerHTML = `
    <h2>Seznam entit</h2>
    <div id="entity-list"></div>
    <button id="new-entity-button">Nová entita</button>
    <div id="entity-editor"></div>
  `;

  loadAttributeDefinitionsByEntityType(serviceId, entityTypeId).then((attributeDefinitions: AttributeDefinition[]) => {
    document.getElementById("new-entity-button")?.addEventListener("click", () => {
      renderEntityForm(serviceId, entityTypeId, {}, attributeDefinitions, () => {
        refreshEntityList(serviceId, entityTypeId, attributeDefinitions);
        const editor = document.getElementById("entity-editor");
        if (editor) editor.innerHTML = "";
      });
    });

    refreshEntityList(serviceId, entityTypeId, attributeDefinitions);
  });
}

// Vykreslení entit ve službě
export function refreshEntityList(
  serviceId: number,
  entityTypeId: number,
  attributeDefinitions: AttributeDefinition[]
) {
  const listContainer = document.getElementById("entity-list");
  if (!listContainer) return;

  loadEntitiesByEntityType(serviceId, entityTypeId).then((entities: Entity[]) => {
    listContainer.innerHTML = "";

    if (entities.length === 0) {
      listContainer.innerHTML = "<p>Žádné entity pro tento typ zatím neexistují.</p>";
      return;
    }

    entities.forEach(entity => {
      const item = document.createElement("div");

      const attributesHtml = attributeDefinitions
        .map((def: AttributeDefinition) => {
          const valueObj = entity.attributeValues?.find(
            (v: EntityAttributeValue) => v.attributeDefinitionId === def.id
          );

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

export function renderEntityForm(
  serviceId: number,
  entityTypeId: number,
  entity: Partial<Entity>,
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
          const options = def.enumValues?.map(opt => `<option value="${opt.value}">${opt.value}</option>`).join("") ?? "";
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
      switch (def.attributeType) {
        case "Boolean":
          return {
            attributeDefinitionId: def.id,
            valueBoolean: (element as HTMLInputElement).checked
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
      if (onSuccess) onSuccess();
      editorContainer.innerHTML = "";
    });
  };

  document.getElementById("cancel-entity-button")?.addEventListener("click", () => {
    editorContainer.innerHTML = "";
  });
}
