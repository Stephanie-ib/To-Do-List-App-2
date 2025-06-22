const todoList = [];

const todoListElement = document.querySelector('.todo-list');
const filterOption = document.querySelector(".filter-task");
filterOption.addEventListener("change", filterTask);
showTasks();
renderTodoList();

function renderTodoList() {
    
    let todoListHTML = '';
    todoList.forEach((todoObject, index) => {
        const {name,dueDate, completed} = todoObject;
        const completedClass = completed ? 'completed-task' : '';
        const isChecked = completed ? 'checked' : '';
        const rowClass = completed ? 'todo-row completed' : 'todo-row';

        const html = `
        <div class="${rowClass}">
            <label class="${completedClass}">
                <input type="checkbox" class="js-checkbox" data-index="${index}" ${isChecked}>
                    ${name}
            </label>
            <div class="${completedClass}">${dueDate}</div>
                <button class="delete-button js-delete" data-index="${index}">Delete</button>
        </div>
        `;
        todoListHTML += html;
    });

    todoListElement.innerHTML = todoListHTML;

    // Delete button
    document.querySelectorAll('.js-delete')
        .forEach((deleteButton, index) => {
            deleteButton.addEventListener('click', () => {
                todoList.splice(index, 1);
                renderTodoList();
                saveData();
            });
        });

    document.querySelectorAll('.js-checkbox').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
        const index = checkbox.dataset.index;
        todoList[index].completed = checkbox.checked;
        renderTodoList();
        saveData();
        });
    });

}

// Add buttonn
document.querySelector('.add-button').addEventListener('click', () => {
    addTask();
});

function addTask(){
    const inputElement = document.querySelector('.input-name');
    const name = inputElement.value;

    const dateInputElement = document.querySelector('.due-date');
    const dueDate = dateInputElement.value;

    if (name !== ''){
        todoList.push({
            name,
            dueDate,
            completed: false,
        });

        inputElement.value = '';
        dateInputElement.value = '';
        renderTodoList();
        saveData();
    }
}


function filterTask() {
    const filter = document.querySelector('.filter-task').value;
    const tasks = document.querySelectorAll('.todo-row');
    tasks.forEach((task) => {
        if (filter === "all"){
            task.style.display = "flex";
        } else if (filter === "completed") {
            task.style.display = task.classList.contains("completed") ? "flex" : "none";
        } else if (filter === "pending") {
            task.style.display = task.classList.contains("completed") ? "none" : "flex";
        }
    });
}

function saveData(){
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

function showTasks(){
    const storedList = localStorage.getItem('todoList');
    if (storedList) {
        todoList.splice(0, todoList.length, ...JSON.parse(storedList));
    }
}
