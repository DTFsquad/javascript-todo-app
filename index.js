import style from "./index.css"

const todoForm = document.querySelector(".todo-form");
let tasks = [];

todoForm.addEventListener("submit", function (e) {
    // 1 preventing a reload of the page
    e.preventDefault();
    // 2 Grab the value which in the input field
    const input = this.name;
    const inputValue = input.value;

    if (inputValue != "") {
        // 3 create a new object literal which will represent the task
        const task = {
            id: new Date().getTime(),
            name: inputValue,
            isCompleted: false
        };
        // 4 Add this task to the tasks array
        tasks.push(task);
        // 5 Store the array in local storage (need to convert the objects inside the array into strings)
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // 6 Call the createTask() function for visually representing the task on the screen
        createTask(task);
        // 7 Clear the form
        todoForm.reset();
    }
    // 8 Give focus to the input field
    input.focus();
});

// Create a Task //

function createTask(task) {
    const taskEl = document.createElement("li");
    taskEl.setAttribute("id", task.id);
    const taskElMarkup = `
      <div class="checkbox-wrapper">
        <input type="checkbox" id="${task.name}-${task.id}" name="tasks" ${
        task.isCompleted ? "checked" : ""
        }>
        <label for="${task.name}-${task.id}">
          <svg class="checkbox-empty">
            <use xlink:href="#checkbox_empty"></use>
          </svg>
          <svg class="checkmark">
            <use xlink:href="#checkmark"></use>
          </svg>
        </label>
        <span ${!task.isCompleted ? "contenteditable" : ""}>${task.name}</span>
      </div>
      <button class="remove-task" title="Remove ${task.name} task">
        <svg>
          <use xlink:href="#close"></use>
        </svg>
      </button>
    `;
    taskEl.innerHTML = taskElMarkup;
    todoList.appendChild(taskEl);
    countTasks();
}

// Update a Task //

todoList.addEventListener("input", (e) => {
    const taskId = e.target.closest("li").id;
    updateTask(taskId, e.target);
  });

  function updateTask(taskId, el) {
    // 1 Grab the task that needs to be updated
    const task = tasks.find((task) => task.id === parseInt(taskId));

    if (el.hasAttribute("contentEditable")) {
      // 2 Check the element that triggered the event
      task.name = el.textContent;
    } else {
      // 3  toggle the task’s status and its checked attribute
      const span = el.nextElementSibling.nextElementSibling;
      task.isCompleted = !task.isCompleted;
      if (task.isCompleted) {
        span.removeAttribute("contenteditable");
        el.setAttribute("checked", "");
      } else {
        el.removeAttribute("checked");
        span.setAttribute("contenteditable", "");
      }
    }
    // 4 Update the value of the tasks key in local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // 5 Call the countTasks() function
    countTasks();
  }

  // Remove a Task //

  const todoList = document.querySelector(".todo-list");

todoList.addEventListener("click", (e) => {
  // 1 Check if the element that is clicked is the “close” button or its child SVG
  if (
    e.target.classList.contains("remove-task") ||
    e.target.parentElement.classList.contains("remove-task")
  ) {
    // 2 If that happens, we’ll grab the id of the parent list item
    const taskId = e.target.closest("li").id;
    // 3 Pass this id to the removeTask() function
    removeTask(taskId);
  }
});

function removeTask(taskId) {
    // 1 Remove from the tasks array the associated task
    tasks = tasks.filter((task) => task.id !== parseInt(taskId));
    // 2 Update the value of the tasks key in local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // 3 Remove the associated list item
    document.getElementById(taskId).remove();
    // 4 Call the countTasks() function
    countTasks();
  }

// Count Tasks //

const totalTasks = document.querySelector(".total-tasks span");
const completedTasks = document.querySelector(".completed-tasks span");
const remainingTasks = document.querySelector(".remaining-tasks span");

function countTasks() {
  totalTasks.textContent = tasks.length;
  const completedTasksArray = tasks.filter((task) => task.isCompleted === true);
  completedTasks.textContent = completedTasksArray.length;
  remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

// Prevent Adding New Lines //

todoList.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });