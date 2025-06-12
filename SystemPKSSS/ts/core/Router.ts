import { renderServicesTab, renderServiceDetail } from "../services/servicesView.js";
import { renderEntityTypeTab } from "../entityTypes/entityTypesView.js";

// Hlavní router funkce
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
            // seznam všech služeb
                        console.log("Hash:", window.location.hash);
            console.log("Parts:", parts);
            renderServicesTab(container);
        } 
        else if (id && !subSection) {
            // detail služby
                        console.log("Hash:", window.location.hash);
            console.log("Parts:", parts);
            renderServiceDetail(id, container);
        }
        else if (subSection === "entitytypes") {
                                    console.log("Hash:", window.location.hash);
            console.log("Parts:", parts);
         renderEntityTypeTab(id, container);
        }
        else {
            container.innerHTML = "<p>Neznámá podstránka služby.</p>";
        }
    } else {
        container.innerHTML = "<h2>Vítejte v systému PKSSS</h2>";
    }
}

// Registrace listenerů
window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);