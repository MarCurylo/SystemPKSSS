var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { showHelpBubble } from "./HelpBubble.js";
import { loadServices } from "../services/servicesApi.js";
import { loadEntityTypes } from "../entityTypes/entityTypesApi.js";
import { loadAttributeDefinitionsByEntityType } from "../AttributeDefinitions/attributeDefinitionsApi.js";
import { loadEntitiesByEntityType } from "../Entities/entitiesApi.js";
import { attachFluidCollapses } from "../ui/collapse.js";
export function renderMainNavigation(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const navContainer = document.getElementById("nav-container");
        if (!navContainer)
            return;
        const collapseStates = {};
        if (options === null || options === void 0 ? void 0 : options.CollapseState) {
            document.querySelectorAll('[data-toggle="fluid-collapse"]').forEach((toggle) => {
                const target = toggle.getAttribute("data-target");
                if (!target)
                    return;
                const expanded = toggle.getAttribute("aria-expanded") === "true";
                collapseStates[target] = expanded;
            });
        }
        // --- Uživatel + role + admin tlačítko ---
        let isAdmin = false;
        let userBlock = `
    <div class="mt-5 pt-3 border-top">
      <a href="#/login" class="nav-link text-primary fw-bold">
        Přihlášení / Registrace
      </a>
    </div>
  `;
        try {
            const res = yield fetch('/api/users/me', { credentials: 'include' });
            if (res.ok) {
                const userInfo = yield res.json();
                const roles = userInfo.roles || userInfo.Roles || [];
                isAdmin = roles.includes("Admin");
                let roleHtml = isAdmin
                    ? `<a href="#/admin-users" class="text-danger fw-bold" style="text-decoration: none;">Admin</a>`
                    : "Uživatel";
                const jmeno = userInfo.userName ||
                    userInfo.UserName ||
                    userInfo.username ||
                    userInfo.Email ||
                    userInfo.email ||
                    "Bez jména";
                userBlock = `
        <div class="mt-5 pt-3 border-top">
          <div class="fw-bold text-success">${jmeno}</div>
          <div class="small text-muted">${roleHtml}</div>
          <button id="logout-btn" class="btn btn-sm btn-outline-secondary mt-2">Odhlásit</button>
        </div>
      `;
            }
        }
        catch (e) {
            // Uživatelský blok fallback
        }
        // --- Hlavní navigace (služby, typy, entity...) ---
        const services = yield loadServices();
        let html = `
    <a href="/" class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
      <span class="fs-5">PKSSS</span>
    </a>
    <ul class="list-unstyled ps-0">
      <li class="mb-1 d-flex align-items-center">
        <a href="#services" class="nav-link flex-grow-1">Služby</a>
        <button 
          class="btn-toggle align-items-center ms-1"
          data-toggle="fluid-collapse"
          data-target="#services-collapse"
          aria-expanded="true"
          aria-label="Rozbalit/Sbalit služby"
          type="button"
        ></button>
      </li>
      <li>
        <div class="fluid-collapse" id="services-collapse">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
  `;
        for (const service of services) {
            html += `
      <li class="d-flex align-items-center">
        <a href="#services#${service.id}" class="nav-link flex-grow-1">${service.name}</a>
        <button 
          class="btn-toggle align-items-center ms-1"
          data-toggle="fluid-collapse"
          data-target="#service-collapse-${service.id}"
          aria-expanded="false"
          aria-label="Rozbalit/Sbalit službu"
          type="button"
        ></button>
      </li>
      <li>
        <div class="fluid-collapse fluid-collapsed" id="service-collapse-${service.id}">
          <ul>
    `;
            const entityTypes = yield loadEntityTypes(service.id);
            for (const entityType of entityTypes) {
                html += `
            <li class="d-flex align-items-center">
              <a href="#services#${entityType.serviceId}#entitytypes#${entityType.id}" class="nav-link flex-grow-1">${entityType.name}</a>
              <button 
                class="btn-toggle align-items-center ms-1"
                data-toggle="fluid-collapse"
                data-target="#entitytype-collapse-${entityType.id}"
                aria-expanded="false"
                aria-label="Rozbalit/Sbalit typ entit"
                type="button"
              ></button>
            </li>
            <li>
              <div class="fluid-collapse fluid-collapsed" id="entitytype-collapse-${entityType.id}">
                <ul id="entities-nav-${entityType.id}" class="ps-3"></ul>
              </div>
            </li>
      `;
            }
            html += `
          </ul>
        </div>
      </li>
    `;
        }
        html += `
        </ul>
      </div>
    </li>
  </ul>`;
        // -------- Uživatelský blok dolů --------
        html += userBlock;
        // -------- ADMIN STATISTIKY / SUPERVIEW tlačítko dole (jen pro Adminy) --------
        if (isAdmin) {
            html += `
      <div class="mt-4 mb-3 pb-2 pt-3 border-top text-center">
        <a href="#adminview" class="button" style="width:85%;font-weight:700;font-size:1.09em;">
          <span style="vertical-align:middle;"> Statistiky</span>
        </a>
      </div>
    `;
        }
        html += `
 <div id="help-fab-container" style="
  position: fixed;
  left: 28px;
  bottom: 28px;
  z-index: 1500;">
  <button id="help-fab" style="
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.85);
    box-shadow: 0 2px 18px 0 rgba(120,110,180,0.19), 0 1.5px 12px 0 rgba(170,150,180,0.07);
    color: #5b53d2;
    font-size: 2.4em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: box-shadow 0.18s, background 0.19s;
    backdrop-filter: blur(7px);
    outline: none;">
    ?
  </button>
</div>
`;
        navContainer.innerHTML = html;
        const helpFab = document.getElementById("help-fab");
        if (helpFab) {
            helpFab.addEventListener("click", () => showHelpBubble());
        }
        attachFluidCollapses();
        // --- Druhá fáze: dopsání entit pod entity typy ---
        for (const service of services) {
            const entityTypes = yield loadEntityTypes(service.id);
            for (const entityType of entityTypes) {
                const ul = navContainer.querySelector(`#entities-nav-${entityType.id}`);
                if (!ul)
                    continue;
                const attributeDefinitions = yield loadAttributeDefinitionsByEntityType(entityType.serviceId, entityType.id);
                const nameAttrIds = attributeDefinitions.filter((a) => a.isDisplayName).map((a) => a.id);
                if (!nameAttrIds.length) {
                    ul.innerHTML = `<li><i>prázdné</i></li>`;
                    continue;
                }
                const entities = yield loadEntitiesByEntityType(entityType.serviceId, entityType.id);
                let entityHtml = "";
                for (const entity of entities) {
                    const nameParts = nameAttrIds.map((attrId) => {
                        const attrVal = entity.attributeValues.find((v) => v.attributeDefinitionId === attrId);
                        return (attrVal === null || attrVal === void 0 ? void 0 : attrVal.valueString) || (attrVal === null || attrVal === void 0 ? void 0 : attrVal.valueNumber) || (attrVal === null || attrVal === void 0 ? void 0 : attrVal.valueDate) || "";
                    }).filter((x) => x);
                    const entityName = nameParts.length > 0 ? nameParts.join(" ") : "";
                    entityHtml += entityName
                        ? `<li><a href="#services#${entityType.serviceId}#entitytypes#${entityType.id}#entities#${entity.id}" class="nav-link">${entityName}</a></li>`
                        : "";
                }
                if (!entityHtml) {
                    entityHtml = `<li><i>prázdné</i></li>`;
                }
                ul.innerHTML = entityHtml;
            }
        }
        // Obnovení collapse stavů
        if (options === null || options === void 0 ? void 0 : options.CollapseState) {
            Object.entries(collapseStates).forEach(([selector, expanded]) => {
                const toggle = document.querySelector(`[data-toggle="fluid-collapse"][data-target="${selector}"]`);
                const collapse = document.querySelector(selector);
                if (!toggle || !collapse)
                    return;
                if (expanded) {
                    collapse.classList.remove("fluid-collapsed");
                    toggle.setAttribute("aria-expanded", "true");
                }
                else {
                    collapse.classList.add("fluid-collapsed");
                    toggle.setAttribute("aria-expanded", "false");
                }
            });
        }
        // --------- Logout handler (přidat vždy po vložení do DOMu) ---------
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                yield fetch("/api/logout", { method: "POST", credentials: "include" });
                window.location.reload();
            }));
        }
    });
}
