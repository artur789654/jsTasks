document.addEventListener("DOMContentLoaded", () => {
  const addTask = document.getElementById("addTask");
  const addTaskInput = document.getElementById("addTaskInput");
  const tasks = document.getElementById("tasks");
  const taskFilter = document.getElementById("taskFilter");

  const getTasksFromStorage = () => {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
  };
  const saveTasksToStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  const filterTasks = (tasksFromStorage, filter) => {
    return tasksFromStorage.filter((task) => {
      if (filter === "all") return true;
      if (filter === "done") return task.done;
      if (filter === "not done") return !task.done;
    });
  };

  const renderTasks = () => {
    const tasksFromStorage = getTasksFromStorage();
    tasks.innerHTML = "";
    const filter = taskFilter.value;

    const filteredTasks = filterTasks(tasksFromStorage, filter);

    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      const par = document.createElement("p");
      const checkbox = document.createElement("input");
      const deleteBtn = document.createElement("button");

      par.textContent = task.text;

      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => toggleTask(task.id));

      deleteBtn.textContent = "delete";
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      li.append(checkbox, par, deleteBtn);
      tasks.appendChild(li);
    });
  };

  addTask.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = addTaskInput.value.trim();

    if (taskText === "") return;
    const tasksFromStorage = getTasksFromStorage();

    const newTask = {
      id: new Date().getTime(),
      text: taskText,
      done: false,
    };

    tasksFromStorage.push(newTask);
    saveTasksToStorage(tasksFromStorage);
    renderTasks();
    addTaskInput.value = "";
  });

  const toggleTask = (taskId) => {
    const tasksFromStorage = getTasksFromStorage();
    const taskIndex = tasksFromStorage.findIndex((task) => task.id === taskId);
    tasksFromStorage[taskIndex].done = !tasksFromStorage[taskIndex].done;
    saveTasksToStorage(tasksFromStorage);
    renderTasks();
  };

  const deleteTask = (taskId) => {
    const tasksFromStorage = getTasksFromStorage();
    const updatedTasks = tasksFromStorage.filter((task) => task.id !== taskId);
    saveTasksToStorage(updatedTasks);
    renderTasks();
  };

  taskFilter.addEventListener("change", renderTasks);
  renderTasks();
});
