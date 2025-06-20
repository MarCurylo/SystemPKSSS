import { loadServices } from "../services/servicesApi.js";

export async function renderMainNavigation() {
  const navContainer = document.getElementById("nav-container");
  if (!navContainer) return;

  const services = await loadServices();

  let html = `
    <a href="/" class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
      <span class="fs-5">PKSSS</span>
    </a>
    <ul class="list-unstyled ps-0">
      <li class="mb-1 d-flex align-items-center">
        <a href="#services" class="nav-link flex-grow-1">Služby</a>
        <button 
          class="btn-toggle align-items-center ms-1"
          aria-expanded="true"
          aria-label="Rozbalit/Sbalit služby"
          type="button"
          id="services-toggle"
        ></button>
      </li>
      <div class="fluid-collapse" id="services-collapse">
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

  // Přidání JS pro collapse (univerzálně!)
  const toggle = document.getElementById("services-toggle");
  const collapse = document.getElementById("services-collapse");

  if (toggle && collapse) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        collapse.classList.add("fluid-collapsed");
        toggle.setAttribute("aria-expanded", "false");
      } else {
        collapse.classList.remove("fluid-collapsed");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
    // Defaultně otevřené
    collapse.classList.remove("fluid-collapsed");
    toggle.setAttribute("aria-expanded", "true");
  }
}