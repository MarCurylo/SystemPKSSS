// /ts/Users/adminUserView.ts

export async function renderAdminUsersTab(container: HTMLElement) {
  const res = await fetch('/api/users', { credentials: 'include' });
  if (!res.ok) {
    container.innerHTML = "<div class='text-danger'>Přístup jen pro adminy!</div>";
    return;
  }
  const users = await res.json();

  let html = `
    <h2>Správa uživatelů</h2>
    <form id="addUserForm" class="mb-4 border rounded p-3">
      <div class="row g-2 align-items-end">
        <div class="col"><input class="form-control" name="username" placeholder="Jméno" required></div>
        <div class="col"><input class="form-control" name="email" placeholder="Email" required type="email"></div>
        <div class="col"><input class="form-control" name="password" placeholder="Heslo" required type="password" minlength="6"></div>
        <div class="col">
          <select class="form-select" name="role" required>
            <option value="Uživatel">Uživatel</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div class="col-auto">
          <button class="btn btn-success" type="submit">Přidat</button>
        </div>
      </div>
      <div id="user-form-msg" class="form-text text-danger"></div>
    </form>
    <table class="table table-sm table-bordered">
      <thead>
        <tr><th>Jméno</th><th>Email</th><th>Role</th><th>Akce</th></tr>
      </thead>
      <tbody>
  `;

  for (const u of users) {
    html += `<tr>
      <td>${u.userName || ""}</td>
      <td>${u.email || ""}</td>
      <td>
        <select class="form-select form-select-sm user-role" data-id="${u.id}">
          <option value="Uživatel" ${u.role === "Uživatel" ? "selected" : ""}>Uživatel</option>
          <option value="Admin" ${u.role === "Admin" ? "selected" : ""}>Admin</option>
        </select>
      </td>
      <td>
        <button data-id="${u.id}" class="btn btn-sm btn-danger delete-user">Smazat</button>
      </td>
    </tr>`;
  }
  html += "</tbody></table>";
  container.innerHTML = html;

  // --- Handler pro přidání uživatele ---
  const addForm = document.getElementById("addUserForm") as HTMLFormElement;
  const msg = document.getElementById("user-form-msg") as HTMLElement;
  if (addForm) {
    addForm.onsubmit = async e => {
      e.preventDefault();
      msg.innerText = "";
      const data: any = {};
      (new FormData(addForm)).forEach((value, key) => {
        data[key] = value;
      });

      const res = await fetch('/api/users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      if (res.ok) {
        renderAdminUsersTab(container); // reload
      } else {
        const err = await res.json().catch(() => ({}));
        msg.innerText = err.message || "Chyba při přidání uživatele!";
      }
    };
  }

  // --- Handler na mazání ---
  container.querySelectorAll('.delete-user').forEach((btn: Element) => {
    btn.addEventListener('click', async () => {
      const id = (btn as HTMLElement).getAttribute('data-id');
      if (!confirm("Opravdu smazat uživatele?")) return;
      await fetch(`/api/users/${id}`, { method: "DELETE", credentials: "include" });
      renderAdminUsersTab(container); // reload tabulky
    });
  });

  // --- Handler pro změnu role ---
  container.querySelectorAll('.user-role').forEach((sel: Element) => {
    sel.addEventListener('change', async () => {
      const id = (sel as HTMLSelectElement).getAttribute('data-id');
      const role = (sel as HTMLSelectElement).value;
      await fetch(`/api/users/${id}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Role: role })
      });
    });
  });
}
