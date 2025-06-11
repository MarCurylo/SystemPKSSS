import { renderServicesTab } from "./services/servicesView.js";
import { loadServices } from "./services/servicesApi.js";
import { refreshEntityTypesList } from "./services/entityTypes/entityTypesView.js";

export function handleHashChange() {
    const container = document.getElementById("main-container");
    if (!container) return;

    const parts = window.location.hash.slice(1).split('#');
    const section = parts[0] ?? "";
    const id = parts[1] ? parseInt(parts[1]) : null;
    const subSection = parts[2] ?? "";
    const subId = parts[3] ? parseInt(parts[3]) : null;

    if (section === "services") {
        if (!id) {
            renderServicesTab(container);
        }

        else if (id && !subSection) {
            loadServices().then(services => {
                const service = services.find(s => s.id === id);
                if (service) {
                    container.innerHTML = `
                        <h2>Jm�no slu�by: ${service.name}</h2>
                        <h5>Popis:</h5>${service.description ?? "Nezad�n"}
                        <h5>Datum zalo�en�:</h5>${service.createdAt
                            ? new Date(service.createdAt).toLocaleString('cs-CZ')
                            : "Nezn�m�"}
                        <hr>
                        <a href="#services#${id}#entitytypes" class="btn btn-secondary">Zobrazit typy entit</a>
                        <a href="#services#${id}#entities" class="btn btn-secondary">Zobrazit entity</a>
                    `;
                } else {
                    container.innerHTML = "<p>Slu�ba nebyla nalezena.</p>";
                }
            });
        }
        else if (subSection === "entitytypes") {
            container.innerHTML = `<h2>Typy entit pro slu�bu ${id}</h2><div id="entity-types-list"></div>`;
            refreshEntityTypesList(id, container);
        }
        else if (subSection === "entities") {
            container.innerHTML = `<h2>Entity pro slu�bu ${id}</h2><p>Zde bude v�pis entit.</p>`;
        }
        else {
            container.innerHTML = "<p>Nezn�m� podstr�nka slu�by.</p>";
        }
    } else {
        container.innerHTML = "<h2>V�tejte v syst�mu PKSSS</h2>";
    }
}
