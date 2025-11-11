(function(){
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorMsg = document.getElementById('errorMsg');
    const signupBtn = document.getElementById('signupBtn');
    const signupForm = document.getElementById('signupForm');
    const signupSubmit = document.getElementById('signupSubmit');
    const signupError = document.getElementById('signupError');
    const backToLogin = document.getElementById('backToLogin');
    const formTitle = document.getElementById('form-title');

    // pega a URL do Thymeleaf
    const calendarUrl = submitBtn.dataset.calendarUrl;

    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        errorMsg.style.display = 'none';

        const formData = new FormData(loginForm);
        const body = new URLSearchParams();
        for (const [k,v] of formData.entries()) body.append(k, v);

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Entrando...';

        fetch('/login/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            redirect: 'follow'
        }).then(response => {
            if (response.redirected) {
                window.location.href = response.url;
                return;
            }
            if (response.ok) {
                window.location.href = calendarUrl;
                return;
            }
            if (response.status >= 400 && response.status < 500) {
                return response.text().then(txt => { throw new Error(txt || 'Credenciais inválidas'); });
            }
            window.location.href = calendarUrl;
        }).catch(err => {
            console.warn('Auth fetch failed, fallback to local redirect', err);
            window.location.href = calendarUrl;
        }).finally(() => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Entrar';
        });
    });

    const signupPwd = document.getElementById('signupSenha');
    const signupPwd2 = document.getElementById('signupSenha2');
    const pwdMatch = document.getElementById('pwdMatch');

    function checkPasswordsMatch() {
        const a = signupPwd.value;
        const b = signupPwd2.value;

        if (!a && !b) {
            pwdMatch.textContent = '';
            signupSubmit.disabled = false;
            return;
        }

        if (a && b && a === b) {
            pwdMatch.textContent = 'As senhas coincidem.';
            pwdMatch.style.color = '#0a0';
            signupSubmit.disabled = false;
            return;
        }

        if (b) {
            pwdMatch.textContent = 'As senhas não conferem.';
            pwdMatch.style.color = '#c00';
        } else {
            pwdMatch.textContent = '';
        }
        signupSubmit.disabled = true;
    }

    signupPwd.addEventListener('input', checkPasswordsMatch);
    signupPwd2.addEventListener('input', checkPasswordsMatch);

    signupForm.addEventListener('submit', function(e){
        e.preventDefault();
        signupError.style.display = 'none';

        const payload = getSignupData();
        if (!payload.pass || !payload.pass2 || payload.pass !== payload.pass2) {
            signupError.textContent = 'As senhas não conferem.';
            signupError.style.display = '';
            return;
        }

        signupSubmit.disabled = true;
        signupSubmit.classList.add('loading');
        signupSubmit.textContent = 'Criando conta...';

        const formBody = new URLSearchParams({
            name: payload.name || '',
            user: payload.user || '',
            pass: payload.pass || ''
        });

        fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody.toString(),
            redirect: 'follow'
        }).then(response => {
            if (response.redirected) {
                window.location.href = response.url;
                return;
            }
            return response.text().then(txt => { throw new Error(txt || 'Erro ao criar conta'); });
        }).catch(err => {
            signupError.textContent = 'Erro ao criar conta. ' + (err.message || '');
            signupError.style.display = '';
        }).finally(()=> {
            signupSubmit.disabled = false;
            signupSubmit.classList.remove('loading');
            signupSubmit.textContent = 'Criar conta';
        });
    });

    checkPasswordsMatch();
})();

(function(){
    const form = document.querySelector('form[action="/login/auth"], form#loginForm');
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    let errEl = form.querySelector('#loginError');
    if(!errEl){
        errEl = document.createElement('div');
        errEl.id = 'loginError';
        errEl.className = 'error';
        errEl.style.display = 'none';
        form.appendChild(errEl);
    }

    form.addEventListener('submit', function(e){
        e.preventDefault();
        errEl.style.display = 'none';

        const formData = new FormData(form);
        const body = new URLSearchParams();
        for (const [k,v] of formData.entries()) body.append(k, v);

        if(submitBtn){
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
        }

        fetch('/login/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            redirect: 'follow'
        }).then(response => {
            if (response.redirected) {
                window.location.href = response.url;
                return;
            }
            if (response.ok) {
                window.location.href = 'calendarComAgenda.html';
                return;
            }
            if (response.status >= 400 && response.status < 500) {
                return response.text().then(txt => { throw new Error(txt || 'Erro na autenticação'); });
            }
            window.location.href = 'calendarComAgenda.html';
        }).catch(err => {
            console.warn('Auth fetch failed (generic handler), fallback to local redirect', err);
            window.location.href = 'calendarComAgenda.html';
        }).finally(() => {
            if(submitBtn){
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    });
})();
