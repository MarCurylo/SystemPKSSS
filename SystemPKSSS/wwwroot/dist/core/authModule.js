var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function renderAuthForms() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h2>Přihlášení</h2>
                <form id="loginForm">
                    <div class="mb-2">
                        <label for="login-username" class="form-label">Jméno</label>
                        <input id="login-username" name="username" class="form-control" required>
                    </div>
                    <div class="mb-2">
                        <label for="login-password" class="form-label">Heslo</label>
                        <input id="login-password" name="password" type="password" class="form-control" required>
                    </div>
                    <button class="btn btn-primary">Přihlásit</button>
                </form>
            </div>
            <div class="col-md-6">
                <h2>Registrace</h2>
                <form id="registerForm">
                    <div class="mb-2">
                        <label for="reg-username" class="form-label">Jméno</label>
                        <input id="reg-username" name="username" class="form-control" required>
                    </div>
                    <div class="mb-2">
                        <label for="reg-email" class="form-label">Email</label>
                        <input id="reg-email" name="email" type="email" class="form-control" required>
                    </div>
                    <div class="mb-2">
                        <label for="reg-password" class="form-label">Heslo</label>
                        <input id="reg-password" name="password" type="password" class="form-control" required>
                    </div>
                    <div class="mb-2">
                        <label for="reg-role" class="form-label">Role</label>
                        <select id="reg-role" name="role" class="form-select" required>
                            <option value="Uživatel">Uživatel</option>
                        </select>
                    </div>
                    <button class="btn btn-success">Registrovat</button>
                </form>
            </div>
        </div>
        <div id="auth-info" class="mt-3"></div>
    `;
    function formToObj(form) {
        const obj = {};
        new FormData(form).forEach((value, key) => {
            obj[key] = value.toString();
        });
        return obj;
    }
    // Přihlašovací logika
    const loginForm = document.getElementById('loginForm');
    loginForm.onsubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const data = formToObj(loginForm);
        const infoDiv = document.getElementById('auth-info');
        infoDiv.innerText = "Přihlašuji...";
        try {
            const res = yield fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data), // { username, password }
            });
            if (res.ok) {
                infoDiv.innerText = "Přihlášení úspěšné! Za chvilku budete přesměrováni.";
                setTimeout(() => {
                    window.location.hash = "#/";
                    window.location.reload();
                }, 1000);
            }
            else {
                infoDiv.innerText = "Chyba přihlášení! Zkontrolujte jméno a heslo.";
            }
        }
        catch (err) {
            infoDiv.innerText = "Chyba komunikace se serverem!";
        }
    });
    // Registrační logika
    const registerForm = document.getElementById('registerForm');
    registerForm.onsubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const data = formToObj(registerForm);
        const infoDiv = document.getElementById('auth-info');
        infoDiv.innerText = "Odesílám registraci...";
        try {
            const res = yield fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data), // { username, email, password, role }
            });
            if (res.ok) {
                infoDiv.innerText = "Uživatel úspěšně zaregistrován! Můžete se přihlásit.";
            }
            else {
                const error = yield res.json().catch(() => ({}));
                infoDiv.innerText = "Chyba registrace: " + (error.message || JSON.stringify(error));
            }
        }
        catch (err) {
            infoDiv.innerText = "Chyba komunikace se serverem!";
        }
    });
}
