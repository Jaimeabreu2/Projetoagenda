// Pequeno módulo que cria um painel de acessibilidade.
// Objetivo: permitir que o usuário ative/desative opções (alto contraste, fonte maior, etc.)
// As preferências são guardadas em localStorage para persistirem entre visitas.
(function(){
  const KEY = 'projetoAgendaA11y';
  // valores padrão caso não exista nada em localStorage
  const defaults = { highContrast:false, largeFont:false, moreSpacing:false, reduceMotion:false };
  // recupera estado salvo (se houver) e mistura com defaults
  const state = Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || '{}'));

  // Aplica as classes no <html> de acordo com o estado atual.
  // Isso faz com que o CSS já preparado altere visualmente a página.
  function apply() {
    document.documentElement.classList.toggle('a11y-high-contrast', !!state.highContrast);
    document.documentElement.classList.toggle('a11y-large-font', !!state.largeFont);
    document.documentElement.classList.toggle('a11y-more-spacing', !!state.moreSpacing);
    document.documentElement.classList.toggle('a11y-reduce-motion', !!state.reduceMotion);
  }

  // Salva o estado atual no localStorage (chamado sempre que o usuário altera uma opção)
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }

  // Constrói o widget de acessibilidade e injeta no DOM.
  // O widget é um pequeno painel com checkboxes que controlam o 'state'.
  function buildWidget(){
    const root = document.createElement('div');
    root.id = 'a11yWidget';
    root.innerHTML = `
      <button class="a11y-toggle-btn" aria-label="Acessibilidade" aria-expanded="false" title="Acessibilidade">
        <span aria-hidden="true" style="font-weight:700">aA</span>
      </button>
      <div class="panel" role="dialog" aria-label="Opções de acessibilidade" aria-hidden="true">
        <h4>Acessibilidade</h4>
        <label class="row"><span>Alto contraste</span><span class="a11y-switch"><input type="checkbox" data-key="highContrast" aria-label="Alto contraste"></span></label>
        <label class="row"><span>Fonte maior</span><span class="a11y-switch"><input type="checkbox" data-key="largeFont" aria-label="Fonte maior"></span></label>
        <label class="row"><span>Mais espaçamento</span><span class="a11y-switch"><input type="checkbox" data-key="moreSpacing" aria-label="Mais espaçamento"></span></label>
        <label class="row"><span>Reduzir animações</span><span class="a11y-switch"><input type="checkbox" data-key="reduceMotion" aria-label="Reduzir animações"></span></label>
        <div style="text-align:right;margin-top:8px"><button id="a11yReset" class="btn secondary" type="button">Resetar</button></div>
      </div>
    `;
    document.body.appendChild(root);

    const toggleBtn = root.querySelector('.a11y-toggle-btn');
    const panel = root.querySelector('.panel');

    // Abre/fecha o painel; quando abre, foca o primeiro controle para navegação por teclado.
    function open(close) {
      const isOpen = root.classList.toggle('open', close !== true);
      panel.setAttribute('aria-hidden', String(!isOpen));
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      if(isOpen) {
        const first = root.querySelector('input[data-key]');
        if(first) first.focus();
      } else {
        toggleBtn.focus();
      }
    }

    toggleBtn.addEventListener('click', ()=> open());
    toggleBtn.addEventListener('keydown', (e)=> { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

    // Inicializa os checkboxes com o estado atual (permite que o widget reflita localStorage)
    Object.keys(state).forEach(k => {
      const cb = root.querySelector(`input[data-key="${k}"]`);
      if(cb) cb.checked = !!state[k];
    });

    // Ao mudar qualquer checkbox atualiza o estado, aplica classes e salva.
    root.querySelectorAll('input[data-key]').forEach(inp => {
      inp.addEventListener('change', (e)=>{
        const k = e.target.getAttribute('data-key');
        state[k] = e.target.checked;
        apply(); save();
      });
      // permite alternar com a barra de espaço no teclado
      inp.addEventListener('keydown', (e)=>{ if(e.key === ' ') { e.preventDefault(); inp.checked = !inp.checked; inp.dispatchEvent(new Event('change')); } });
    });

    // Botão reset: volta ao padrão e atualiza visual/estado
    root.querySelector('#a11yReset').addEventListener('click', ()=>{
      Object.assign(state, defaults); save();
      root.querySelectorAll('input[data-key]').forEach(cb => cb.checked = !!state[cb.getAttribute('data-key')]);
      apply();
      toggleBtn.focus();
    });

    // Fecha o painel ao apertar ESC ou clicar fora do widget
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') { root.classList.remove('open'); panel.setAttribute('aria-hidden','true'); toggleBtn.setAttribute('aria-expanded','false'); } });
    document.addEventListener('click', (ev)=> {
      if (!root.contains(ev.target) && root.classList.contains('open')) {
        root.classList.remove('open'); panel.setAttribute('aria-hidden','true'); toggleBtn.setAttribute('aria-expanded','false');
      }
    });
  }

  // Se DOM ainda não estiver pronto, espera; caso contrário aplica e constrói widget imediatamente.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=>{ apply(); buildWidget(); });
  } else { apply(); buildWidget(); }
})();