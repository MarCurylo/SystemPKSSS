import { Service } from "../services/servicesModel.js";
import { EntityType } from "../entityTypes/entityTypesModel.js";
import { Entity } from "../Entities/entitiesModel.js";
import { AttributeDefinition } from "../AttributeDefinitions/attributeDefinitionsModel.js";
import { Tag } from "../Tags/tagsModel.js";
import { Note } from "../Notes/notesModel.js";

import { loadServices } from '../services/servicesApi.js';
import { loadEntityTypes } from '../entityTypes/entityTypesApi.js';
import { loadEntitiesByEntityType } from '../Entities/entitiesApi.js';
import { loadAttributeDefinitionsByEntityType } from '../AttributeDefinitions/attributeDefinitionsApi.js';
import { loadTagsByService } from '../Tags/tagsApi.js';
import { loadNotes } from '../Notes/notesApi.js';
import { loadEntityTags, EntityTagLinkDto } from '../Tags/entityTagsApi.js';

// --- Typy rozšířené pro view ---
type ServiceEx = Service;
type EntityTypeEx = EntityType & { serviceName: string; serviceId: number };
type EntityEx = Entity & { serviceName: string; serviceId: number; entityTypeName: string; entityTypeId: number };
type AttributeDefinitionEx = AttributeDefinition & { serviceName: string; serviceId: number; entityTypeName: string; entityTypeId: number };
type TagEx = Tag & { serviceName: string; serviceId: number };
type NoteEx = Note & { serviceName: string; serviceId: number; entityTypeName: string; entityTypeId: number; entityId: number };

// --- Data cache ---
let allServices: ServiceEx[] = [];
let allEntityTypes: EntityTypeEx[] = [];
let allEntities: EntityEx[] = [];
let allAttributeDefinitions: AttributeDefinitionEx[] = [];
let allTags: TagEx[] = [];
let allNotes: NoteEx[] = [];
let allEntityTagLinks: EntityTagLinkDto[] = [];

export async function renderAdminView(container: HTMLElement) {
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

  allServices = await loadServices();
  document.querySelector('.admin-tab-btn[data-tab="services"]')?.classList.add('active');
  renderServicesTable(document.getElementById('admin-tab-content')!);

  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      const content = document.getElementById('admin-tab-content')!;
      switch (tab) {
        case "services":
          if (!allServices.length) allServices = await loadServices();
          renderServicesTable(content);
          break;
        case "entityTypes":
          allEntityTypes = [];
          for (const service of allServices) {
            const types = await loadEntityTypes(service.id);
            allEntityTypes.push(...types.map(t => ({
              ...t,
              serviceName: service.name,
              serviceId: service.id
            })));
          }
          renderEntityTypesTable(content);
          break;
        case "entities":
          allEntities = [];
          for (const service of allServices) {
            const types = await loadEntityTypes(service.id);
            for (const type of types) {
              const entities = await loadEntitiesByEntityType(service.id, type.id);
              allEntities.push(...entities.map(e => ({
                ...e,
                entityTypeName: type.name,
                entityTypeId: type.id,
                serviceId: service.id,
                serviceName: service.name
              })));
            }
          }
          renderEntitiesTable(content);
          break;
        case "attributeDefinitions":
          allAttributeDefinitions = [];
          for (const service of allServices) {
            const types = await loadEntityTypes(service.id);
            for (const type of types) {
              const attributes = await loadAttributeDefinitionsByEntityType(service.id, type.id);
              allAttributeDefinitions.push(...attributes.map(a => ({
                ...a,
                entityTypeId: type.id,
                entityTypeName: type.name,
                serviceId: service.id,
                serviceName: service.name
              })));
            }
          }
          renderAttributeDefinitionsTable(content);
          break;
        case "tags":
          allTags = [];
          allEntityTagLinks = [];
          for (const service of allServices) {
            const tags = await loadTagsByService(service.id);
            allTags.push(...tags.map(t => ({
              ...t,
              serviceId: service.id,
              serviceName: service.name
            })));
            // entityType → entity → tagLinks
            const entityTypes = await loadEntityTypes(service.id);
            for (const entityType of entityTypes) {
              const entities = await loadEntitiesByEntityType(service.id, entityType.id);
              for (const entity of entities) {
                const tagLinks = await loadEntityTags(service.id, entity.id);
                allEntityTagLinks.push(...tagLinks);
              }
            }
          }
          renderTagsTable(content);
          break;
        case "notes":
          allNotes = [];
          for (const service of allServices) {
            const types = await loadEntityTypes(service.id);
            for (const type of types) {
              const entities = await loadEntitiesByEntityType(service.id, type.id);
              for (const entity of entities) {
                const notes = await loadNotes(service.id, type.id, entity.id);
                allNotes.push(...notes.map(n => ({
                  ...n,
                  entityId: entity.id,
                  entityTypeId: type.id,
                  entityTypeName: type.name,
                  serviceId: service.id,
                  serviceName: service.name
                })));
              }
            }
          }
          renderNotesTable(content);
          break;
      }
    });
  });
}

// ---------- RENDER TABULEK ------------

function renderServicesTable(container: HTMLElement) {
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
          ${allServices.map(s => `
            <tr>
              <td>${s.id}</td>
              <td>${s.name}</td>
              <td>${s.description ?? ""}</td>
              <td>${s.isActive ? "✔️" : "❌"}</td>
              <td>${s.createdAt ? new Date(s.createdAt).toLocaleString("cs-CZ") : ""}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEntityTypesTable(container: HTMLElement) {
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
          ${allEntityTypes.map(t => `
            <tr>
              <td>${t.id}</td>
              <td>${t.name}</td>
              <td>${t.serviceName}</td>
              <td>${t.description ?? ""}</td>
              <td>${t.auditable ? "✔️" : "❌"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEntitiesTable(container: HTMLElement) {
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

function renderEntityAttributesHuman(entity: EntityEx): string {
  const attributeDefs = allAttributeDefinitions.filter(a =>
    a.entityTypeId === entity.entityTypeId && a.serviceId === entity.serviceId
  );
  if (!entity.attributeValues || entity.attributeValues.length === 0)
    return `<span style="color:#bbb;">žádné</span>`;

  return entity.attributeValues.map(av => {
    const def = attributeDefs.find(a => a.id === av.attributeDefinitionId);
    const name = def?.displayName || "";
    let value =
      av.valueString ??
      av.valueNumber ??
      (typeof av.valueBoolean === "boolean" ? (av.valueBoolean ? "✔️ Ano" : "❌ Ne") : "") ??
      (def?.attributeType === "Date" && av.valueDate ? new Date(av.valueDate).toLocaleDateString("cs-CZ") : "");

    if (def?.attributeType === "Date" && av.valueDate) {
      value = new Date(av.valueDate).toLocaleDateString("cs-CZ");
    }
    if (def?.attributeType === "Boolean" && typeof av.valueBoolean === "boolean") {
      value = av.valueBoolean ? "✔️ Ano" : "❌ Ne";
    }

    return `<div style="margin-bottom:0.2em;"><b>${name}:</b> ${value}</div>`;
  }).join("");
}

function renderAttributeDefinitionsTable(container: HTMLElement) {
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

function renderTagsTable(container: HTMLElement) {
  // Spočítej počet použití každého tagu přes všechny entityTagLinks
  const tagUsage: Record<number, number> = {};
  for (const link of allEntityTagLinks) {
    tagUsage[link.tagId] = (tagUsage[link.tagId] ?? 0) + 1;
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
          ${allTags.map(t => `
            <tr>
              <td>${t.id}</td>
              <td>${t.name}</td>
              <td><span style="background:${t.color};color:#fff;padding:3px 10px;border-radius:8px;">${t.color}</span></td>
              <td>${t.serviceName}</td>
              <td>${tagUsage[t.id] ?? 0}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderNotesTable(container: HTMLElement) {
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
          ${allNotes.map(n => `
            <tr>
              <td>${n.id}</td>
              <td style="max-width:260px;white-space:pre-line;word-break:break-word;">${n.text?.slice(0,200) ?? ""}${n.text?.length > 200 ? "…" : ""}</td>
              <td>${n.serviceName}</td>
              <td>${n.entityTypeName}</td>
              <td>${n.entityId}</td>
              <td>${n.createdAt ? new Date(n.createdAt).toLocaleString("cs-CZ") : ""}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
