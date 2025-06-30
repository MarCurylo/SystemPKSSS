import type { Tag, CreateTag } from "./tagsModel.js";
import { loadTagsByService, createTag, deleteTag } from "./tagsApi.js";
import { currentUserRoles } from "../app.js";

export async function renderTagsTab(
    serviceId: number,
    container: HTMLElement
) {
    container.innerHTML = `
    <h2 style="margin-bottom:1.1em;">Tagy služby</h2>
    <div id="tags-list" style="margin-bottom:2em;"></div>
    ${currentUserRoles.includes("Admin")
            ? `<button id="show-create-tag-btn" class="button" style="margin-bottom:1.2em;">Vytvoř tag</button>
           <div id="create-tag-container"></div>`
            : ""
        }
  `;

    const createTagContainer = container.querySelector("#create-tag-container") as HTMLElement | null;
    const tagsList = container.querySelector("#tags-list") as HTMLElement;
    const showCreateBtn = container.querySelector("#show-create-tag-btn") as HTMLButtonElement | null;

    await refreshTagsList(serviceId, tagsList);

    if (showCreateBtn && createTagContainer) {
        let open = false;
        showCreateBtn.addEventListener("click", () => {
            open = !open;
            if (open) {
                renderCreateTagForm(serviceId, createTagContainer, async (newTag) => {
                    createTagContainer.innerHTML = "";
                    open = false;
                    await refreshTagsList(serviceId, tagsList);
                });
            } else {
                createTagContainer.innerHTML = "";
            }
        });
    }
}

async function refreshTagsList(serviceId: number, container: HTMLElement) {
    try {
        const tags = await loadTagsByService(serviceId);
        const isAdmin = currentUserRoles.includes("Admin");

        if (tags.length === 0) {
            container.innerHTML = "<p>Žádné tagy.</p>";
            return;
        }
        container.innerHTML = `
      <ul style="list-style:none; padding:0; margin:0;">
        ${tags.map(tag => `
          <li 
            style="
              display: flex; 
              align-items: center; 
              gap: 1.1em; 
              margin-bottom: 0.8em;
              background: #fafbfc;
              border-radius: 0.7em;
              padding: 0.6em 1em;
              box-shadow: 0 2px 8px 0 rgba(140,120,0,0.06);
            ">
            <span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:${tag.color};border:1.5px solid #f2f2f2;box-shadow:0 0 0 2px #fff;margin-right:0.45em;"></span>
            <span style="font-weight:600;font-size:1.09em;letter-spacing:0.01em;">${tag.name}</span>
            <span style="color:#666;font-size:0.97em;margin-left:0.3em;flex:1 1 auto;">
              ${tag.description ? tag.description : ""}
            </span>
            ${isAdmin
                ? `<button class="delete-tag-btn" data-tag-id="${tag.id}" title="Smazat tag"
                    style="
                        margin-left:auto;
                        background:#f5f5f6; 
                        border:1px solid #eee; 
                        color:#d03d3d;
                        font-size: 1em;
                        border-radius: 0.45em;
                        cursor:pointer;
                        padding: 0.33em 0.89em;
                        transition: background .13s;
                    "
                  >Smazat</button>`
                : ""
            }
          </li>
        `).join("")}
      </ul>
    `;

        // Admin? Najdi všechny btn a napoj click
        if (isAdmin) {
            container.querySelectorAll<HTMLButtonElement>(".delete-tag-btn").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const tagId = Number(btn.getAttribute("data-tag-id"));
                    if (confirm("Opravdu chcete smazat tento tag?")) {
                        try {
                            await deleteTag(serviceId, tagId);
                            await refreshTagsList(serviceId, container);
                        } catch {
                            alert("Chyba při mazání tagu.");
                        }
                    }
                });
            });
        }

    } catch {
        container.innerHTML = "<p>Chyba při načítání tagů.</p>";
    }
}

function renderCreateTagForm(
    serviceId: number,
    container: HTMLElement,
    onSuccess: (tag: Tag) => Promise<void>
) {
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

    const form = container.querySelector("#create-tag-form") as HTMLFormElement;
    const cancelBtn = container.querySelector("#cancel-create-tag") as HTMLButtonElement;
    const colorInput = form.querySelector<HTMLInputElement>("#tag-color")!;
    const colorPreview = form.querySelector<HTMLElement>("#color-preview")!;
    const messageDiv = container.querySelector("#create-tag-message") as HTMLElement;

    // Živý náhled barvy
    colorInput.addEventListener("input", () => {
        colorPreview.style.background = colorInput.value;
    });

    cancelBtn.addEventListener("click", () => {
        container.innerHTML = "";
    });

    form.onsubmit = async (e) => {
        e.preventDefault();
        messageDiv.textContent = "";

        const nameInput = form.querySelector<HTMLInputElement>("#tag-name");
        const descInput = form.querySelector<HTMLInputElement>("#tag-description");

        if (!nameInput || !colorInput || !descInput) return;

        const newTag: CreateTag = {
            serviceId,
            name: nameInput.value.trim(),
            color: colorInput.value,
            description: descInput.value.trim(),
        };

        try {
            const createdTag = await createTag(serviceId, newTag);
            await onSuccess(createdTag);
        } catch {
            messageDiv.textContent = "Chyba při vytváření tagu.";
        }
    };
}
