import { loadNotes, createNote, deleteNote, updateNote } from "./notesApi.js";
import { Note } from "./notesModel.js";

// Hlavní funkce pro celou sekci poznámek
export async function renderNotesSection(
  serviceId: number,
  entityTypeId: number,
  entityId: number,
  container: HTMLElement
) {
  // Dvousloupcové rozložení
  container.innerHTML = `
    <div style="display: flex; gap:2.8em;">
      <div style="flex:1;min-width:270px;">
        <h4>Poznámky</h4>
        <div id="notes-list"></div>
        <div style="margin-top:1.3em;">
          <button id="show-add-note" class="button">Nová poznámka</button>
        </div>
      </div>
      <div style="flex:1.3;min-width:340px;" id="note-detail-panel"></div>
    </div>
  `;

  const notesList = container.querySelector("#notes-list") as HTMLElement;
  const noteDetailPanel = container.querySelector("#note-detail-panel") as HTMLElement;

  // Načtení a vykreslení poznámek vlevo
  const notes = await loadNotes(serviceId, entityTypeId, entityId);
  renderNotesList(notes, noteDetailPanel, serviceId, entityTypeId, entityId, notesList);

  // Nová poznámka (pravý panel)
  container.querySelector("#show-add-note")?.addEventListener("click", () => {
    renderAddNotePanel(serviceId, entityTypeId, entityId, noteDetailPanel, () => {
      renderNotesSection(serviceId, entityTypeId, entityId, container);
    });
  });
}

// Výpis poznámek vlevo – vždy stejně velké karty!
function renderNotesList(
  notes: Note[],
  noteDetailPanel: HTMLElement,
  serviceId: number,
  entityTypeId: number,
  entityId: number,
  container: HTMLElement
) {
  if (notes.length === 0) {
    container.innerHTML = "<i>Žádné poznámky</i>";
    return;
  }

  container.innerHTML = notes.map(note => renderNoteShortHtml(note)).join("");

  // Zobrazení detailu poznámky vpravo
  container.querySelectorAll(".btn-show-note").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const noteId = Number((e.currentTarget as HTMLElement).dataset.noteId);
      const note = notes.find(n => n.id === noteId);
      if (note) renderNoteDetailPanel(note, noteDetailPanel, serviceId, entityTypeId, entityId, () => {
        renderNotesSection(serviceId, entityTypeId, entityId, container.parentElement!.parentElement as HTMLElement);
      });
    });
  });
}

// Jedna poznámka vlevo – vždy stejně velká, pěkně zarovnaná
function renderNoteShortHtml(note: Note): string {
  const text = note.text ?? "";
  const shownText = text.length > 200 ? (text.slice(0, 200) + "…") : text;

  return `
    <div class="note editor-block shadow-sm animated-fadein"
      data-note-id="${note.id}"
      style="
        margin-bottom:1.1em;
        padding:1em 1.3em;
        min-height:130px;
        max-width:520px;
        height:150px;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        box-sizing:border-box;
      ">
      <div>
        <div style="font-size:1.13em;font-weight:700;color:#a27808;margin-bottom:0.25em;">
          ${note.createdAt ? new Date(note.createdAt).toLocaleString("cs-CZ") : ""}
        </div>
        <div class="note-text" style="
          margin-bottom:0.7em;
          white-space:pre-line;
          word-break:break-word;
          font-size:1.07em;
          min-height:2.3em;
        ">${escapeHtml(shownText)}</div>
      </div>
      <div>
        <button class="btn-show-note button secondary" data-note-id="${note.id}" style="font-size:1em;">Zobrazit</button>
      </div>
    </div>
  `;
}

// Pravý panel: detail poznámky + tlačítka
function renderNoteDetailPanel(
  note: Note,
  panel: HTMLElement,
  serviceId: number,
  entityTypeId: number,
  entityId: number,
  onChange: () => void
) {
  panel.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:540px;padding:1.3em 1.7em;">
      <div style="font-size:96%;color:#555;margin-bottom:0.7em;">
        <b>${note.createdAt ? new Date(note.createdAt).toLocaleString("cs-CZ") : ""}</b>
      </div>
      <div class="note-full-text" style="margin-bottom:1.2em;white-space:pre-line;word-break:break-word;">${escapeHtml(note.text ?? "")}</div>
      <div style="display:flex;gap:1em;">
        <button class="btn-edit-note button">Editovat</button>
        <button class="btn-delete-note button danger">Smazat</button>
        <button class="btn-close-note button secondary" style="margin-left:auto;">Zavřít</button>
      </div>
    </div>
  `;

  panel.querySelector(".btn-edit-note")?.addEventListener("click", () => {
    renderEditNotePanel(note, panel, serviceId, entityTypeId, entityId, onChange);
  });

  panel.querySelector(".btn-delete-note")?.addEventListener("click", async () => {
    if (confirm("Opravdu smazat poznámku?")) {
      await deleteNote(serviceId, entityTypeId, entityId, note.id!);
      onChange();
    }
  });

  panel.querySelector(".btn-close-note")?.addEventListener("click", () => {
    panel.innerHTML = "";
  });
}

// Pravý panel: přidání nové poznámky
function renderAddNotePanel(
  serviceId: number,
  entityTypeId: number,
  entityId: number,
  panel: HTMLElement,
  onSuccess: () => void
) {
  panel.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:540px;padding:1.3em 1.7em;">
      <form id="add-note-form">
        <textarea id="new-note-text" rows="7" placeholder="Zapište poznámku..." 
          style="width:100%;resize:vertical;min-height:110px;max-height:280px;font-size:1.07em;" class="input-lg"></textarea>
        <div style="margin-top:1.2em;display:flex;gap:1em;">
          <button type="submit" class="button">Přidat poznámku</button>
          <button type="button" id="cancel-add-note" class="button secondary">Zrušit</button>
        </div>
      </form>
    </div>
  `;

  const form = panel.querySelector("#add-note-form") as HTMLFormElement;
  form.onsubmit = async e => {
    e.preventDefault();
    const textarea = form.querySelector("#new-note-text") as HTMLTextAreaElement;
    const text = textarea.value.trim();
    if (!text) return;
    await createNote(serviceId, entityTypeId, entityId, { text });
    textarea.value = "";
    onSuccess();
  };
  panel.querySelector("#cancel-add-note")?.addEventListener("click", () => {
    panel.innerHTML = "";
  });
}

// Pravý panel: editace poznámky
function renderEditNotePanel(
  note: Note,
  panel: HTMLElement,
  serviceId: number,
  entityTypeId: number,
  entityId: number,
  onSuccess: () => void
) {
  panel.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:540px;padding:1.3em 1.7em;">
      <form id="edit-note-form">
        <textarea id="edit-note-text" rows="7"
          style="width:100%;resize:vertical;min-height:110px;max-height:280px;font-size:1.07em;" class="input-lg">${escapeHtml(note.text ?? "")}</textarea>
        <div style="margin-top:1.2em;display:flex;gap:1em;">
          <button type="submit" class="button">Uložit změny</button>
          <button type="button" id="cancel-edit-note" class="button secondary">Zrušit</button>
        </div>
      </form>
    </div>
  `;
  const form = panel.querySelector("#edit-note-form") as HTMLFormElement;
  const textarea = panel.querySelector("#edit-note-text") as HTMLTextAreaElement;
  const cancelBtn = panel.querySelector("#cancel-edit-note") as HTMLButtonElement;

  form.onsubmit = async e => {
    e.preventDefault();
    const newText = textarea.value.trim();
    if (!newText) return;
    await updateNote(serviceId, entityTypeId, entityId, note.id!, { text: newText });
    onSuccess();
  };

  cancelBtn.addEventListener("click", () => {
    panel.innerHTML = "";
  });
}

// XSS-safe
function escapeHtml(text: string) {
  return text.replace(/[<>&"]/g, function (c) {
    return ({
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;'
    } as any)[c];
  });
}
