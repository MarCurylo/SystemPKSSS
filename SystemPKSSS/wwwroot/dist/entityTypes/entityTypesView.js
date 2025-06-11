import { loadEntityTypesByService } from "./entityTypesApi.js";
export function refreshEntityTypesList(serviceId, container) {
    console.log("serviceId", serviceId);
    const listContainer = document.getElementById("entity-types-list");
    if (!listContainer)
        return;
    loadEntityTypesByService(serviceId).then(entityTypes => {
        listContainer.innerHTML = "";
        entityTypes.forEach(entityType => {
            const item = document.createElement("div");
            item.innerHTML = `<b>${entityType.name}</b>
        ${entityType.description ? `Popis: ${entityType.description}<br>` : ""} 
        Vytvořeno: ${entityType.createdAt
                ? new Date(entityType.createdAt).toLocaleString('cs-CZ')
                : 'Neznámé'}<br>
          
        <hr>`;
            listContainer.appendChild(item);
        });
    });
}
//# sourceMappingURL=entityTypesView.js.map