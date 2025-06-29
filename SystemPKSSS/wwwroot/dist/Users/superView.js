var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadServices } from '../services/servicesApi.js';
import { loadEntityTypes } from '../entityTypes/entityTypesApi.js';
import { loadEntitiesByEntityType } from '../Entities/entitiesApi.js';
import { loadAttributeDefinitionsByEntityType } from '../AttributeDefinitions/attributeDefinitionsApi.js';
import { loadTagsByService } from '../Tags/tagsApi.js';
import { loadNotes } from '../Notes/notesApi.js';
import { loadEntityTags } from '../Tags/entityTagsApi.js';
// --- Data cache ---
let allServices = [];
let allEntityTypes = [];
let allEntities = [];
let allAttributeDefinitions = [];
let allTags = [];
let allNotes = [];
let allEntityTagLinks = [];
export function renderAdminView(container) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        container.innerHTML = `
    <h1>Admin / SuperView</h1>
    <div id="admin-view-tabs" style="display:flex;gap:1.1em;margin-bottom:2em;">
      <button class="admin-tab-btn" data-tab="services">Služby</button>
      <button class="admin-tab-btn" data-tab="entityTypes">Typy entit</button>
      <button class="admin-tab-btn" data-tab="entities">Entity</button>
      <button class="admin-tab-btn" data-tab="attributeDefinitions">Atributy</button>
      <button class="admin-tab-btn" data-tab="tags">Tagy</button>
      <button class="admin-tab-btn" data-tab="notes">Poznámky</button>
    </div>
    <div id="admin-tab-content"></div>
  `;
        allServices = yield loadServices();
        (_a = document.querySelector('.admin-tab-btn[data-tab="services"]')) === null || _a === void 0 ? void 0 : _a.classList.add('active');
        renderServicesTable(document.getElementById('admin-tab-content'));
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.getAttribute('data-tab');
                const content = document.getElementById('admin-tab-content');
                switch (tab) {
                    case "services":
                        if (!allServices.length)
                            allServices = yield loadServices();
                        renderServicesTable(content);
                        break;
                    case "entityTypes":
                        allEntityTypes = [];
                        for (const service of allServices) {
                            const types = yield loadEntityTypes(service.id);
                            allEntityTypes.push(...types.map(t => (Object.assign(Object.assign({}, t), { serviceName: service.name, serviceId: service.id }))));
                        }
                        renderEntityTypesTable(content);
                        break;
                    case "entities":
                        allEntities = [];
                        for (const service of allServices) {
                            const types = yield loadEntityTypes(service.id);
                            for (const type of types) {
                                const entities = yield loadEntitiesByEntityType(service.id, type.id);
                                allEntities.push(...entities.map(e => (Object.assign(Object.assign({}, e), { entityTypeName: type.name, entityTypeId: type.id, serviceId: service.id, serviceName: service.name }))));
                            }
                        }
                        renderEntitiesTable(content);
                        break;
                    case "attributeDefinitions":
                        allAttributeDefinitions = [];
                        for (const service of allServices) {
                            const types = yield loadEntityTypes(service.id);
                            for (const type of types) {
                                const attributes = yield loadAttributeDefinitionsByEntityType(service.id, type.id);
                                allAttributeDefinitions.push(...attributes.map(a => (Object.assign(Object.assign({}, a), { entityTypeId: type.id, entityTypeName: type.name, serviceId: service.id, serviceName: service.name }))));
                            }
                        }
                        renderAttributeDefinitionsTable(content);
                        break;
                    case "tags":
                        allTags = [];
                        allEntityTagLinks = [];
                        for (const service of allServices) {
                            const tags = yield loadTagsByService(service.id);
                            allTags.push(...tags.map(t => (Object.assign(Object.assign({}, t), { serviceId: service.id, serviceName: service.name }))));
                            // entityType → entity → tagLinks
                            const entityTypes = yield loadEntityTypes(service.id);
                            for (const entityType of entityTypes) {
                                const entities = yield loadEntitiesByEntityType(service.id, entityType.id);
                                for (const entity of entities) {
                                    const tagLinks = yield loadEntityTags(service.id, entity.id);
                                    allEntityTagLinks.push(...tagLinks);
                                }
                            }
                        }
                        renderTagsTable(content);
                        break;
                    case "notes":
                        allNotes = [];
                        for (const service of allServices) {
                            const types = yield loadEntityTypes(service.id);
                            for (const type of types) {
                                const entities = yield loadEntitiesByEntityType(service.id, type.id);
                                for (const entity of entities) {
                                    const notes = yield loadNotes(service.id, type.id, entity.id);
                                    allNotes.push(...notes.map(n => (Object.assign(Object.assign({}, n), { entityId: entity.id, entityTypeId: type.id, entityTypeName: type.name, serviceId: service.id, serviceName: service.name }))));
                                }
                            }
                        }
                        renderNotesTable(content);
                        break;
                }
            }));
        });
    });
}
// ---------- RENDER TABULEK ------------
function renderServicesTable(container) {
    container.innerHTML = `
    <h2>Služby</h2>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Název</th><th>Popis</th><th>Aktivní</th><th>Vytvořeno</th>
          </tr>
        </thead>
        <tbody>
          ${allServices.map(s => {
        var _a;
        return `
            <tr>
              <td>${s.id}</td>
              <td>${s.name}</td>
              <td>${(_a = s.description) !== null && _a !== void 0 ? _a : ""}</td>
              <td>${s.isActive ? "✔️" : "❌"}</td>
              <td>${s.createdAt ? new Date(s.createdAt).toLocaleString("cs-CZ") : ""}</td>
            </tr>
          `;
    }).join("")}
        </tbody>
      </table>
    </div>
  `;
}
function renderEntityTypesTable(container) {
    container.innerHTML = `
    <h2>Typy entit</h2>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Název</th><th>Služba</th><th>Popis</th><th>Auditable</th>
          </tr>
        </thead>
        <tbody>
          ${allEntityTypes.map(t => {
        var _a;
        return `
            <tr>
              <td>${t.id}</td>
              <td>${t.name}</td>
              <td>${t.serviceName}</td>
              <td>${(_a = t.description) !== null && _a !== void 0 ? _a : ""}</td>
              <td>${t.auditable ? "✔️" : "❌"}</td>
            </tr>
          `;
    }).join("")}
        </tbody>
      </table>
    </div>
  `;
}
function renderEntitiesTable(container) {
    container.innerHTML = `
    <h2>Entity</h2>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Služba</th><th>Typ entity</th><th>Vytvořeno</th><th>Atributy</th>
          </tr>
        </thead>
        <tbody>
          ${allEntities.map(e => `
            <tr>
              <td>${e.id}</td>
              <td>${e.serviceName}</td>
              <td>${e.entityTypeName}</td>
              <td>${e.createdAt ? new Date(e.createdAt).toLocaleString("cs-CZ") : ""}</td>
              <td style="font-size:93%;max-width:440px;overflow-x:auto;padding:0.7em 0.3em;">
                ${renderEntityAttributesHuman(e)}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
function renderEntityAttributesHuman(entity) {
    const attributeDefs = allAttributeDefinitions.filter(a => a.entityTypeId === entity.entityTypeId && a.serviceId === entity.serviceId);
    if (!entity.attributeValues || entity.attributeValues.length === 0)
        return `<span style="color:#bbb;">žádné</span>`;
    return entity.attributeValues.map(av => {
        var _a, _b, _c;
        const def = attributeDefs.find(a => a.id === av.attributeDefinitionId);
        const name = (def === null || def === void 0 ? void 0 : def.displayName) || "";
        let value = (_c = (_b = (_a = av.valueString) !== null && _a !== void 0 ? _a : av.valueNumber) !== null && _b !== void 0 ? _b : (typeof av.valueBoolean === "boolean" ? (av.valueBoolean ? "✔️ Ano" : "❌ Ne") : "")) !== null && _c !== void 0 ? _c : ((def === null || def === void 0 ? void 0 : def.attributeType) === "Date" && av.valueDate ? new Date(av.valueDate).toLocaleDateString("cs-CZ") : "");
        if ((def === null || def === void 0 ? void 0 : def.attributeType) === "Date" && av.valueDate) {
            value = new Date(av.valueDate).toLocaleDateString("cs-CZ");
        }
        if ((def === null || def === void 0 ? void 0 : def.attributeType) === "Boolean" && typeof av.valueBoolean === "boolean") {
            value = av.valueBoolean ? "✔️ Ano" : "❌ Ne";
        }
        return `<div style="margin-bottom:0.2em;"><b>${name}:</b> ${value}</div>`;
    }).join("");
}
function renderAttributeDefinitionsTable(container) {
    container.innerHTML = `
    <h2>Atributy (Attribute Definitions)</h2>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Název</th><th>Typ</th><th>Typ entity</th><th>Služba</th><th>Pořadí</th><th>Enum hodnoty</th>
          </tr>
        </thead>
        <tbody>
          ${allAttributeDefinitions.map(a => `
            <tr>
              <td>${a.id}</td>
              <td>${a.displayName}</td>
              <td>${a.attributeType}</td>
              <td>${a.entityTypeName}</td>
              <td>${a.serviceName}</td>
              <td>${a.orderIndex}</td>
              <td>${a.enumValues ? a.enumValues.map(ev => ev.value).join(", ") : ""}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
function renderTagsTable(container) {
    var _a;
    // Spočítej počet použití každého tagu přes všechny entityTagLinks
    const tagUsage = {};
    for (const link of allEntityTagLinks) {
        tagUsage[link.tagId] = ((_a = tagUsage[link.tagId]) !== null && _a !== void 0 ? _a : 0) + 1;
    }
    container.innerHTML = `
    <h2>Tagy</h2>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Název</th>
            <th>Barva</th>
            <th>Služba</th>
            <th>Použití</th>
          </tr>
        </thead>
        <tbody>
          ${allTags.map(t => {
        var _a;
        return `
            <tr>
              <td>${t.id}</td>
              <td>${t.name}</td>
              <td><span style="background:${t.color};color:#fff;padding:3px 10px;border-radius:8px;">${t.color}</span></td>
              <td>${t.serviceName}</td>
              <td>${(_a = tagUsage[t.id]) !== null && _a !== void 0 ? _a : 0}</td>
            </tr>
          `;
    }).join("")}
        </tbody>
      </table>
    </div>
  `;
}
function renderNotesTable(container) {
    container.innerHTML = `
    <h2>Poznámky</h2>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Text</th><th>Služba</th><th>Typ entity</th><th>Entity</th><th>Vytvořeno</th>
          </tr>
        </thead>
        <tbody>
          ${allNotes.map(n => {
        var _a, _b, _c;
        return `
            <tr>
              <td>${n.id}</td>
              <td style="max-width:260px;white-space:pre-line;word-break:break-word;">${(_b = (_a = n.text) === null || _a === void 0 ? void 0 : _a.slice(0, 200)) !== null && _b !== void 0 ? _b : ""}${((_c = n.text) === null || _c === void 0 ? void 0 : _c.length) > 200 ? "…" : ""}</td>
              <td>${n.serviceName}</td>
              <td>${n.entityTypeName}</td>
              <td>${n.entityId}</td>
              <td>${n.createdAt ? new Date(n.createdAt).toLocaleString("cs-CZ") : ""}</td>
            </tr>
          `;
    }).join("")}
        </tbody>
      </table>
    </div>
  `;
}
