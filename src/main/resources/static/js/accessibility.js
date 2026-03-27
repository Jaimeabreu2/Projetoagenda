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
    // garantir que não haja classe global que possa interferir com o ajuste via JS
    document.documentElement.classList.remove('a11y-large-font');
    document.documentElement.classList.toggle('a11y-more-spacing', !!state.moreSpacing);
    document.documentElement.classList.toggle('a11y-reduce-motion', !!state.reduceMotion);

    // Feedback para leitores de tela — usa ID padronizado 'a11yAnnounce'
    let live = document.getElementById('a11yAnnounce');
    if (!live) {
      live = document.createElement('div');
      live.id = 'a11yAnnounce';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      live.style.position = 'absolute';
      live.style.left = '-9999px';
      live.style.height = '1px';
      live.style.overflow = 'hidden';
      document.body.appendChild(live);
    }
    let msg = [];
    if (state.highContrast) msg.push('Alto contraste ativado');
    if (state.largeFont) msg.push('Fonte maior ativada');
    if (state.moreSpacing) msg.push('Mais espaçamento ativado');
    if (state.reduceMotion) msg.push('Redução de animações ativada');
    if (msg.length === 0) msg.push('Acessibilidade padrão');
    live.textContent = msg.join(', ');

    // Dispara evento customizado para que outros módulos reajam
    try {
      const ev = new CustomEvent('a11ychange', { detail: Object.assign({}, state) });
      document.dispatchEvent(ev);
    } catch (err) { /* ignore */ }

    // Aplica ajuste texto controlado (inline) apenas aos elementos de agenda
    applyTextScale();
  }

  // Debounce helper
  function debounce(fn, wait){
    let t;
    return function(...args){
      clearTimeout(t);
      t = setTimeout(()=> fn.apply(this, args), wait);
    };
  }

  // Aplica/Remove aumento controlado para elementos textuais relevantes.
  function applyTextScale() {
    // Aplica zoom de 35% em todo o conteúdo do body, exceto widget de acessibilidade
    const scale = state.largeFont ? 1.35 : 1;
    const body = document.body;
    const widget = document.getElementById('a11yWidget');
    body.style.fontSize = '';
    if (widget) widget.style.fontSize = '';
    if (state.largeFont) {
      body.style.fontSize = (16 * scale) + 'px';
      if (widget) widget.style.fontSize = '16px';
    }

    // Para garantir que elementos específicos (caso usem px fixo) também recebam o ajuste
    const selectors = [
      '.appt-body',
      '.badge',
      '.calendar-cell .day-num',
      '.month-title',
      '.calendar-title',
      '.month-meta .count'
    ];
    const elems = selectors.reduce((acc, s) => acc.concat(Array.from(document.querySelectorAll(s))), []);
    const candidates = Array.from(new Set(elems));
    candidates.forEach(el => {
      el.style.fontSize = '';
      if (state.largeFont) {
        const prevInline = el.style.fontSize || '';
        el.style.fontSize = '';
        let computedRaw = '';
        try { computedRaw = getComputedStyle(el).fontSize || ''; } catch (e) { computedRaw = ''; }
        let computed = computedRaw ? parseFloat(computedRaw.replace('px','')) : null;
        if (!computed || isNaN(computed)) computed = 16;
        el.style.fontSize = prevInline;
        el.style.fontSize = (computed * scale).toFixed(2) + 'px';
      }
    });
  }

  // observe DOM changes and reapply scale if new agenda elements appear
  const debouncedApplyTextScale = debounce(() => {
    try { applyTextScale(); } catch (err) { /* ignore */ }
  }, 120);

  // only create observer if MutationObserver supported
  if (typeof MutationObserver !== 'undefined') {
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length > 0) {
          debouncedApplyTextScale();
          break;
        }
      }
    });
    try {
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) { /* ignore if observe fails */ }
  }

  // Salva o estado atual no localStorage (chamado sempre que o usuário altera uma opção)
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }

  // Constrói o widget de acessibilidade e injeta no DOM.
  // O widget é um pequeno painel com checkboxes que controlam o 'state'.
  function buildWidget(){
    const root = document.createElement('div');
    root.id = 'a11yWidget';
    root.innerHTML = `
      <button class="a11y-toggle-btn" aria-label="Acessibilidade" aria-expanded="false" title="Acessibilidade" tabindex="0">
        <span aria-hidden="true" style="font-weight:700">aA</span>
      </button>
      <div id="a11yPanel" class="panel" role="dialog" aria-label="Opções de acessibilidade" aria-modal="true" aria-hidden="true" tabindex="-1">
        <h4 id="a11yPanelTitle">Acessibilidade</h4>
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

    // associação explícita
    toggleBtn.setAttribute('aria-controls', 'a11yPanel');

    // Estado de abertura do painel
    let isOpen = false;

    function openPanel() {
      isOpen = true;
      root.classList.add('open');
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      panel.focus();
      toggleBtn.setAttribute('aria-expanded', 'true');
      // Foca o primeiro controle
      const first = root.querySelector('input[data-key]');
      if(first) first.focus();
      // em dispositivos pequenos, garantir scroll para visibilidade
      if (window.innerWidth <= 600) panel.scrollIntoView({ behavior: document.documentElement.classList.contains('a11y-reduce-motion') ? 'auto' : 'smooth', block: 'center' });
    }
    function closePanel() {
      isOpen = false;
      root.classList.remove('open');
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.focus();
    }

    // Navegação por Tab: fecha painel ao sair do último elemento com Shift+Tab
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusables = Array.from(panel.querySelectorAll('input,button'));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });

    // Toggle ao clicar no botão
    toggleBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      if(isOpen) closePanel();
      else openPanel();
    });
    toggleBtn.addEventListener('keydown', (e)=> {
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleBtn.click(); }
    });

    // Fecha ao clicar fora
    document.addEventListener('mousedown', (ev)=>{
      if (!root.contains(ev.target) && isOpen) closePanel();
    });
    // Fecha ao pressionar ESC
    document.addEventListener('keydown', (e)=>{
      if (isOpen && e.key === 'Escape') closePanel();
    });

    // Inicializa os checkboxes com o estado atual
    Object.keys(state).forEach(k => {
      const cb = root.querySelector(`input[data-key="${k}"]`);
      if(cb && typeof state[k] === 'boolean') cb.checked = !!state[k];
    });

    // Atualiza estado ao mudar qualquer checkbox
    root.querySelectorAll('input[data-key]').forEach(inp => {
      inp.addEventListener('change', (e)=>{
        const k = e.target.getAttribute('data-key');
        state[k] = e.target.checked;
        apply(); save();
      });
      inp.addEventListener('keydown', (e)=>{ if(e.key === ' ') { e.preventDefault(); inp.checked = !inp.checked; inp.dispatchEvent(new Event('change')); } });
    });

    // Botão reset
    root.querySelector('#a11yReset').addEventListener('click', ()=>{
      Object.assign(state, defaults); save();
      root.querySelectorAll('input[data-key]').forEach(cb => cb.checked = !!state[cb.getAttribute('data-key')]);
      apply();
      closePanel();
    });

    // Aplica classes iniciais
    apply();
  }

  // Se DOM ainda não estiver pronto, espera; caso contrário aplica e constrói widget imediatamente.
  function initA11y() {
    apply();
    // Garante reaplicação após carregamento completo (caso elementos sejam inseridos depois do DOMContentLoaded)
    setTimeout(applyTextScale, 1);
    window.addEventListener('load', applyTextScale);
    document.addEventListener('DOMContentLoaded', applyTextScale);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=>{ initA11y(); buildWidget(); });
  } else { initA11y(); buildWidget(); }

  // expose API simples para outros scripts
  window.A11y = {
    get state() { return Object.assign({}, state); },
    set(key, value){ if (key in state) { state[key] = !!value; apply(); save(); } },
    toggle(key){ if (key in state) { state[key] = !state[key]; apply(); save(); } },
    onChange(fn){ document.addEventListener('a11ychange', (e)=>fn(e.detail)); }
  };
})();