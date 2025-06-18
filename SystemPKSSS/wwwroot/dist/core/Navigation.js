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
export function renderMainNavigation() {
    return __awaiter(this, void 0, void 0, function* () {
        const navContainer = document.getElementById("nav-container");
        if (!navContainer)
            return;
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
          data-bs-toggle="collapse"
          data-bs-target="#services-collapse"
          aria-expanded="true"
          aria-label="Rozbalit/Sbalit služby"
          type="button"
        ></button>
      </li>
      <div class="collapse show" id="services-collapse">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
  `;
        for (const service of services) {
            html += `<li><a href="#services#${service.id}" class="nav-link">${service.name}</a></li>`;
        }
        html += `
        </ul>
      </div>
    </ul>
  `;
        navContainer.innerHTML = html;
    });
}
