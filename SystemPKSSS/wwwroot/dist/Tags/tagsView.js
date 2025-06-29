var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadTagsByService, createTag } from "./tagsApi.js";
import { currentUserRoles } from "../app.js";
export function renderTagsTab(serviceId, container) {
    return __awaiter(this, void 0, void 0, function* () {
        container.innerHTML = `
    <h2 style="margin-bottom:1.1em;">Tagy služby</h2>
    <div id="tags-list" style="margin-bottom:2em;"></div>
    ${currentUserRoles.includes("Admin")
            ? `<button id="show-create-tag-btn" class="button" style="margin-bottom:1.2em;">Vytvoř tag</button>
           <div id="create-tag-container"></div>`
            : ""}
  `;
        const createTagContainer = container.querySelector("#create-tag-container");
        const tagsList = container.querySelector("#tags-list");
        const showCreateBtn = container.querySelector("#show-create-tag-btn");
        yield refreshTagsList(serviceId, tagsList);
        if (showCreateBtn && createTagContainer) {
            let open = false;
            showCreateBtn.addEventListener("click", () => {
                open = !open;
                if (open) {
                    renderCreateTagForm(serviceId, createTagContainer, (newTag) => __awaiter(this, void 0, void 0, function* () {
                        createTagContainer.innerHTML = "";
                        open = false;
                        yield refreshTagsList(serviceId, tagsList);
                    }));
                }
                else {
                    createTagContainer.innerHTML = "";
                }
            });
        }
    });
}
function refreshTagsList(serviceId, container) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tags = yield loadTagsByService(serviceId);
            if (tags.length === 0) {
                container.innerHTML = "<p>Žádné tagy.</p>";
                return;
            }
            container.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 0.65em 0.85em; padding-bottom: 0.2em;">
        ${tags.map(tag => `
          <span 
            style="
              display: inline-block;
              min-width: 74px;
              background: ${tag.color};
              color: #fff;
              font-weight: 600;
              padding: 6px 22px;
              border-radius: 0.8em;
              box-shadow: 0 2px 8px 0 rgba(140,120,0,0.07);
              text-align: center;
              letter-spacing: 0.01em;
              font-size: 1.04em;
              transition: background 0.13s;
              user-select: all;
            "
            title="${tag.name}"
          >${tag.name}</span>
        `).join("")}
      </div>
    `;
        }
        catch (_a) {
            container.innerHTML = "<p>Chyba při načítání tagů.</p>";
        }
    });
}
function renderCreateTagForm(serviceId, container, onSuccess) {
    if (!currentUserRoles.includes("Admin")) {
        alert("Nemáte oprávnění vytvářet tagy.");
        return;
    }
    container.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:360px;">
      <form id="create-tag-form">
        <div style="margin-bottom:1.1em;">
          <label style="font-weight:600;display:block;margin-bottom:0.3em;">Název:</label>
          <input type="text" id="tag-name" required class="input-lg" style="width:100%;">
        </div>
        <div style="margin-bottom:1.1em;display:flex;align-items:center;">
          <label style="font-weight:600;">Barva:</label>
          <input type="color" id="tag-color" value="#007bff" style="margin-left:1.3em;width:44px;height:32px;border:none;outline:none;box-shadow:0 1px 5px 0 rgba(0,0,0,0.07);background:transparent;cursor:pointer;">
          <span id="color-preview" style="display:inline-block;width:45px;height:32px;vertical-align:middle; border-radius:0.32em; margin-left:1em;box-shadow:0 1px 5px 0 rgba(0,0,0,0.08);background:#007bff;"></span>
        </div>
        <div style="margin-bottom:1.1em;">
          <label style="font-weight:600;display:block;margin-bottom:0.3em;">Popis:</label>
          <input type="text" id="tag-description" class="input-lg" style="width:100%;">
        </div>
        <div style="margin-top:1.1em;display:flex;gap:1em;">
          <button type="submit" class="button">Vytvořit</button>
          <button type="button" id="cancel-create-tag" class="button secondary">Zrušit</button>
        </div>
      </form>
      <div id="create-tag-message" style="color:red; margin-top: 0.7em; min-height: 1.2em;"></div>
    </div>
  `;
    const form = container.querySelector("#create-tag-form");
    const cancelBtn = container.querySelector("#cancel-create-tag");
    const colorInput = form.querySelector("#tag-color");
    const colorPreview = form.querySelector("#color-preview");
    const messageDiv = container.querySelector("#create-tag-message");
    // Živý náhled barvy
    colorInput.addEventListener("input", () => {
        colorPreview.style.background = colorInput.value;
    });
    cancelBtn.addEventListener("click", () => {
        container.innerHTML = "";
    });
    form.onsubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        messageDiv.textContent = "";
        const nameInput = form.querySelector("#tag-name");
        const descInput = form.querySelector("#tag-description");
        if (!nameInput || !colorInput || !descInput)
            return;
        const newTag = {
            serviceId,
            name: nameInput.value.trim(),
            color: colorInput.value,
            description: descInput.value.trim(),
        };
        try {
            const createdTag = yield createTag(serviceId, newTag);
            yield onSuccess(createdTag);
        }
        catch (_a) {
            messageDiv.textContent = "Chyba při vytváření tagu.";
        }
    });
}
