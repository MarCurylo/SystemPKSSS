export function renderAuthForms() {
    const container = document.getElementById('main-container')!;
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
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <button class="btn btn-success">Registrovat</button>
                </form>
            </div>
        </div>
        <div id="auth-info" class="mt-3"></div>
    `;

    function formToObj(form: HTMLFormElement): Record<string, string> {
        const obj: Record<string, string> = {};
        new FormData(form).forEach((value, key) => {
            obj[key] = value.toString();
        });
        return obj;
    }

    // Přihlašovací logika
    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const data = formToObj(loginForm);
        const infoDiv = document.getElementById('auth-info')!;
        infoDiv.innerText = "Přihlašuji...";
        try {
            const res = await fetch('/api/login', {
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
            } else {
                infoDiv.innerText = "Chyba přihlášení! Zkontrolujte jméno a heslo.";
            }
        } catch (err) {
            infoDiv.innerText = "Chyba komunikace se serverem!";
        }
    };

    // Registrační logika
    const registerForm = document.getElementById('registerForm') as HTMLFormElement;
    registerForm.onsubmit = async (e) => {
        e.preventDefault();
        const data = formToObj(registerForm);
        const infoDiv = document.getElementById('auth-info')!;
        infoDiv.innerText = "Odesílám registraci...";
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data), // { username, email, password, role }
            });
            if (res.ok) {
                infoDiv.innerText = "Uživatel úspěšně zaregistrován! Můžete se přihlásit.";
            } else {
                const error = await res.json().catch(() => ({}));
                infoDiv.innerText = "Chyba registrace: " + (error.message || JSON.stringify(error));
            }
        } catch (err) {
            infoDiv.innerText = "Chyba komunikace se serverem!";
        }
    };
}
