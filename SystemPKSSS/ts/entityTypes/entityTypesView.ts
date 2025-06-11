import { loadEntityTypesByService, createEntityTypeForService } from './entityTypes.js';

function renderEntityTypesList(container: HTMLElement, serviceId: number) {
  container.innerHTML = `
    <h2>Nový typ entity</h2>
    <input id="entity-type-name" placeholder="Název typu"><br>
    <button id="save-entity-type-button">Uložit</button>`;

  document.getElementById("save-entity-type-button")?.addEventListener("click", () => {
    const name = (document.getElementById("entity-type-name") as HTMLInputElement).value;

    createEntityTypeForService(serviceId, name).then(() => {
      renderEntityTypesList(container, serviceId); // aktualizace seznamu po uložení
    });
  });
}

