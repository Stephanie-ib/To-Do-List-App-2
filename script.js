const todoList = [];

const todoListElement = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-task");
filterOption.addEventListener("change", filterTask);
showTasks();
renderTodoList();

function renderTodoList() {
  let todoListHTML = "";

  todoList.forEach((todoObject, index) => {
    const { name, dueDate, priority, completed } = todoObject;
    const completedClass = completed ? "completed-task" : "";
    const isChecked = completed ? "checked" : "";
    const rowClass = completed ? "todo-row completed" : "todo-row";
    const today = new Date().toISOString().split("T")[0];

    let dateColor = "";
    if (dueDate && !completed) {
      if (dueDate < today) dateColor = "red";
      else if (dueDate === today) dateColor = "orange";
      else dateColor = "green";
    }

    let priorityClass = "";
    if (priority === "High") priorityClass = "priority-high";
    else if (todoObject.priority === "Medium")
      priorityClass = "priority-medium";
    else priorityClass = "priority-low";

    const html = `
    <div class="${rowClass}">
        <label class="${completedClass}">
          <input type="checkbox" class="js-checkbox" data-index="${index}" ${isChecked}>
          ${name}
        </label>

        <div style="color:${dateColor}" class="${completedClass}">${dueDate}</div>
        <span class="priority-label ${priorityClass}">${priority}</span>
        <button class="edit-button js-edit" data-index="${index}">✏️</button>
        <button class="delete-button js-delete" data-index="${index}">❌</button>
    </div>
        `;
    todoListHTML += html;
  });

  todoListElement.innerHTML = todoListHTML;

  // Delete button
  document.querySelectorAll(".js-delete").forEach((deleteButton, index) => {
    deleteButton.addEventListener("click", () => {
      todoList.splice(index, 1);
      renderTodoList();
      saveData();
    });
  });

  document.querySelectorAll(".js-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const index = checkbox.dataset.index;
      todoList[index].completed = checkbox.checked;
      renderTodoList();
      saveData();
    });
  });

  // Edit button
  document.querySelectorAll(".js-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentEditIndex = btn.dataset.index;
      const task = todoList[currentEditIndex];
      document.getElementById("editName").value = task.name;
      document.getElementById("editDate").value = task.dueDate;
      document.getElementById("editPriority").value = task.priority;
      document.getElementById("editModal").style.display = "flex";
    });
  });
}

function addTask() {
  const name = document.querySelector(".input-name").value.trim();
  const dueDate = document.querySelector(".due-date").value;
  const priority = document.querySelector(".priority-select").value;

  if (name && dueDate && priority) {
    todoList.push({ name, dueDate, priority, completed: false });

    document.querySelector(".input-name").value = "";
    document.querySelector(".due-date").value = "";
    renderTodoList();
    saveData();
  } else {
    alert("Please fill in both name and due date.");
  }
}

function filterTask() {
  const filter = filterOption.value;
  const tasks = document.querySelectorAll(".todo-row");
  tasks.forEach((task) => {
    if (filter === "all") task.style.display = "flex";
    else if (filter === "completed") {
      task.style.display = task.classList.contains("completed")
        ? "flex"
        : "none";
    } else if (filter === "pending") {
      task.style.display = task.classList.contains("completed")
        ? "none"
        : "flex";
    }
  });
}

function saveData() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

function showTasks() {
  const stored = localStorage.getItem("todoList");
  if (stored) {
    todoList.splice(0, todoList.length, ...JSON.parse(stored));
  }
}

// Add buttonn
document.querySelector(".add-button").addEventListener("click", addTask);

document.getElementById("cancelEditBtn").addEventListener("click", () => {
  document.getElementById("editModal").style.display = "none";
});

document.getElementById("saveEditBtn").addEventListener("click", () => {
  const name = document.getElementById("editName").value.trim();
  const dueDate = document.getElementById("editDate").value;
  const priority = document.getElementById("editPriority").value;

  if (name && dueDate) {
    todoList[currentEditIndex] = {
      ...todoList[currentEditIndex],
      name,
      dueDate,
      priority,
    };
    renderTodoList();
    saveData();
    document.getElementById("editModal").style.display = "none";
  } else {
    alert("All fields are required.");
  }
});
