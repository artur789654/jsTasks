document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const currentMonthAndYear = document.getElementById("currentMonthAndYear");
  const calendar = document.getElementById("calendar");
  const selectedDate = document.getElementById("selected-date");
  const eventList = document.getElementById("event-list");
  const addEventForm = document.getElementById("add-event-form");
  const addEventTitle = document.getElementById("add-event-title");

  const currentDate = new Date();

  const getEventsFromStorage = () => {
    const events = localStorage.getItem("events");
    return events ? JSON.parse(events) : {};
  };

  const saveEventsToStorage = (events) => {
    localStorage.setItem("events", JSON.stringify(events));
  };

  const renderCalendar = () => {
    calendar.innerHTML = "";
    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

    daysOfWeek.forEach((day) => {
      const item = document.createElement("div");
      item.classList.add("calendar-header");
      item.textContent = day;
      calendar.appendChild(item);
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    for (let i = 0; i < startDay; i++) {
      calendar.appendChild(document.createElement("div"));
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("div");
      day.classList.add("calendar-day");
      day.textContent = i;
      day.dataset.date = `${String(i).padStart(2, 0)}-${String(
        month + 1
      ).padStart(2, 0)}-${year}`;
      day.addEventListener("click", handleDayClick);
      calendar.appendChild(day);
    }
    currentMonthAndYear.innerHTML = `${String(month + 1).padStart(
      2,
      0
    )}-${year}`;
  };

  const handleDayClick = (event) => {
    document.querySelectorAll(".calendar-day.active").forEach((item) => {
      item.classList.remove("active");
    });
    event.target.classList.add("active");
    const date = event.target.dataset.date;
    selectedDate.innerText = date;
    updateEventList(date);
  };

  const updateEventList = (date) => {
    eventList.innerHTML = "";
    const events = getEventsFromStorage();
    const dayEvents = events[date] || [];
    dayEvents.forEach((event, index) => {
      const dayEvent = document.createElement("li");
      const parEvent = document.createElement("p");
      parEvent.textContent = event;
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.value = index;
      deleteBtn.addEventListener("click", (event) => deleteEvent(date, event));
      dayEvent.appendChild(parEvent);
      dayEvent.appendChild(deleteBtn);
      eventList.appendChild(dayEvent);
    });

    addEventForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (selectedDate.textContent !== "Виберіть дату") {
        const eventInput = addEventTitle.value.trim();
        if (!eventInput) {
          return;
        }
        const events = getEventsFromStorage();
        if (!events[date]) {
          events[date] = [];
        }
        events[date].push(eventInput);
        saveEventsToStorage(events);
        addEventTitle.value = "";
        updateEventList(date);
      }
    });

    const deleteEvent = (date, event) => {
      const events = getEventsFromStorage();
      const indexDeleteBtn = event.target.value;
      if (events[date] && indexDeleteBtn !== undefined) {
        events[date].splice(indexDeleteBtn, 1);
        if (events[date].length === 0) {
          delete events[date];
        }
      }
      saveEventsToStorage(events);
      updateEventList(date);
    };
  };

  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
  renderCalendar();
});
