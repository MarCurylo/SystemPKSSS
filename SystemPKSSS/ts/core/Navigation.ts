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
}
