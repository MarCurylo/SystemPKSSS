import { loadEntityTypesByService } from "./entityTypesApi.js";
import { EntityType } from './entityTypesModel.js';

export function refreshEntityTypesList(serviceId: number, container: HTMLElement) {
    console.log("serviceId", serviceId);
    debugger
  const listContainer = document.getElementById("entity-types-list");
  
  if (!listContainer) return;

  loadEntityTypesByService(serviceId).then(entityTypes => {
    listContainer.innerHTML = "";
    entityTypes.forEach(entityType => {
      const item = document.createElement("div");
        item.innerHTML = `<b>${entityType.name}</b>
        ${entityType.description ? `Popis: ${entityType.description}<br>` : ""} 
        Vytvořeno: ${entityType.createdAt
  ? new Date(entityType.createdAt as string).toLocaleString('cs-CZ')
  : 'Neznámé'}<br>
          
        <hr>`;
      listContainer.appendChild(item);
    });
  });
}
