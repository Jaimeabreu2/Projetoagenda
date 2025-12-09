    (function () {
        const content = document.getElementById('calendarContent');
        const title = document.getElementById('calendarTitle');
        const weekdayLabels = document.getElementById('weekdayLabels');

        let view = 'month';
        // lê query params ?y=&m=&d= para inicialização (útil para deep-link)
        const qs = new URLSearchParams(window.location.search);
        const qy = qs.has('y') ? parseInt(qs.get('y'), 10) : null;
        const qm = qs.has('m') ? parseInt(qs.get('m'), 10) : null;
        const qd = qs.has('d') ? parseInt(qs.get('d'), 10) : null;
        let current = qy || qm !== null ? new Date(qy || new Date().getFullYear(), qm || 0, qd || 1) : new Date();

        // aria-live helper
        function announce(text) {
            let live = document.getElementById('a11yAnnounce');
            if (!live) {
                live = document.createElement('div');
                live.id = 'a11yAnnounce';
                live.setAttribute('aria-live', 'polite');
                live.style.position = 'absolute';
                live.style.left = '-9999px';
                document.body.appendChild(live);
            }
            live.textContent = text;
        }

        function clearContent() {
            content.innerHTML = '';
        }

        function renderMonth() {
            clearContent();
            content.classList.remove('week-view', 'day-view');
            weekdayLabels.style.display = 'grid';

            const first = new Date(current.getFullYear(), current.getMonth(), 1);
            const last = new Date(current.getFullYear(), current.getMonth() + 1, 0);
            const startDay = first.getDay();
            const daysInMonth = last.getDate();

            title.textContent = first.toLocaleString('pt-BR', {month: 'long', year: 'numeric'});
            announce(title.textContent);

            for (let i = 0; i < startDay; i++) {
                const empty = document.createElement('div');
                empty.className = 'calendar-cell empty';
                empty.setAttribute('aria-hidden', 'true');
                content.appendChild(empty);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const cell = document.createElement('div');
                cell.className = 'calendar-cell';
                cell.setAttribute('role', 'gridcell');
                cell.tabIndex = -1;

                const dayNum = document.createElement('div');
                dayNum.className = 'day-num';
                dayNum.textContent = day;
                cell.appendChild(dayNum);

                const today = new Date();
                const cellDate = new Date(current.getFullYear(), current.getMonth(), day);
                if (cellDate.toDateString() === today.toDateString()) {
                    cell.classList.add('today');
                }

                cell.innerHTML += '<div class="event-info"><span class="event-dot"></span><small>Sem eventos</small></div>';
                cell.addEventListener('click', () => {
                    cell.focus();
                    cell.classList.add('selected');
                    announce(`Selecionado ${dayNum.textContent} ${current.toLocaleString('pt-BR', {month: 'long'})}`);
                });
                content.appendChild(cell);
            }

            const totalCells = startDay + daysInMonth;
            const trailing = (7 - (totalCells % 7)) % 7;
            for (let i = 0; i < trailing; i++) {
                const empty = document.createElement('div');
                empty.className = 'calendar-cell empty';
                empty.setAttribute('aria-hidden', 'true');
                content.appendChild(empty);
            }

            // foco inicial para teclado: dia atual ou primeiro dia
            const cells = Array.from(content.querySelectorAll('.calendar-cell:not(.empty)'));
            const today = new Date();
            let idx = 0;
            if (today.getMonth() === current.getMonth() && today.getFullYear() === current.getFullYear()) idx = today.getDate() - 1;
            if (cells[idx]) {
                cells[idx].tabIndex = 0;
                cells[idx].focus();
            }
        }

        // Renderiza o calendário no modo "Semana"
        function renderWeek() {
            clearContent();
            content.classList.add('week-view');
            content.classList.remove('day-view');
            weekdayLabels.style.display = 'grid';

            const cur = new Date(current);
            const dayOfWeek = cur.getDay();
            const sunday = new Date(cur);
            sunday.setDate(cur.getDate() - dayOfWeek);

            const endDate = new Date(sunday);
            endDate.setDate(sunday.getDate() + 6);
            title.textContent = `${sunday.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

            for (let i = 0; i < 7; i++) {
                const d = new Date(sunday);
                d.setDate(sunday.getDate() + i);

                const cell = document.createElement('div');
                cell.className = 'calendar-cell week';

                const dayNum = document.createElement('div');
                dayNum.className = 'day-num';
                dayNum.textContent = d.getDate();
                cell.appendChild(dayNum);

                const dayName = d.toLocaleDateString('pt-BR', {weekday: 'short'});
                cell.innerHTML += `<div class="event-info"><small>${dayName}, ${d.toLocaleDateString()}</small></div>`;
                content.appendChild(cell);
            }
        }

        // Renderiza o calendário no modo "Dia"
        function renderDay() {
            clearContent();
            content.classList.add('day-view');
            content.classList.remove('week-view');
            weekdayLabels.style.display = 'none';

            title.textContent = current.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const cell = document.createElement('div');
            cell.className = 'calendar-cell day-focus';
            cell.innerHTML = `
                    <div class="day-num">${current.getDate()}</div>
                    <div style="margin-top:24px">
                        <strong>Agenda do dia</strong>
                        <p style="color:#6b6b6b">Sem compromissos</p>
                    </div>
                `;
            content.appendChild(cell);
        }

        // Escolhe a renderização correta com base na visualização atual
        function render() {
            if (view === 'month') renderMonth();
            else if (view === 'week') renderWeek();
            else renderDay();
        }

        // Controles de navegação (anterior/próximo)
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.addEventListener('click', function () {
            if (view === 'month') {
                current.setMonth(current.getMonth() - 1);
            } else if (view === 'week') {
                current.setDate(current.getDate() - 7);
            } else {
                current.setDate(current.getDate() - 1);
            }
            render();
        });

        nextBtn.addEventListener('click', function () {
            if (view === 'month') {
                current.setMonth(current.getMonth() + 1);
            } else if (view === 'week') {
                current.setDate(current.getDate() + 7);
            } else {
                current.setDate(current.getDate() + 1);
            }
            render();
        });

        // Alterna entre as visualizações (Mês, Semana, Dia)
        document.querySelectorAll('.view-toggle .btn').forEach(btn => {
            btn.addEventListener('click', function () {
                view = this.getAttribute('data-view');
                document.querySelectorAll('.view-toggle .btn').forEach(b => b.classList.remove('primary'));
                this.classList.add('primary');
                render();
            });
        });

        // tecla: ←/→/↑/↓ navegam entre células quando calendar focado
        document.addEventListener('keydown', (e) => {
            const focused = document.activeElement;
            if (!focused || !focused.classList.contains('calendar-cell')) return;
            const visible = Array.from(document.querySelectorAll('#calendarContent .calendar-cell:not(.empty)'));
            const idx = visible.indexOf(focused);
            if (idx === -1) return;
            let next = idx;
            if (e.key === 'ArrowLeft') next = Math.max(0, idx - 1);
            if (e.key === 'ArrowRight') next = Math.min(visible.length - 1, idx + 1);
            if (e.key === 'ArrowUp') next = Math.max(0, idx - 7);
            if (e.key === 'ArrowDown') next = Math.min(visible.length - 1, idx + 7);
            if (next !== idx) {
                e.preventDefault();
                visible.forEach(c => c.tabIndex = -1);
                visible[next].tabIndex = 0;
                visible[next].focus();
                visible.forEach(c => c.classList.remove('selected'));
                visible[next].classList.add('selected');
                announce(`Selecionado ${visible[next].querySelector('.day-num').textContent}`);
            }
        });

        // inicializa
        render();
    })();