// Script: renderiza os 12 meses dinamicamente.
    // Funções úteis: renderYear, applyFilter, goToToday.
    (function(){
      const yearGrid = document.getElementById('yearGrid');
      const yearValue = document.getElementById('yearValue');
      const filterInput = document.getElementById('filterInput');
      const todayBtn = document.getElementById('todayBtn');
      // exemplo de dias recorrentes do mês com evento (aplica-se a todos os meses)
      const eventDays = [2,16,22];
      let year = new Date().getFullYear();

      function renderYear(y){
        yearGrid.innerHTML = '';
        yearValue.textContent = String(y);
        const monthNames = Array.from({length:12},(_,i)=> new Date(y,i,1).toLocaleString('pt-BR',{ month:'long' }));

        for(let m=0;m<12;m++){
          const card = document.createElement('section'); card.className='month-card';
          const title = document.createElement('div'); title.className='month-title'; title.textContent = monthNames[m];
          // contador simples de eventos (usa eventDays; conta apenas dias válidos no mês)
          const daysInMonth = new Date(y,m+1,0).getDate();
          const count = eventDays.filter(d => d>=1 && d<=daysInMonth).length;
          const meta = document.createElement('div'); meta.className='month-meta';
          const countEl = document.createElement('span'); countEl.className='count'; countEl.textContent = `${count}`;
          const labelEl = document.createElement('small'); labelEl.textContent = count === 1 ? ' evento' : ' eventos';
          meta.appendChild(countEl); meta.appendChild(labelEl);
          card.appendChild(title);
          card.appendChild(meta);

          const wk = document.createElement('div'); wk.className='month-weekdays';
          ['D','S','T','Q','Q','S','S'].forEach(d=>{ const el=document.createElement('div'); el.textContent=d; wk.appendChild(el); });
          card.appendChild(wk);

          const grid = document.createElement('div'); grid.className='month-grid';
          const first = new Date(y,m,1);
          const last = new Date(y,m+1,0);
          const startDay = first.getDay();
          const daysInMonthLocal = last.getDate();

          for(let i=0;i<startDay;i++){ const e=document.createElement('div'); e.className='m-day empty'; grid.appendChild(e); }

          for(let d=1; d<=daysInMonth; d++){
            const cell = document.createElement('div'); cell.className='m-day';
            const num = document.createElement('div'); num.textContent = d; num.style.flexGrow = '1';
            cell.appendChild(num);

            if(eventDays.includes(d)){
              cell.classList.add('has-event');
              const dot = document.createElement('div'); dot.className='dot'; cell.appendChild(dot);
            }
            // clique: navega para calendário mensal focando neste mês/dia
            cell.addEventListener('click', ()=> {
              // redireciona à página mensal centralizando no mês/ano selecionado
              // simples: passa ano e mês por querystring (pode ser lida pela página mensal no futuro)
              window.location.href = `calendarComAgenda.html?y=${y}&m=${m}&d=${d}`;
            });

            grid.appendChild(cell);
          }

          // trailing
          const total = startDay + daysInMonth;
          const trailing = (7 - (total % 7)) % 7;
          for(let i=0;i<trailing;i++){ const e=document.createElement('div'); e.className='m-day empty'; grid.appendChild(e); }

          card.appendChild(grid);
          // destaca mês atual se estiver no mesmo ano e mês
          const now = new Date();
          if (y === now.getFullYear() && m === now.getMonth()) card.classList.add('current-month');

          // destaca Outubro especificamente (índice 9) com verde claro
          if (m === 9) card.classList.add('october-highlight');

          yearGrid.appendChild(card);
        }
      }

      // filtro simples por nome de mês
      function applyFilter() {
        const q = (filterInput.value || '').trim().toLowerCase();
        Array.from(yearGrid.children).forEach(card=>{
          const title = card.querySelector('.month-title').textContent.toLowerCase();
          card.style.display = title.includes(q) ? '' : 'none';
        });
      }

      // "Hoje" botão: vai para o ano atual e destaca
      function goToToday() {
        const now = new Date();
        year = now.getFullYear();
        renderYear(year);
        // rolar levemente até o mês atual
        const cur = yearGrid.querySelector('.month-card.current-month');
        if (cur) cur.scrollIntoView({behavior:'smooth',block:'center'});
      }

      // atalhos de teclado: ← → para trocar ano, T para hoje
      document.addEventListener('keydown', (e)=>{
        if (e.key === 'ArrowLeft') { year--; renderYear(year); }
        if (e.key === 'ArrowRight') { year++; renderYear(year); }
        if (e.key.toLowerCase() === 't') { goToToday(); }
      });

      document.getElementById('prevYear').addEventListener('click', ()=>{ year--; renderYear(year); });
      document.getElementById('nextYear').addEventListener('click', ()=>{ year++; renderYear(year); });

      filterInput.addEventListener('input', applyFilter);
      todayBtn.addEventListener('click', goToToday);

      // inicial
      renderYear(year);
    })();