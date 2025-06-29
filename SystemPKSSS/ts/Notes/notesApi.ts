import { Note, CreateNote, UpdateNote } from "./notesModel.js";

// Pomocná funkce na sestavení URL (aby se nemusel opakovat zápis všude)
function notesUrl(serviceId: number, entityTypeId: number, entityId: number, noteId?: number) {
  let url = `/services/${serviceId}/entityTypes/${entityTypeId}/entities/${entityId}/notes`;
  if (noteId !== undefined) url += `/${noteId}`;
  return url;
}

// Načte všechny poznámky k dané entitě
export async function loadNotes(serviceId: number, entityTypeId: number, entityId: number): Promise<Note[]> {
  const res = await fetch(notesUrl(serviceId, entityTypeId, entityId));
  if (!res.ok) throw new Error("Nelze načíst poznámky");
  return await res.json();
}

// Přidá novou poznámku k entitě
export async function createNote(serviceId: number, entityTypeId: number, entityId: number, note: CreateNote): Promise<Note> {
  const res = await fetch(notesUrl(serviceId, entityTypeId, entityId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note)
  });
  if (!res.ok) throw new Error("Nelze přidat poznámku");
  return await res.json();
}

// Načte detail jedné poznámky
export async function loadNote(serviceId: number, entityTypeId: number, entityId: number, noteId: number): Promise<Note> {
  const res = await fetch(notesUrl(serviceId, entityTypeId, entityId, noteId));
  if (!res.ok) throw new Error("Poznámka nenalezena");
  return await res.json();
}

// Aktualizuje poznámku
export async function updateNote(serviceId: number, entityTypeId: number, entityId: number, noteId: number, note: UpdateNote): Promise<void> {
  const res = await fetch(notesUrl(serviceId, entityTypeId, entityId, noteId), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note)
  });
  if (!res.ok) throw new Error("Nepodařilo se upravit poznámku");
}

// Smaže poznámku
export async function deleteNote(serviceId: number, entityTypeId: number, entityId: number, noteId: number): Promise<void> {
  const res = await fetch(notesUrl(serviceId, entityTypeId, entityId, noteId), {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Nepodařilo se smazat poznámku");
}
