(function () {
    const content = document.getElementById('calendarContent');
    const title = document.getElementById('calendarTitle');
    const weekdayLabels = document.getElementById('weekdayLabels');
    const agendaMonthLabel = document.getElementById('agendaMonthLabel');

    const goTodayBtn = document.getElementById('goTodayBtn');
    const exportBtn = document.getElementById('exportBtn');
    const eventSearch = document.getElementById('eventSearch');
    const exportListBtn = document.getElementById('exportListBtn');
    const eventsListEl = document.getElementById('eventsList');

    let view = 'month';
    const qs = new URLSearchParams(window.location.search);
    const startY = qs.has('y') ? parseInt(qs.get('y'), 10) : null;
    const startM = qs.has('m') ? parseInt(qs.get('m'), 10) : null;
    const startD = qs.has('d') ? parseInt(qs.get('d'), 10) : null;
    let current = startY || startM !== null ? new Date(startY || new Date().getFullYear(), startM || 0, startD || 1) : new Date();

    const storedEvents = [];
    // helper: formata ISO "YYYY-MM-DD" ou número -> "dd/MM/yyyy"; se já for "dd/MM/yyyy" retorna direto
    function formatDayLabel(day) {
      if (typeof day === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(day)) {
        return day; // já no formato brasileiro
      }
      if (typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day)) {
        const [y,m,d] = day.split('-');
        return `${d}/${m}/${y}`;
      }
      if (typeof day === 'number' && !isNaN(day)) {
        const dd = String(day).padStart(2,'0');
        const mm = String(current.getMonth() + 1).padStart(2,'0');
        const yyyy = String(current.getFullYear());
        return `${dd}/${mm}/${yyyy}`;
      }
      return String(day || '');
    }

    function parseInitialAppointments() {
        if (!eventsListEl) return;
        const nodes = Array.from(eventsListEl.querySelectorAll('.appointment'));
        nodes.forEach(n => {
            const badgeEl = n.querySelector('.badge');
            let badge = badgeEl?.textContent?.trim();
            const title = n.querySelector('.appt-body strong')?.textContent?.trim();
            const note = n.querySelector('.appt-body small')?.textContent?.trim();
            // se badge estiver em ISO, formata visualmente
            if (badge && /^\d{4}-\d{2}-\d{2}$/.test(badge)) {
              badgeEl.textContent = formatDayLabel(badge);
            }
            // tenta extrair dia numérico (mantemos storedEvents para listagem)
            const dayNum = /^\d{4}-\d{2}-\d{2}$/.test(badge) ? badge : (badge ? parseInt(badge, 10) : null);
            if (title && dayNum) storedEvents.push({ day: dayNum, title, note });
        });
    }
    parseInitialAppointments();

    function _dayNumberFromEvt(evt) {
      if (typeof evt.day === 'number') return evt.day;
      if (typeof evt.day === 'string') {
        // ISO date "YYYY-MM-DD"
        if (/^\d{4}-\d{2}-\d{2}$/.test(evt.day)) {
          const d = new Date(evt.day);
          if (!isNaN(d)) return d.getDate();
        }
        // dd/MM/yyyy -> extract day
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(evt.day)) return parseInt(evt.day.split('/')[0],10);
        const n = parseInt(evt.day,10);
        if (!isNaN(n)) return n;
      }
      return null;
    }

    function _markCalendarCell(day, type) {
      if (!content) return;
      const cells = Array.from(content.querySelectorAll('.calendar-cell:not(.empty)'));
      for (const c of cells) {
        const numEl = c.querySelector('.day-num');
        if (!numEl) continue;
        const num = parseInt(numEl.textContent, 10);
        if (num === day) {
          c.classList.add('has-event');
          let dot = c.querySelector('.event-dot');
          if (!dot) {
            dot = document.createElement('div');
            dot.className = 'event-dot';
            c.appendChild(dot);
          }
          // aplica tipo se houver (classe evt-type-*)
          if (type) {
            dot.classList.remove(...Array.from(dot.classList).filter(cl=>cl.startsWith('evt-type-')));
            dot.classList.add('evt-type-' + type);
          }

          // pulso visual: adiciona classe e remove após animação
          try {
            // respeitar preferência reduzir animações
            if (!document.documentElement.classList.contains('a11y-reduce-motion')) {
              c.classList.remove('pulse'); // reinicia caso já esteja
              // forçar reflow para reiniciar a animação
              // eslint-disable-next-line no-unused-expressions
              void c.offsetWidth;
              c.classList.add('pulse');
              const onEnd = () => { c.classList.remove('pulse'); c.removeEventListener('animationend', onEnd); };
              c.addEventListener('animationend', onEnd, { once: true });
              // fallback: garante remoção após 1.1s se animationend não disparar
              setTimeout(() => c.classList.remove('pulse'), 1200);
            }
          } catch (err) {
            // silencioso — não quebrar fluxo se algo falhar
          }

          break;
        }
      }
    }

    /* aplicar marcação imediata quando adicionar à lista */
    function addEventToList(evt) {
        storedEvents.push(evt);
        const item = document.createElement('div'); item.className = 'appointment';
        // se o evento vier marcado como criado pelo usuário, adiciona classe para estilo
        if (evt.user) item.classList.add('user-event');
        // aplica classe por tipo (ex: evt-type-prova)
        if (evt.type) item.classList.add('evt-type-' + evt.type);
        const b = document.createElement('div'); b.className = 'badge';
        b.textContent = formatDayLabel(evt.day);
        const body = document.createElement('div'); body.className = 'appt-body';
        const strong = document.createElement('strong'); strong.textContent = evt.title;
        const small = document.createElement('small'); small.style.display = 'block'; small.style.color = 'rgba(15,23,42,0.6)';
        small.textContent = (evt.time ? evt.time + ' • ' : '') + (evt.note || '');
        body.appendChild(strong); body.appendChild(small);
        item.appendChild(b); item.appendChild(body);
        eventsListEl.appendChild(item);

        // marca célula do calendário imediatamente (feedback visual)
        const dayNum = _dayNumberFromEvt(evt);
        if (dayNum) {
          if (!eventDays.includes(dayNum)) eventDays.push(dayNum);
          _markCalendarCell(dayNum, evt.type);
        }
    }

    function filterEvents(q) {
        const ql = (q || '').trim().toLowerCase();
        Array.from(eventsListEl.children).forEach(item => {
            const text = (item.innerText || '').toLowerCase();
            item.style.display = ql ? (text.includes(ql) ? '' : 'none') : '';
        });
    }
    if (eventSearch) eventSearch.addEventListener('input', (e) => filterEvents(e.target.value));

    function downloadJSON(filename, data) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
        a.download = filename;
        document.body.appendChild(a); a.click(); a.remove();
    }
    if (exportBtn) exportBtn.addEventListener('click', () => downloadJSON('agenda-events.json', storedEvents));
    if (exportListBtn) exportListBtn.addEventListener('click', () => downloadJSON('agenda-events.json', storedEvents));

    if (goTodayBtn) goTodayBtn.addEventListener('click', () => { current = new Date(); render(); });

    function clearContent() { content.innerHTML = ''; selectedIndex = null; }

    function announce(text) {
        let live = document.getElementById('a11yAnnounce');
        if (!live) { live = document.createElement('div'); live.id = 'a11yAnnounce'; live.setAttribute('aria-live', 'polite'); live.style.position = 'absolute'; live.style.left = '-9999px'; document.body.appendChild(live); }
        live.textContent = text;
    }

    function makeCell(day) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.setAttribute('role', 'gridcell');
        cell.tabIndex = -1;
        const dayNum = document.createElement('div'); dayNum.className = 'day-num'; dayNum.textContent = day;
        cell.appendChild(dayNum);
        const ev = document.createElement('div'); ev.className = 'event-info';
        ev.innerHTML = '<span class="event-dot"></span>';
        cell.appendChild(ev);
        if (eventDays.includes(day)) cell.classList.add('has-event');
        return cell;
    }

    function focusCellByIndex(idx) {
        const cells = Array.from(content.querySelectorAll('.calendar-cell:not(.empty)'));
        if (!cells[idx]) return;
        cells.forEach(c => c.tabIndex = -1);
        const c = cells[idx];
        c.tabIndex = 0;
        c.focus();
        content.querySelectorAll('.calendar-cell.selected').forEach(x => x.classList.remove('selected'));
        c.classList.add('selected');
        selectedIndex = idx;
        const num = c.querySelector('.day-num')?.textContent || '';
        announce(`${num} de ${current.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`);
    }

    function renderMonth() {
        clearContent();
        content.classList.remove('week-view', 'day-view');
        weekdayLabels.style.display = 'grid';
        const first = new Date(current.getFullYear(), current.getMonth(), 1);
        const last = new Date(current.getFullYear(), current.getMonth() + 1, 0);
        const startDay = first.getDay();
        const daysInMonth = last.getDate();
        title.textContent = first.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        agendaMonthLabel.textContent = first.toLocaleString('pt-BR', { month: 'long' });
        announce(title.textContent);
        for (let i = 0; i < startDay; i++) {
            const empty = document.createElement('div'); empty.className = 'calendar-cell empty'; empty.setAttribute('aria-hidden', 'true');
            content.appendChild(empty);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div'); cell.className = 'calendar-cell';
            const num = document.createElement('div'); num.className = 'day-num'; num.textContent = day;
            cell.appendChild(num);
            if (eventDays.includes(day)) {
                cell.classList.add('has-event');
                const dot = document.createElement('div'); dot.className = 'event-dot'; cell.appendChild(dot);
            }
            cell.addEventListener('click', () => {
                const y = current.getFullYear();
                const m = current.getMonth();
                // abrir a tela de adicionar evento já com ano/mês/dia preenchidos
                window.location.href = `/addEventScreen?y=${y}&m=${m}&d=${day}`;
            });
            content.appendChild(cell);
        }
        const total = startDay + daysInMonth;
        const trailing = (7 - (total % 7)) % 7;
        for (let i = 0; i < trailing; i++) { const empty = document.createElement('div'); empty.className = 'calendar-cell empty'; empty.setAttribute('aria-hidden', 'true'); content.appendChild(empty); }
        const nonEmpty = Array.from(content.querySelectorAll('.calendar-cell:not(.empty)'));
        const today = new Date();
        let initialIdx = 0;
        if (today.getMonth() === current.getMonth() && today.getFullYear() === current.getFullYear()) {
            const idx = today.getDate() - 1;
            initialIdx = idx;
        }
        focusCellByIndex(initialIdx);
    }

    function renderWeek() {
        clearContent();
        content.classList.add('week-view'); content.classList.remove('day-view'); weekdayLabels.style.display = 'grid';
        const cur = new Date(current); const dayOfWeek = cur.getDay();
        const sunday = new Date(cur); sunday.setDate(cur.getDate() - dayOfWeek);
        const endDate = new Date(sunday); endDate.setDate(sunday.getDate() + 6);
        title.textContent = `${sunday.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        agendaMonthLabel.textContent = sunday.toLocaleString('pt-BR', { month: 'long' });
        announce(title.textContent);
        for (let i = 0; i < 7; i++) {
            const d = new Date(sunday); d.setDate(sunday.getDate() + i);
            const dayNumVal = d.getDate();
            const cell = makeCell(dayNumVal);
            cell.classList.add('week');
            if (current.getMonth() === d.getMonth() && eventDays.includes(dayNumVal)) cell.classList.add('has-event');
            content.appendChild(cell);
        }
        focusCellByIndex(0);
    }

    function renderDay() {
        clearContent();
        content.classList.add('day-view'); content.classList.remove('week-view'); weekdayLabels.style.display = 'none';
        title.textContent = current.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        announce(title.textContent);
        const cell = makeCell(current.getDate()); cell.classList.add('day-focus');
        if (eventDays.includes(current.getDate())) cell.classList.add('has-event');
        content.appendChild(cell);
        focusCellByIndex(0);
    }

    function render() { if (view === 'month') renderMonth(); else if (view === 'week') renderWeek(); else renderDay(); }

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'n') { document.getElementById('openCreateBtn').click(); return; }
        const cells = Array.from(content.querySelectorAll('.calendar-cell:not(.empty)'));
        if (!cells.length) return;
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
            e.preventDefault();
            if (selectedIndex === null) selectedIndex = 0;
            let idx = selectedIndex;
            if (e.key === 'ArrowLeft') idx = Math.max(0, idx - 1);
            if (e.key === 'ArrowRight') idx = Math.min(cells.length - 1, idx + 1);
            if (e.key === 'ArrowUp') idx = Math.max(0, idx - 7);
            if (e.key === 'ArrowDown') idx = Math.min(cells.length - 1, idx + 7);
            if (e.key === 'Enter') {
                const cell = cells[selectedIndex];
                const day = parseInt(cell.querySelector('.day-num').textContent, 10);
                const y = current.getFullYear();
                const m = current.getMonth();
                window.location.href = `addEventScreen.html?y=${y}&m=${m}&d=${day}`;
                return;
            }
            focusCellByIndex(idx);
        }
    });

    document.getElementById('prevBtn').addEventListener('click', function () {
        if (view === 'month') current.setMonth(current.getMonth() - 1);
        else if (view === 'week') current.setDate(current.getDate() - 7);
        else current.setDate(current.getDate() - 1);
        render();
    });
    document.getElementById('nextBtn').addEventListener('click', function () {
        if (view === 'month') current.setMonth(current.getMonth() + 1);
        else if (view === 'week') current.setDate(current.getDate() + 7);
        else current.setDate(current.getDate() + 1);
        render();
    });

    document.querySelectorAll('.view-toggle .btn').forEach(btn => {
        btn.addEventListener('click', function () {
            view = this.getAttribute('data-view');
            document.querySelectorAll('.view-toggle .btn').forEach(b => b.classList.remove('primary'));
            this.classList.add('primary');
            render();
        });
    });

    const openCreateBtn = document.getElementById('openCreateBtn');
    const eventModal = document.getElementById('eventModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEvent = document.getElementById('cancelEvent');
    const eventForm = document.getElementById('eventForm');

    openCreateBtn.addEventListener('click', () => {
        const y = current.getFullYear();
        const m = current.getMonth();
        window.location.href = `addEventScreen.html?y=${y}&m=${m}`;
    });
    function openModalPrefill(day) {
        eventModal.style.display = 'flex';
        const dayInput = document.getElementById('evtDay');
        if (dayInput && day) dayInput.value = day;
        const titleInput = document.getElementById('evtTitle');
        if (titleInput) titleInput.focus();
    }
    function hideModal() { eventModal.style.display = 'none'; eventForm.reset(); }
    closeModal.addEventListener('click', hideModal);
    cancelEvent.addEventListener('click', hideModal);

    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const titleVal = document.getElementById('evtTitle').value.trim();
        const dayValRaw = document.getElementById('evtDay').value;
        const dayVal = parseInt(dayValRaw, 10);
        const timeVal = document.getElementById('evtTime').value.trim();
        const noteVal = document.getElementById('evtNote').value.trim();
        if (!titleVal || !dayVal || isNaN(dayVal)) {
            alert('Preencha título e dia (número).');
            return;
        }
        const payload = { day: dayVal, title: titleVal, time: timeVal, note: noteVal };
        fetch('/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => {
            if (!res.ok) throw new Error('Erro ao criar evento');
            return res.json();
        }).then(created => {
            const evt = { day: created.day || dayVal, title: created.title || titleVal, time: created.time || timeVal, note: created.note || noteVal, user: true, type: created.type || null };
            addEventToList(evt);
            hideModal();
            render();
        }).catch(err => {
            console.warn('POST /events falhou, fallback local', err);
            const evt = { day: dayVal, title: titleVal, time: timeVal, note: noteVal, user: true, type: null };
            addEventToList(evt);
            const last = eventsListEl.lastElementChild;
            if (last) last.classList.add('user-event');
            hideModal();
            render();
        });
    });

    // navegação para criar evento: elementos .create-btn (âncoras ou botões) devem abrir /addEventScreen com ano/mês atuais
    function bindCreateButtons() {
      document.querySelectorAll('.create-btn').forEach(el => {
        el.addEventListener('click', (ev) => {
          ev.preventDefault();
          const y = current.getFullYear();
          const m = current.getMonth();
          // navega para rota do backend; backend/Thymeleaf deve aceitar /addEventScreen
          window.location.href = `/addEventScreen?y=${y}&m=${m}`;
        });
      });
    }
    // invocar após declarar current (logo antes de render)
    bindCreateButtons();

    // também reaplicar bindCreateButtons quando render for chamado (se necessário)
    const originalRender = render;
    render = function(){
      originalRender();
      bindCreateButtons();
    };

    parseInitialAppointments();
    render();
})();