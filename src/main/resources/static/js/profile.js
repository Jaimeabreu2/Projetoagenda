(function () {
    const user = {
        name: 'João Silva',
        email: 'joao.silva@aluno.uece.br',
        notifyEmail: true,
        notifyWeekly: false,
        createdAt: '2022-03-15T10:30:00Z',
        lastLogin: new Date().toISOString(),
        avatarData: null
    };

    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const avatar = document.getElementById('avatarInitials');
    const avatarInput = document.getElementById('avatarInput');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const createdAtEl = document.getElementById('createdAt');
    const lastLoginEl = document.getElementById('lastLogin');
    const notifyEmailEl = document.getElementById('notifyEmail');
    const notifyWeeklyEl = document.getElementById('notifyWeekly');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const profileForm = document.getElementById('profileForm');
    const error = document.getElementById('error');

    function initialsFromName(n) {
        return n.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
    }

    function load() {
        fullName.value = user.name;
        email.value = user.email;
        avatar.textContent = initialsFromName(user.name || 'US');
        if (user.avatarData) {
            avatar.style.backgroundImage = `url(${user.avatarData})`;
            avatar.textContent = '';
            avatar.style.backgroundSize = 'cover';
        } else {
            avatar.style.backgroundImage = '';
            avatar.style.backgroundSize = '';
            avatar.textContent = initialsFromName(user.name || 'US');
        }
        notifyEmailEl.checked = !!user.notifyEmail;
        notifyWeeklyEl.checked = !!user.notifyWeekly;
        createdAtEl.textContent = new Date(user.createdAt).toLocaleString();
        lastLoginEl.textContent = new Date(user.lastLogin).toLocaleString();
    }

    load();

    changeAvatarBtn.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
            user.avatarData = ev.target.result;
            load();
        };
        reader.readAsDataURL(f);
    });

    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        error.style.display = 'none';
        const nameVal = fullName.value.trim();
        const emailVal = user.email;
        const currentPwd = document.getElementById('pwd').value;
        const newPwd = document.getElementById('newPwd').value;
        const confirmPwd = document.getElementById('confirmPwd').value;

        if (!nameVal || !emailVal) {
            error.textContent = 'Nome é obrigatório. O e-mail institucional não pode ser alterado aqui.';
            error.style.display = '';
            return;
        }
        if (newPwd || confirmPwd || currentPwd) {
            if (!currentPwd) {
                error.textContent = 'Informe a senha atual para alterar a senha.';
                error.style.display = '';
                return;
            }
            if (newPwd.length < 6) {
                error.textContent = 'A nova senha deve ter ao menos 6 caracteres.';
                error.style.display = '';
                return;
            }
            if (newPwd !== confirmPwd) {
                error.textContent = 'A confirmação da nova senha não corresponde.';
                error.style.display = '';
                return;
            }
        }

        user.name = nameVal;
        user.notifyEmail = !!notifyEmailEl.checked;
        user.notifyWeekly = !!notifyWeeklyEl.checked;
        user.lastLogin = new Date().toISOString();
        load();

        const t = document.getElementById('saveSuccess');
        t.textContent = 'Alterações salvas';
        t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 2000);
    });

    deleteAccountBtn.addEventListener('click', () => {
        if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível (simulação).')) return;
        alert('Conta excluída (simulação). Você será redirecionado.');
        window.location.href = 'index.html';
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
})();
