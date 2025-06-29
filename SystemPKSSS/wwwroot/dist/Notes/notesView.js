var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadNotes, createNote, deleteNote, updateNote } from "./notesApi.js";
// Maximální počet zápisů zobrazených vlevo
const MAX_VISIBLE_RECORDS = 5;
// Hlavní funkce pro celou sekci zápisů
export function renderNotesSection(serviceId, entityTypeId, entityId, container) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // Dvousloupcové rozložení
        container.innerHTML = `
    <div style="display: flex; gap:2.8em;">
      <div style="flex:1;min-width:270px;">
        <h4>Zápisy</h4>
        <div id="notes-list"></div>
        <div style="margin-top:1.3em;">
          <button id="show-add-note" class="button">Nový zápis</button>
        </div>
      </div>
      <div style="flex:1.3;min-width:340px;" id="note-detail-panel">
        <!-- detail zápisu nebo placeholder -->
      </div>
    </div>
  `;
        const notesList = container.querySelector("#notes-list");
        const noteDetailPanel = container.querySelector("#note-detail-panel");
        // Načtení a vykreslení zápisů vlevo
        const notes = yield loadNotes(serviceId, entityTypeId, entityId);
        // Seřaď sestupně podle createdAt a omez na MAX_VISIBLE_RECORDS
        const sortedNotes = notes
            .slice()
            .sort((a, b) => (b.createdAt && a.createdAt ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0))
            .slice(0, MAX_VISIBLE_RECORDS);
        renderNotesList(sortedNotes, noteDetailPanel, serviceId, entityTypeId, entityId, notesList);
        // Nový zápis (pravý panel)
        (_a = container.querySelector("#show-add-note")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            renderAddNotePanel(serviceId, entityTypeId, entityId, noteDetailPanel, () => {
                renderNotesSection(serviceId, entityTypeId, entityId, container);
            });
        });
        // Když stránka načte, nastav do pravého panelu prázdný box (pokud nic není zvoleno)
        // Ale až po prvním renderu notesList (jinak by se to při kliknutí na zápis vždy mazalo)
        if (!noteDetailPanel.innerHTML.trim()) {
            showNotePlaceholder(noteDetailPanel);
        }
    });
}
// Výpis zápisů vlevo – dynamická výška
function renderNotesList(notes, noteDetailPanel, serviceId, entityTypeId, entityId, container) {
    if (notes.length === 0) {
        container.innerHTML = "<i>Žádné zápisy</i>";
        // Zajisti placeholder vpravo i když nejsou zápisy
        showNotePlaceholder(noteDetailPanel);
        return;
    }
    container.innerHTML = notes.map(note => renderNoteShortHtml(note)).join("");
    // Zobrazení detailu zápisu vpravo
    container.querySelectorAll(".btn-show-note").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const noteId = Number(e.currentTarget.dataset.noteId);
            const note = notes.find(n => n.id === noteId);
            if (note) {
                renderNoteDetailPanel(note, noteDetailPanel, serviceId, entityTypeId, entityId, () => {
                    renderNotesSection(serviceId, entityTypeId, entityId, container.parentElement.parentElement);
                });
            }
        });
    });
}
// Jeden zápis vlevo – výška podle obsahu
function renderNoteShortHtml(note) {
    var _a;
    const text = (_a = note.text) !== null && _a !== void 0 ? _a : "";
    const shownText = text.length > 300 ? (text.slice(0, 300) + "…") : text;
    return `
    <div class="note editor-block shadow-sm animated-fadein"
      data-note-id="${note.id}"
      style="
        margin-bottom:1.1em;
        padding:1em 1.3em;
        min-height:100px;
        max-width:520px;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        box-sizing:border-box;
        background:#fffbe8;
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
// Pravý panel: detail zápisu + tlačítka
function renderNoteDetailPanel(note, panel, serviceId, entityTypeId, entityId, onChange) {
    var _a, _b, _c, _d;
    panel.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:540px;min-height:180px;padding:1.3em 1.7em;">
      <div style="font-size:96%;color:#555;margin-bottom:0.7em;">
        <b>${note.createdAt ? new Date(note.createdAt).toLocaleString("cs-CZ") : ""}</b>
      </div>
      <div class="note-full-text" style="margin-bottom:1.2em;white-space:pre-line;word-break:break-word;">${escapeHtml((_a = note.text) !== null && _a !== void 0 ? _a : "")}</div>
      <div style="display:flex;gap:1em;">
        <button class="btn-edit-note button">Editovat</button>
        <button class="btn-delete-note button danger">Smazat</button>
        <button class="btn-close-note button secondary" style="margin-left:auto;">Zavřít</button>
      </div>
    </div>
  `;
    (_b = panel.querySelector(".btn-edit-note")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        renderEditNotePanel(note, panel, serviceId, entityTypeId, entityId, onChange);
    });
    (_c = panel.querySelector(".btn-delete-note")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        if (confirm("Opravdu smazat zápis?")) {
            yield deleteNote(serviceId, entityTypeId, entityId, note.id);
            // Po smazání zobraz znovu placeholder, aby panel nezmizel
            showNotePlaceholder(panel);
            onChange();
        }
    }));
    (_d = panel.querySelector(".btn-close-note")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
        // Po zavření zobraz placeholder místo úplného vymazání panelu
        showNotePlaceholder(panel);
    });
}
// Pravý panel: přidání nového zápisu
function renderAddNotePanel(serviceId, entityTypeId, entityId, panel, onSuccess) {
    var _a;
    panel.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:540px;min-height:180px;padding:1.3em 1.7em;">
      <form id="add-note-form">
        <textarea id="new-note-text" rows="7" placeholder="Zapište zápis..." 
          style="width:100%;resize:vertical;min-height:110px;max-height:280px;font-size:1.07em;" class="input-lg"></textarea>
        <div style="margin-top:1.2em;display:flex;gap:1em;">
          <button type="submit" class="button">Přidat zápis</button>
          <button type="button" id="cancel-add-note" class="button secondary">Zrušit</button>
        </div>
      </form>
    </div>
  `;
    const form = panel.querySelector("#add-note-form");
    form.onsubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const textarea = form.querySelector("#new-note-text");
        const text = textarea.value.trim();
        if (!text)
            return;
        yield createNote(serviceId, entityTypeId, entityId, { text });
        textarea.value = "";
        onSuccess();
    });
    (_a = panel.querySelector("#cancel-add-note")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        showNotePlaceholder(panel);
    });
}
// Pravý panel: editace zápisu
function renderEditNotePanel(note, panel, serviceId, entityTypeId, entityId, onSuccess) {
    var _a;
    panel.innerHTML = `
    <div class="editor-block animated-fadein" style="max-width:540px;min-height:180px;padding:1.3em 1.7em;">
      <form id="edit-note-form">
        <textarea id="edit-note-text" rows="7"
          style="width:100%;resize:vertical;min-height:110px;max-height:280px;font-size:1.07em;" class="input-lg">${escapeHtml((_a = note.text) !== null && _a !== void 0 ? _a : "")}</textarea>
        <div style="margin-top:1.2em;display:flex;gap:1em;">
          <button type="submit" class="button">Uložit změny</button>
          <button type="button" id="cancel-edit-note" class="button secondary">Zrušit</button>
        </div>
      </form>
    </div>
  `;
    const form = panel.querySelector("#edit-note-form");
    const textarea = panel.querySelector("#edit-note-text");
    const cancelBtn = panel.querySelector("#cancel-edit-note");
    form.onsubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const newText = textarea.value.trim();
        if (!newText)
            return;
        yield updateNote(serviceId, entityTypeId, entityId, note.id, { text: newText });
        onSuccess();
    });
    cancelBtn.addEventListener("click", () => {
        showNotePlaceholder(panel);
    });
}
// Placeholder pro pravý panel
function showNotePlaceholder(panel) {
    panel.innerHTML = `
    <div class="editor-block" style="max-width:540px;min-height:180px;opacity:.46;display:flex;align-items:center;justify-content:center;font-size:1.13em;color:#766b58;background:#fcf6e5;">
      <span>Zvolte zápis vlevo, nebo vytvořte nový…</span>
    </div>
  `;
}
// XSS-safe
function escapeHtml(text) {
    return text.replace(/[<>&"]/g, function (c) {
        return {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        }[c];
    });
}
