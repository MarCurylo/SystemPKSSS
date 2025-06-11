import { createEntityTypeForService } from './entityTypes.js';
function renderEntityTypesList(container, serviceId) {
    var _a;
    container.innerHTML = `
    <h2>Nový typ entity</h2>
    <input id="entity-type-name" placeholder="Název typu"><br>
    <button id="save-entity-type-button">Uložit</button>`;
    (_a = document.getElementById("save-entity-type-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const name = document.getElementById("entity-type-name").value;
        createEntityTypeForService(serviceId, name).then(() => {
            renderEntityTypesList(container, serviceId); // aktualizace seznamu po uložení
        });
    });
}
//# sourceMappingURL=entityTypesView.js.map