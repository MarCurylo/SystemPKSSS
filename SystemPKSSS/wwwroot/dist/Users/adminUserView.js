// /ts/Users/adminUserView.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function renderAdminUsersTab(container) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('/api/users', { credentials: 'include' });
        if (!res.ok) {
            container.innerHTML = "<div class='text-danger'>Přístup jen pro adminy!</div>";
            return;
        }
        const users = yield res.json();
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
        const addForm = document.getElementById("addUserForm");
        const msg = document.getElementById("user-form-msg");
        if (addForm) {
            addForm.onsubmit = (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                msg.innerText = "";
                const data = {};
                (new FormData(addForm)).forEach((value, key) => {
                    data[key] = value;
                });
                const res = yield fetch('/api/users', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    renderAdminUsersTab(container); // reload
                }
                else {
                    const err = yield res.json().catch(() => ({}));
                    msg.innerText = err.message || "Chyba při přidání uživatele!";
                }
            });
        }
        // --- Handler na mazání ---
        container.querySelectorAll('.delete-user').forEach((btn) => {
            btn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                const id = btn.getAttribute('data-id');
                if (!confirm("Opravdu smazat uživatele?"))
                    return;
                yield fetch(`/api/users/${id}`, { method: "DELETE", credentials: "include" });
                renderAdminUsersTab(container); // reload tabulky
            }));
        });
        // --- Handler pro změnu role ---
        container.querySelectorAll('.user-role').forEach((sel) => {
            sel.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                const id = sel.getAttribute('data-id');
                const role = sel.value;
                yield fetch(`/api/users/${id}/role`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ Role: role })
                });
            }));
        });
    });
}
