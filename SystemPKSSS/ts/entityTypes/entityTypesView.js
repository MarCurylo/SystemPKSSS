"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshEntityTypesList = refreshEntityTypesList;
var entityTypesApi_js_1 = require("./entityTypesApi.js");
function refreshEntityTypesList(serviceId, container) {
    console.log("serviceId", serviceId);
    var listContainer = document.getElementById("entity-types-list");
    if (!listContainer)
        return;
    (0, entityTypesApi_js_1.loadEntityTypesByService)(serviceId).then(function (entityTypes) {
        listContainer.innerHTML = "";
        entityTypes.forEach(function (entityType) {
            var item = document.createElement("div");
            item.innerHTML = "<b>".concat(entityType.name, "</b>\n        ").concat(entityType.description ? "Popis: ".concat(entityType.description, "<br>") : "", " \n        Vytvo\u0159eno: ").concat(entityType.createdAt
                ? new Date(entityType.createdAt).toLocaleString('cs-CZ')
                : 'Neznámé', "<br>\n          \n        <hr>");
            listContainer.appendChild(item);
        });
    });
}
