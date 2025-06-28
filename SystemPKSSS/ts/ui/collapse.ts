export function attachFluidCollapses() {
  document.querySelectorAll('[data-toggle="fluid-collapse"]').forEach(toggle => {
    const targetSelector = toggle.getAttribute("data-target");
    if (!targetSelector) return;
    const collapse = document.querySelector(targetSelector);
    if (!collapse) return;

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
  });
}