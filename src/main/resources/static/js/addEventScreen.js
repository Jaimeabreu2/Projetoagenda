(function () {
    const eventsListEl = document.getElementById('eventsList');
    const calendarEl = document.getElementById('calendarContentSmall');
    const bgContainer = document.getElementById('bgCalendarLarge');
    const titleMonthEl = document.getElementById('titleMonthSmall');
    const prevBtn = document.getElementById('prevSmall');
    const nextBtn = document.getElementById('nextSmall');
    let current = new Date();

    function renderBgLarge() {
        if (!bgContainer) return;
        bgContainer.innerHTML = '';
        const wrap = document.createElement('div');
        wrap.className = 'calendar-bg';
        const first = new Date(current.getFullYear(), current.getMonth(), 1);
        const header = document.createElement('div');
        header.className = 'calendar-header';
        const t = document.createElement('h2');
        t.className = 'calendar-title';
        t.textContent = first.toLocaleString('pt-BR', {month: 'long', year: 'numeric'});
        header.appendChild(t);
        const ctrls = document.createElement('div');
        ctrls.className = 'calendar-controls';
        const prev = document.createElement('div');
        prev.className = 'bg-control';
        prev.textContent = '◀';
        const next = document.createElement('div');
        next.className = 'bg-control';
        next.textContent = '▶';
        ctrls.appendChild(prev);
        ctrls.appendChild(next);
        header.appendChild(ctrls);
        const toggle = document.createElement('div');
        toggle.className = 'view-toggle';
        ['Mês', 'Semana', 'Dia'].forEach(txt => {
            const b = document.createElement('div');
            b.className = 'bg-control';
            b.textContent = txt;
            toggle.appendChild(b);
        });
        header.appendChild(toggle);
        wrap.appendChild(header);
        const weekdays = document.createElement('div');
        weekdays.className = 'weekday-labels';
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(d => {
            const el = document.createElement('div');
            el.className = 'calendar-weekday';
            el.textContent = d;
            weekdays.appendChild(el);
        });
        wrap.appendChild(weekdays);
        const content = document.createElement('div');
        content.id = 'calendarContent';
        content.className = 'calendar-grid';
        const last = new Date(current.getFullYear(), current.getMonth() + 1, 0);
        const startDay = first.getDay();
        const daysInMonth = last.getDate();
        for (let i = 0; i < startDay; i++) {
            const e = document.createElement('div');
            e.className = 'calendar-cell empty';
            content.appendChild(e);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            const num = document.createElement('div');
            num.className = 'day-num';
            num.textContent = d;
            cell.appendChild(num);
            if (eventDays.includes(d)) {
                cell.classList.add('has-event');
                const dot = document.createElement('div');
                dot.className = 'event-dot';
                cell.appendChild(dot);
            } else {
                const dot = document.createElement('div');
                dot.className = 'event-dot';
                dot.style.opacity = '0.0';
                cell.appendChild(dot);
            }
            content.appendChild(cell);
        }
        const total = startDay + daysInMonth;
        const trailing = (7 - (total % 7)) % 7;
        for (let i = 0; i < trailing; i++) {
            const e = document.createElement('div');
            e.className = 'calendar-cell empty';
            content.appendChild(e);
        }
        wrap.appendChild(content);
        bgContainer.appendChild(wrap);
    }

    // helper: formata ISO "YYYY-MM-DD" ou número -> "dd/MM/yyyy"; se já for "dd/MM/yyyy" retorna direto
    function formatDayLabel(day) {
      if (typeof day === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(day)) {
        return day;
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

    function renderEventsList() {
        eventsListEl.innerHTML = '';
        events.forEach(ev => {
            const item = document.createElement('div');
            item.className = 'appointment' + (ev.user ? ' user-event' : '') + (ev.type ? ' evt-type-' + ev.type : '');
            const badgeHtml = `<div class="badge">${formatDayLabel(ev.day)}</div>`;
            item.innerHTML = `${badgeHtml}<div><strong>${ev.title}</strong><div class="small" style="color:var(--muted)">${ev.note || ''}</div></div>`;
            eventsListEl.appendChild(item);
        });
    }

    function renderCalendar() {
        calendarEl.innerHTML = '';
        const first = new Date(current.getFullYear(), current.getMonth(), 1);
        const last = new Date(current.getFullYear(), current.getMonth() + 1, 0);
        const startDay = first.getDay();
        const days = last.getDate();
        titleMonthEl.textContent = first.toLocaleString('pt-BR', {month: 'long', year: 'numeric'});
        for (let i = 0; i < startDay; i++) {
            const e = document.createElement('div');
            e.className = 'calendar-cell small empty';
            calendarEl.appendChild(e);
        }
        for (let d = 1; d <= days; d++) {
            const c = document.createElement('div');
            c.className = 'calendar-cell small';
            const eventForDay = events.find(ev => {
              // compara dias numéricos ou datas completas
              if (!ev) return false;
              if (typeof ev.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ev.day)) {
                const parsed = new Date(ev.day);
                return parsed.getDate() === d && parsed.getMonth() === current.getMonth() && parsed.getFullYear() === current.getFullYear();
              }
              return Number(ev.day) === d;
            });
            if (eventDays.includes(d)) c.classList.add('has-event');
            const dot = document.createElement('span');
            dot.className = 'event-dot';
            if (eventForDay && eventForDay.type) dot.classList.add('evt-type-' + eventForDay.type);
            dot.style.display = eventDays.includes(d) ? 'inline-block' : 'none';
            dot.style.width = '8px';
            dot.style.height = '8px';
            dot.style.borderRadius = '50%';
            dot.style.background = 'var(--brand-1)';
            dot.style.margin = '6px';
            c.appendChild(dot);
            // número do dia (mantém visual dd se desejar, aqui mantemos número)
            const num = document.createElement('div');
            num.style.fontWeight = '600';
            num.style.marginLeft = '6px';
            num.textContent = d;
            c.appendChild(num);
            calendarEl.appendChild(c);
        }
        const total = startDay + days;
        const trailing = (7 - (total % 7)) % 7;
        for (let i = 0; i < trailing; i++) {
            const e = document.createElement('div');
            e.className = 'calendar-cell small empty';
            calendarEl.appendChild(e);
        }
        renderBgLarge();
    }

    prevBtn.addEventListener('click', () => {
        current.setMonth(current.getMonth() - 1);
        renderCalendar();
    });
    nextBtn.addEventListener('click', () => {
        current.setMonth(current.getMonth() + 1);
        renderCalendar();
    });
    const overlay = document.getElementById('overlay');
    const modalForm = document.getElementById('modalForm');
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => {
        const params = new URLSearchParams(window.location.search);
        const y = params.get('y');
        const m = params.get('m');
        const target = (y && m) ? `calendarComAgenda.html?y=${y}&m=${m}` : 'calendarComAgenda.html';
        window.location.href = target;
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
    });
    (function prefillFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const y = params.get('y');
        const m = params.get('m');
        const d = params.get('d');
        if (y && m) {
            current = new Date(parseInt(y, 10), parseInt(m, 10), 1);
            renderCalendar();
            renderBgLarge();
        }
        if (d) {
            const dateInput = document.getElementById('mDate');
            if (dateInput) {
                const mm = String(parseInt(m, 10) + 1).padStart(2, '0');
                const dd = String(parseInt(d, 10)).padStart(2, '0');
                dateInput.value = `${y}-${mm}-${dd}`;
            }
            overlay.style.display = 'flex';
            const titleInput = document.getElementById('mTitle');
            if (titleInput) titleInput.focus();
        }
    })();
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('mTitle').value.trim();
        const dateVal = document.getElementById('mDate')?.value;
        const time = document.getElementById('mTime').value;
        const type = (document.getElementById('mType') && document.getElementById('mType').value) || 'outro';
        const note = document.getElementById('mNote').value.trim();
        if (!title || !dateVal) {
            alert('Preencha o título e a data.');
            return;
        }
        const parsed = new Date(dateVal);
        if (!parsed || isNaN(parsed)) {
            alert('Data inválida');
            return;
        }
        const day = parsed.getDate();
        const month = parsed.getMonth() + 1;
        const year = parsed.getFullYear();
        const payload = {day, month, year, title, time, note, type};
        fetch('/events', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        }).then(res => {
            if (!res.ok) throw new Error('Falha ao criar evento');
            return res.json();
        }).then(created => {
            const createdDay = created.day || day;
            events.unshift({
                day: createdDay,
                title: created.title || title,
                note: created.time ? `${created.time} • ${created.note || ''}` : created.note || note,
                user: true,
                type: created.type || type
            });
            if (!eventDays.includes(createdDay)) eventDays.push(createdDay);
            renderEventsList();
            renderCalendar();
            // pulso na célula do calendário pequeno para feedback imediato
            const createdDay = created.day || day;
            _pulseSmallCalendarCell(createdDay);
            overlay.style.display = 'none';
            const t = document.getElementById('toastSuccess');
            t.textContent = 'Evento criado com sucesso';
            t.style.display = 'block';
            setTimeout(() => t.style.display = 'none', 2200);
        }).catch(err => {
            console.warn('Falha fetch /events, fallback local:', err);
            events.unshift({day, title, note: time ? `${time} • ${note}` : note, user: true, type: type});
            if (!eventDays.includes(day)) eventDays.push(day);
            renderEventsList();
            renderCalendar();
            _pulseSmallCalendarCell(day);
            overlay.style.display = 'none';
            const t = document.getElementById('toastSuccess');
            t.textContent = 'Evento criado (offline)';
            t.style.display = 'block';
            setTimeout(() => t.style.display = 'none', 2200);
        });
    });
    renderEventsList();
    renderCalendar();
    renderBgLarge();

    /* adiciona pulso a célula pequena do calendário (usado após criação de evento) */
    function _pulseSmallCalendarCell(day) {
      if (!calendarEl) return;
      const cells = Array.from(calendarEl.querySelectorAll('.calendar-cell.small:not(.empty)'));
      for (const c of cells) {
        const numEl = c.querySelector('div') || c.querySelector('.day-num');
        const num = numEl ? parseInt((numEl.textContent || '').trim(), 10) : NaN;
        if (num === day) {
          c.classList.remove('pulse');
          // reflow para reiniciar animação
          void c.offsetWidth;
          c.classList.add('pulse');
          c.addEventListener('animationend', () => c.classList.remove('pulse'), { once: true });
          setTimeout(() => c.classList.remove('pulse'), 1200);
          break;
        }
      }
    }
})();
