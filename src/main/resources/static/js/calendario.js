const monthYear = document.getElementById("month-year");
const calendarBody = document.getElementById("calendar-body");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const todayBtn = document.getElementById("today");

let currentDate = new Date();

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = "";

    let dateNum = 1;
    for (let i = 0; i < 6; i++) { // até 6 semanas
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");

            if (i === 0 && j < firstDay) {
                cell.textContent = "";
            } else if (dateNum > lastDate) {
                cell.textContent = "";
            } else {
                cell.textContent = dateNum;

                const today = new Date();
                if (
                    dateNum === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear()
                ) {
                    cell.classList.add("today");
                }

                dateNum++;
            }

            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
    }
}

prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

todayBtn.addEventListener("click", () => {
    currentDate = new Date();
    renderCalendar(currentDate);
});

renderCalendar(currentDate);
// Modal
const modal = document.getElementById("event-modal");
const openModalBtn = document.getElementById("add-evento");
const closeModalBtn = document.querySelector(".close");
const eventForm = document.getElementById("event-form");

openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex"; // mostra modal
});

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none"; // fecha modal
});

// Fecha ao clicar fora da modal
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Submissão do formulário (apenas exemplo)
eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("event-title").value;
    const date = document.getElementById("event-date").value;
    alert(`Evento "${title}" adicionado para ${date}`);
    modal.style.display = "none";
    eventForm.reset();
});
