document.addEventListener('DOMContentLoaded', function () {
      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');
      const avatar = document.getElementById('avatarInitials');
      const avatarInput = document.getElementById('avatarInput');
      const changeAvatarBtn = document.getElementById('changeAvatarBtn');
      const deleteAccountBtn = document.getElementById('deleteAccountBtn');
      const profileForm = document.getElementById('profileForm');
      const error = document.getElementById('error');

      // avatar upload preview (protegido: apenas se elementos existirem)
      if (changeAvatarBtn && avatarInput) {
        changeAvatarBtn.addEventListener('click', ()=> avatarInput.click());
        avatarInput.addEventListener('change', (e)=>{
          const f = e.target.files && e.target.files[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = function(ev){
            // ...existing preview handling if you have a load/save flow...
            // user.avatarData = ev.target.result; // exemplo: precisa de implementação load()
          };
          reader.readAsDataURL(f);
        });
      }

      // excluir conta: se já houver modal (confirmDeleteModal) deixamos que o modal controle a ação
      const modalExists = !!document.getElementById('confirmDeleteModal');
      if (deleteAccountBtn && !modalExists) {
        deleteAccountBtn.addEventListener('click', ()=> {
          if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível (simulação).')) return;
          alert('Conta excluída (simulação). Você será redirecionado.');
          window.location.href = '/';
        });
      }

      // logout simples (navega para index) — protege existência do botão
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', ()=> {
          window.location.href = '/';
        });
      }
    });