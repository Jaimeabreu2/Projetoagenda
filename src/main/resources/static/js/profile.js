(function(){

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

      // avatar upload preview
      changeAvatarBtn.addEventListener('click', ()=> avatarInput.click());
      avatarInput.addEventListener('change', (e)=>{
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = function(ev){
          user.avatarData = ev.target.result; // base64 URL
          load();
        };
        reader.readAsDataURL(f);
      });

      // avatar upload
      // BACKEND: upload de avatar
      // POST /users/:id/avatar
      // - body: FormData { file: Blob }
      // - resposta: { success: true, avatarUrl: '/static/avatars/123.png' }
      // Dica: usar fetch(..., { method:'POST', body: formData, credentials:'include' })

      // excluir conta (simulação): confirma e redireciona
      deleteAccountBtn.addEventListener('click', ()=> {
        if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível (simulação).')) return;
        // simulamos remoção local e redirecionamento para index
        alert('Conta excluída (simulação). Você será redirecionado.');
        window.location.href = 'index.html';
      });

      // logout simples (navega para index)
      document.getElementById('logoutBtn').addEventListener('click', ()=> {
        // limpar sessões, tokens etc. quando integrar; por enquanto redireciona
        window.location.href = 'index.html';
      });
    })();