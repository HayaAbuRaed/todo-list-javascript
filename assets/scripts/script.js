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
        <button data-action="delete">Delete</button>
        <button data-action="finish">${
          task.completed ? "Undo" : "Done"
        }</button>
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

tableBody.addEventListener("click", (event) => {
  if (event.target.dataset.action === "finish") toggleStatus(event);
  else if (event.target.dataset.action === "delete") deleteTask(event);
});

/**
 * Add a new task to the tasks array.
 *
 * @param {Event} event - The event object.
 * @returns {void}
 */
addTaskButton.addEventListener("click", () => {
  // get the value of the new task field and check if it's empty
  const newTaskValue = newTaskField.value.trim();

  if (newTaskValue === "") {
    showMessage("Please enter a task...", false);
    return;
  }

  // create a new task object
  const newTask = {
    id: tasks.length + 1,
    todo: newTaskValue,
    userId: Math.floor(Math.random() * 100),
    completed: false,
  };

  /*
  add the new task to the tasks array, re-render the table,
  update the total tasks count and reset the input field
  */
  tasks.push(newTask);

  renderTableRows(tasks);

  updateTotal();

  newTaskField.value = "";

  showMessage("Task added successfully ✅");
});

/**
 * Delete a task from the tasks array.
 *
 * @param {Event} event - The event object.
 * @returns {void}
 */
const deleteTask = (event) => {
  const taskId = event.target.closest("tr").children[0].textContent;

  confirm("Are you sure you want to delete this task?") && removeTask(taskId);
};

const removeTask = (taskId) => {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));

  renderTableRows(tasks);

  updateTotal();
};

// complete a task
const toggleStatus = (event) => {
  const taskId = event.target.closest("tr").children[0].textContent;
  const task = tasks[taskId - 1];

  task.completed = !task.completed;

  renderTableRows(tasks);
};

// Search Tasks: Listen for input events on the search input field
document
  .getElementById("search")
  .addEventListener("input", (event) => searchTask(event));

/**
 * Search for a task in the tasks array.
 * Display the results in the UI.
 * @param {Event} event - The event object.
 * @returns {void}
 */
const searchTask = (event) => {
  const searchValue = event.target.value.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) =>
    task.todo.toLowerCase().includes(searchValue)
  );

  renderTableRows(filteredTasks);
};

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
