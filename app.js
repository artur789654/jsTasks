class Task {
  constructor(description, status = "new", priority = "medium") {
    this.id = Task.generateId();
    this.description = description;
    this.status = status;
    this.priority = priority;
  }

  updateStatus(newStatus) {
    this.status = newStatus;
  }

  updatePriority(newPriority) {
    this.priority = newPriority;
  }

  static generateId() {
    return Date.now().toString() + Math.random().toString(36).substring(2);
  }
}

class TaskManager {
  constructor() {
    this.originalTasks = this.loadTasks();
    this.tasks = [...this.originalTasks];
    this.sortOrder = "none";
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.originalTasks));
  }

  loadTasks() {
    const tasks = localStorage.getItem("tasks");
    return tasks
      ? JSON.parse(tasks).map(
          (task) => new Task(task.description, task.status, task.priority)
        )
      : [];
  }

  addTask(description, status, priority) {
    const task = new Task(description, status, priority);
    this.originalTasks.push(task);
    this.applySorting();
    this.saveTasks();
    return task;
  }

  removeTask(taskId) {
    const originalIndex = this.originalTasks.findIndex(
      (task) => task.id === taskId
    );

    if (originalIndex !== -1) {
      this.originalTasks.splice(originalIndex, 1);
      this.applySorting();
      this.saveTasks();
    }
  }

  priorityValue(priority) {
    const priorities = {
      high: 1,
      medium: 2,
      low: 3,
    };
    return priorities[priority] || 2;
  }

  sortTasksByPriority() {
    if (this.sortOrder === "asc") {
      return [...this.originalTasks].sort(
        (a, b) =>
          this.priorityValue(a.priority) - this.priorityValue(b.priority)
      );
    } else if (this.sortOrder === "desc") {
      return [...this.originalTasks].sort(
        (a, b) =>
          this.priorityValue(b.priority) - this.priorityValue(a.priority)
      );
    }
    return [...this.originalTasks];
  }

  applySorting() {
    this.tasks = this.sortTasksByPriority();
  }

  setSortOrder(order) {
    this.sortOrder = order;
    this.applySorting();
  }

  filterTasks(selectedStatus, selectedPriority) {
    return this.tasks.filter((task) => {
      const matchesStatus =
        selectedStatus === "all" || task.status === selectedStatus;
      const matchesPriority =
        selectedPriority === "all" || task.priority === selectedPriority;

      return matchesStatus && matchesPriority;
    });
  }
}

const taskManager = new TaskManager();
const taskList = document.getElementById("taskList");
const sortOrderSelect = document.getElementById("sortOrderSelect");

const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");

const renderTasks = () => {
  const selectedStatus = filterStatus.value;
  const selectedPriority = filterPriority.value;
  const sortOrder = sortOrderSelect.value;

  taskManager.setSortOrder(sortOrder);

  const filteredTasks = taskManager.filterTasks(
    selectedStatus,
    selectedPriority
  );
  taskList.innerHTML = "";
  filteredTasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item", task.status);
    taskItem.innerHTML = `
      <span class="task-description">${task.description}</span>
      <select class="task-status" data-id="${task.id}">
        <option value="new" ${
          task.status === "new" ? "selected" : ""
        }>New</option>
        <option value="in-progress" ${
          task.status === "in-progress" ? "selected" : ""
        }>In Progress</option>
        <option value="completed" ${
          task.status === "completed" ? "selected" : ""
        }>Completed</option>
      </select>
      <select class="task-priority" data-id="${task.id}">
        <option value="high" ${
          task.priority === "high" ? "selected" : ""
        }>High</option>
        <option value="medium" ${
          task.priority === "medium" ? "selected" : ""
        }>Medium</option>
        <option value="low" ${
          task.priority === "low" ? "selected" : ""
        }>Low</option>
      </select>
      <button class="delete-btn" data-id="${task.id}">Delete</button>
    `;
    taskList.appendChild(taskItem);
  });

  document.querySelectorAll(".task-status").forEach((select) => {
    select.addEventListener("change", (e) => {
      const taskId = e.target.getAttribute("data-id");
      const newStatus = e.target.value;

      const task = taskManager.originalTasks.find((task) => task.id === taskId);
      if (task) {
        task.updateStatus(newStatus);
        taskManager.saveTasks();
        renderTasks();
      }
    });
  });

  document.querySelectorAll(".task-priority").forEach((select) => {
    select.addEventListener("change", (e) => {
      const taskId = e.target.getAttribute("data-id");
      const newPriority = e.target.value;
      const task = taskManager.originalTasks.find((task) => task.id === taskId);
      if (task) {
        task.updatePriority(newPriority);
        taskManager.saveTasks();
        renderTasks();
      }
    });
  });
};

const addTaskBtn = document.getElementById("addTaskBtn");

addTaskBtn.addEventListener("click", () => {
  const descriptionInput = document.getElementById("taskDescription");
  const description = descriptionInput.value.trim();
  const status = document.getElementById("taskStatus").value;
  const priority = document.getElementById("taskPriority").value;

  if (description !== "") {
    taskManager.addTask(description, status, priority);
    renderTasks();
    descriptionInput.value = "";
  }
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const taskId = e.target.getAttribute("data-id");
    taskManager.removeTask(taskId);
    renderTasks();
  }
});

filterStatus.addEventListener("change", renderTasks);
filterPriority.addEventListener("change", renderTasks);
sortOrderSelect.addEventListener("change", renderTasks);

const resetFiltersBtn = document.getElementById("resetFiltersBtn");

resetFiltersBtn.addEventListener("click", () => {
  filterStatus.value = "all";
  filterPriority.value = "all";
  sortOrderSelect.value = "none";
  renderTasks();
});

renderTasks();