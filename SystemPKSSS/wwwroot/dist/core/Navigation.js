var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadServices } from "../services/servicesApi.js";
import { loadEntityTypes } from "../entityTypes/entityTypesApi.js";
import { attachFluidCollapses } from "../ui/collapse.js";
export function renderMainNavigation(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const navContainer = document.getElementById("nav-container");
        if (!navContainer)
            return;
        const collapseStates = {};
        if (options === null || options === void 0 ? void 0 : options.CollapseState) {
            document.querySelectorAll('[data-toggle="fluid-collapse"]').forEach(toggle => {
                const target = toggle.getAttribute("data-target");
                if (!target)
                    return;
                const expanded = toggle.getAttribute("aria-expanded") === "true";
                collapseStates[target] = expanded;
            });
        }
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
          <li>
            <a href="#services#${entityType.serviceId}#entitytypes#${entityType.id}" class="nav-link">${entityType.name}</a>
          </li>
    `;
            }
            html += `
        </ul>
      </div>
    </li>
  `;
        }
        navContainer.innerHTML = html;
        attachFluidCollapses();
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
    });
}
