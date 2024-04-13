"strict mode";

let tasks = [];

const tableBody = document.querySelector(".tasks-table tbody");
const totalTasks = document.getElementById("total");
const msg = document.getElementById("msg");
const addTaskButton = document.getElementById("add-button");
const newTaskField = document.getElementById("new-task");

// fetch the data from the API
const fetchTasks = async () => {
  try {
    let response = await fetch("https://dummyjson.com/todos");
    let data = await response.json();

    tasks = data.todos;

    renderTableRows(tasks);

    updateTotal();
  } catch (error) {
    console.error(error);
  }
};

fetchTasks();

if (tasks.length === 0) {
  tableBody.innerHTML = "<tr><td colspan='5'>No tasks found</td></tr>";
}

// render the todo tasks in table rows
const renderTableRows = (tasks) => {
  tableBody.innerHTML = "";

  tasks.forEach((task) => {
    tableBody.innerHTML += `
    <tr>
    <td>${task.id}</td>
    <td>${task.todo}</td>
    <td>${task.userId}</td>
    <td>${task.completed ? "Completed" : "Pending"}</td>
    <td>
      <div class="actions-container">
        <button>Delete</button>
        <button>Done</button>
      </div>
    </td>
  </tr>
    `;
  });
};

// update the total tasks count
const updateTotal = () => {
  totalTasks.innerHTML = tasks.length;
};

// add a new task
addTaskButton.addEventListener("click", () => {
  const newTaskValue = newTaskField.value.trim();

  if (newTaskValue === "") {
    showMessage("Please enter a task...", false);
    return;
  }

  const newTask = {
    id: tasks.length + 1,
    todo: newTaskValue,
    userId: Math.floor(Math.random() * 100),
    completed: false,
  };

  tasks.push(newTask);

  renderTableRows(tasks);

  updateTotal();

  newTaskField.value = "";

  showMessage("Task added successfully ✅");
});

/**
 * Display a message in the UI.
 *
 * @param {string} message - The message to display.
 * @param {boolean} success - Whether the message indicates success (default: true).
 * @returns {void}
 */
const showMessage = (message, success = true) => {
  msg.innerHTML = message;

  msg.classList.add(success ? "success" : "error");
  newTaskField.classList.add(success ? "success" : "error");

  setTimeout(() => {
    msg.innerHTML = "";
    msg.classList.remove("success", "error");
    newTaskField.classList.remove("success", "error");
  }, 3000);
};
