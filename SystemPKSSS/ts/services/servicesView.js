"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderServicesTab = renderServicesTab;
exports.renderServiceDetail = renderServiceDetail;
var servicesApi_js_1 = require("./servicesApi.js");
var entityTypesView_js_1 = require("../entityTypes/entityTypesView.js");
// Vstupní funkce pro zobrazení seznamu služeb
function renderServicesTab(container) {
    var _a;
    container.innerHTML = "\n    <h2>Seznam slu\u017Eeb</h2>\n    <div id=\"services-list\"></div>\n    <button id=\"new-service-button\">Nov\u00E1 slu\u017Eba</button>\n  ";
    (_a = document.getElementById("new-service-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        renderServiceForm(container);
    });
    refreshServicesList(container);
}
// Načtení a vykreslení seznamu služeb
function refreshServicesList(container) {
    var listContainer = document.getElementById("services-list");
    if (!listContainer)
        return;
    (0, servicesApi_js_1.loadServices)().then(function (services) {
        listContainer.innerHTML = "";
        services.forEach(function (service) {
            var item = document.createElement("div");
            item.innerHTML = "\n        <b>".concat(service.name, "</b> - ").concat(service.isActive ? "Aktivní" : "Neaktivní", "\n        ").concat(service.description ? "Popis slu\u017Eby: ".concat(service.description, "<br>") : "", " \n        Vytvo\u0159eno: ").concat(service.createdAt
                ? new Date(service.createdAt).toLocaleString('cs-CZ')
                : 'Neznámé', "<br>\n\n        <button data-id=\"").concat(service.id, "\" class=\"edit-btn\">Edit</button>\n        <button data-id=\"").concat(service.id, "\" class=\"delete-btn\">Smazat</button>\n        <button data-id=\"").concat(service.id, "\" class=\"detail-btn\">Detail slu\u017Eby</button>\n        <button data-id=\"").concat(service.id, "\" class=\"entitytypes-btn\">Typy entit</button>\n        <hr>\n      ");
            listContainer.appendChild(item);
        });
        // Event listenery na tlačítka
        document.querySelectorAll(".edit-btn").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                var id = parseInt(e.target.dataset.id);
                renderServiceEditForm(id, container);
            });
        });
        document.querySelectorAll(".delete-btn").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                var id = parseInt(e.target.dataset.id);
                (0, servicesApi_js_1.deleteService)(id).then(function () { return refreshServicesList(container); });
            });
        });
        document.querySelectorAll(".detail-btn").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                var id = parseInt(e.target.dataset.id);
                window.location.hash = "services#".concat(id);
            });
        });
        document.querySelectorAll(".entitytypes-btn").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                var id = parseInt(e.target.dataset.id);
                window.location.hash = "services#".concat(id, "#entitytypes");
            });
        });
    });
}
// Formulář pro přidání nové služby
function renderServiceForm(container) {
    var _a;
    container.innerHTML = "\n    <h2>Nov\u00E1 slu\u017Eba</h2>\n    <input id=\"service-name\" placeholder=\"N\u00E1zev slu\u017Eby\"><br>\n    <textarea id=\"service-description\" placeholder=\"Popis slu\u017Eby\"></textarea><br>\n    <label>Aktivn\u00ED: <input type=\"checkbox\" id=\"service-active\" checked></label><br>\n    <button id=\"save-service-button\">Ulo\u017Eit</button>\n  ";
    (_a = document.getElementById("save-service-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        var name = document.getElementById("service-name").value;
        var description = document.getElementById("service-description").value;
        var isActive = document.getElementById("service-active").checked;
        var newService = {
            name: name,
            description: description,
            isActive: isActive,
        };
        (0, servicesApi_js_1.createService)(newService).then(function () { return renderServicesTab(container); });
    });
}
// Formulář pro editaci existující služby
function renderServiceEditForm(id, container) {
    (0, servicesApi_js_1.loadServices)().then(function (services) {
        var _a;
        var service = services.find(function (s) { return s.id === id; });
        if (!service)
            return;
        container.innerHTML = "\n      <h2>Editace slu\u017Eby</h2>\n      <input id=\"service-name\" value=\"".concat(service.name, "\"><br>\n      <textarea id=\"service-description\">").concat(service.description, "</textarea><br>\n      <label>Aktivn\u00ED: <input type=\"checkbox\" id=\"service-active\" ").concat(service.isActive ? "checked" : "", "></label><br>\n      <button id=\"update-service-button\">Ulo\u017Eit zm\u011Bny</button>\n    ");
        (_a = document.getElementById("update-service-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            var name = document.getElementById("service-name").value;
            var description = document.getElementById("service-description").value;
            var isActive = document.getElementById("service-active").checked;
            var editedService = {
                id: id,
                name: name,
                description: description,
                isActive: isActive
            };
            (0, servicesApi_js_1.updateService)(editedService).then(function () { return renderServicesTab(container); });
        });
    });
}
// Detail služby (pro volání z routeru)
function renderServiceDetail(id, container) {
    (0, servicesApi_js_1.loadServices)().then(function (services) {
        var _a;
        var service = services.find(function (s) { return s.id === id; });
        if (!service) {
            container.innerHTML = "<p>Služba nenalezena.</p>";
            return;
        }
        container.innerHTML = "\n      <h2>Jm\u00E9no slu\u017Eby: ".concat(service.name, "</h2>\n      <h5>Popis:</h5>").concat((_a = service.description) !== null && _a !== void 0 ? _a : "Nezadán", "\n      <h5>Datum zalo\u017Een\u00ED:</h5>").concat(service.createdAt
            ? new Date(service.createdAt).toLocaleString('cs-CZ')
            : 'Neznámé', "\n      <hr>\n      <a href=\"#services#").concat(service.id, "#entitytypes\" class=\"btn btn-secondary\">Typy entit</a>\n    ");
        (0, entityTypesView_js_1.refreshEntityTypesList)(service.id, container);
    });
}
