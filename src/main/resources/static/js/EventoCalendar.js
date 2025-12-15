(function(){
      const eventForm = document.getElementById('eventForm');
      const saveBtn = document.getElementById('saveBtn');
      const successMsg = document.getElementById('successMsg');

      // lista compartilhada de dias com eventos (usada pelo bg calendar)
      const eventDays = [2,16,22];

      function getEventData(){
        return {
          title: document.getElementById('evtTitle').value.trim(),
          date: document.getElementById('evtDate').value, // YYYY-MM-DD
          time: document.getElementById('evtTime').value, // HH:MM
          type: document.getElementById('evtType').value,
          note: document.getElementById('evtNote').value.trim()
        };
      }

      // stub para envio ao backend (descomente e ajuste quando tiver backend)
      function sendEvent(data){
        /*
        return fetch('/api/events', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(data),
          credentials: 'include'
        }).then(r => r.json());
        */
        return null;
      }

      eventForm.addEventListener('submit', function(e){
        e.preventDefault();
        successMsg.style.display = 'none';

        const payload = getEventData();
        if (!payload.title || !payload.date) {
          alert('Preencha o título e a data.');
          return;
        }

        // UX: bloquear botão
        saveBtn.disabled = true;
        saveBtn.classList.add('loading');

        // envia ao backend via JSON
        const parsedDate = new Date(payload.date);
        const day = parsedDate && !isNaN(parsedDate) ? parsedDate.getDate() : null;
        const body = { day, title: payload.title, time: payload.time, note: payload.note, type: payload.type };

        // BACKEND: criar evento
        // POST /events
        // - Content-Type: application/json
        // - body: { day: Number, title: String, time?: String, type?: String, note?: String }
        // - resposta esperada: o objeto criado (id, day, title, ...)
        // - se falhar, o front faz fallback local (já implementado)
        fetch('/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }).then(res => {
          if (!res.ok) throw new Error('Erro ao criar evento');
          return res.json();
        }).then(created => {
          // atualizar lista interna e bg
          if (created.day && !eventDays.includes(created.day)) eventDays.push(created.day);
          successMsg.style.display = '';
          console.log('Evento criado:', created);
          renderBgCalendar('bgCalendar'); // atualiza fundo visual
        }).catch(err => {
          console.warn('Falha no POST /events — fallback local', err);
          // fallback: adiciona dia localmente
          if (day && !eventDays.includes(day)) eventDays.push(day);
          renderBgCalendar('bgCalendar');
          successMsg.style.display = '';
        }).finally(()=> {
          saveBtn.disabled = false;
          saveBtn.classList.remove('loading');
        });
      });

      // acessibilidade: foco inicial
      document.getElementById('evtTitle').focus();

      // --- novo: render do calendário de fundo (visual apenas) ---
      function renderBgCalendar(containerId){
        const root = document.getElementById(containerId);
        if (!root) return;
        root.innerHTML = ''; // limpa

        const box = document.createElement('div');
        box.className = 'calendar-bg';

        const weekdays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
        const wkRow = document.createElement('div');
        wkRow.className = 'weekday-row';
        weekdays.forEach(d=>{
          const el = document.createElement('div');
          el.className = 'weekday';
          el.textContent = d;
          wkRow.appendChild(el);
        });
        box.appendChild(wkRow);

        const cells = document.createElement('div');
        cells.className = 'cells';

        const today = new Date();
        const first = new Date(today.getFullYear(), today.getMonth(), 1);
        const last = new Date(today.getFullYear(), today.getMonth()+1, 0);
        const startDay = first.getDay();
        const daysInMonth = last.getDate();

        // células vazias do mês anterior
        for (let i=0;i<startDay;i++){
          const empty = document.createElement('div');
          empty.className = 'cell empty';
          cells.appendChild(empty);
        }
        // dias do mês
        for (let d=1; d<=daysInMonth; d++){
          const c = document.createElement('div');
          c.className = 'cell';
          if (eventDays.includes(d)) c.classList.add('has-event');
          c.textContent = d;
          cells.appendChild(c);
        }
        // trailing
        const total = startDay + daysInMonth;
        const trailing = (7 - (total % 7)) % 7;
        for (let i=0;i<trailing;i++){
          const empty = document.createElement('div');
          empty.className = 'cell empty';
          cells.appendChild(empty);
        }

        box.appendChild(cells);
        root.appendChild(box);
      }

      // chama render do bg ao carregar a página
      document.addEventListener('DOMContentLoaded', function(){
        renderBgCalendar('bgCalendar');
      });

      // expose util para console (opcional)
      window.getEventData = getEventData;
    })();