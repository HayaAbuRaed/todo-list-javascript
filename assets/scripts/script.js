"strict mode";

let tasks = [];

const tableBody = document.querySelector(".tasks-table tbody");
const totalTasks = document.getElementById("total");
const msg = document.getElementById("msg");
const addTaskButton = document.getElementById("add-button");
const newTaskField = document.getElementById("new-task");

/**
 * Render the table rows in the UI.
 *
 * @param {Array} tasks - The tasks array.
 * @returns {void}
 */
const renderTableRows = (tasks) => {
  tableBody.innerHTML = "";

  tasks.forEach((task) => {
    tableBody.innerHTML += `
    <tr id="row${task.id}">
    <td>${task.id}</td>
    <td class="description">${task.todo}</td>
    <td>${task.userId}</td>
    <td>${task.completed ? "Completed" : "Pending"}</td>
    <td>
      <div class="actions-container">
        <button data-action="delete">
          <i class="fa-solid fa-xmark button-icon"></i>
          Delete
        </button>
        <button data-action="finish">
          <i class="fa-solid fa-check button-icon"></i>
          ${task.completed ? "Undo" : "Done"}</button>
      </div>
    </td>
  </tr>
    `;
  });
  setTimeout(() => {
    document.querySelectorAll("td.description").forEach((taskCell) => {
      taskCell.addEventListener("dblclick", updateTask);
    });
  });
};

const fetchTasks = async () => {
  try {
    let response = await fetch("https://dummyjson.com/todos");
    let data = await response.json();

    return data.todos;
  } catch (error) {
    console.error(error);
  }
};

// update the total tasks count
const updateTotal = (total) => {
  // if total is provided, update the total tasks count by that value,
  // else update it with the total tasks in the tasks array;
  // this is to handle the search functionality
  totalTasks.innerHTML = total >= 0 ? total : tasks.length;
};

const storedTasks = localStorage.getItem("tasks");

try {
  (async () => {
    if (storedTasks) tasks = JSON.parse(storedTasks);
    else {
      tasks = await fetchTasks();
      updateLocalStorage(tasks);
    }

    renderTableRows(tasks);
    updateTotal();
    localStorage.setItem("isReversed", tasks[0].id - tasks[1].id > 0);
  })();
} catch (error) {
  console.error(error);
}

const userId = localStorage.getItem("userId")
  ? localStorage.getItem("userId")
  : localStorage.setItem("userId", Math.floor(Math.random() * 100));

// check if tasks array is empty
if (tasks.length === 0) {
  tableBody.innerHTML = "<tr><td colspan='5'>No tasks found</td></tr>";
}

tableBody.addEventListener("click", (event) => {
  if (event.target.dataset.action === "finish") toggleStatus(event);
  else if (event.target.dataset.action === "delete") deleteTask(event);
});

setTimeout(() => {
  document.querySelector(".note").hidden = true;
}, 6000);

/**
 * Add a new task to the tasks array.
 *
 * it takes no parameters
 * @param {void}
 * @returns {void}
 */
const addTask = () => {
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
    userId: JSON.parse(localStorage.getItem("userId")),
    completed: false,
  };

  // add the new task to the front of the tasks array if the order is reversed and vice versa
  JSON.parse(localStorage.getItem("isReversed"))
    ? tasks.unshift(newTask)
    : tasks.push(newTask);

  updateTasksList(tasks);

  newTaskField.value = "";

  showMessage("Task added successfully ✅");

  document.getElementById(`row${newTask.id}`).style.backgroundColor =
    "rgba(25, 196, 25, 0.235)";

  setTimeout(() => {
    document.getElementById(`row${newTask.id}`).style.backgroundColor =
      "transparent";
  }, 3000);
};

addTaskButton.addEventListener("click", addTask);

newTaskField.addEventListener(
  "keyup",
  (event) => event.key === "Enter" && addTask()
);

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

  // subtract 1 from the id of each task after the deleted task
  tasks.forEach((task, index) => (task.id = index + 1));

  updateTasksList(tasks);
};

// complete a task
const toggleStatus = (event) => {
  const taskId = event.target.closest("tr").children[0].textContent;
  const task = tasks[taskId - 1];

  task.completed = !task.completed;

  updateTasksList(tasks, false);
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

  updateTotal(filteredTasks.length);
};

// TODO update a task
const updateTask = (event) => {
  const taskCell = event.target.closest("td");
  const taskId = taskCell.closest("tr").children[0].textContent;
  const task = tasks[taskId - 1];

  // switch the to do text with an input field
  const updateTaskField = document.createElement("input");
  updateTaskField.classList.add("update-task-field");
  updateTaskField.value = task.todo;

  taskCell.innerHTML = "";

  taskCell.appendChild(updateTaskField);

  updateTaskField.focus();

  // if focus is lost, remove the input field and display the to do text
  updateTaskField.addEventListener("blur", () => {
    taskCell.innerHTML = task.todo;
    return;
  });

  // if the enter key is pressed, update the task
  updateTaskField.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      updateTaskValue(task, updateTaskField);
    }
  });
};

const updateTaskValue = (task, updateTaskField) => {
  const newTaskValue = updateTaskField.value.trim();

  if (newTaskValue === null || newTaskValue.trim() === "") {
    showMessage("Task update cancelled", false);
    return;
  }

  task.todo = newTaskValue;

  updateTasksList(tasks, false);
};

//update the tasks array in local storage
const updateLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const updateTasksList = (tasks, isLengthAffected = true) => {
  updateLocalStorage(tasks);

  renderTableRows(tasks);

  isLengthAffected && updateTotal();
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

const reverseButton = document.getElementById("reverse");
const arrowUp = '<i class="fa-solid fa-arrow-up"></i>';
const arrowDown = '<i class="fa-solid fa-arrow-down"></i>';

const reverseButtonArrowDirection = () => {
  return JSON.parse(localStorage.getItem("isReversed")) ? arrowDown : arrowUp;
};

reverseButton.innerHTML = reverseButtonArrowDirection();

// add a button to reverse the order of the tasks
reverseButton.addEventListener("click", () => {
  tasks.reverse();

  updateTasksList(tasks, false);

  localStorage.setItem("isReversed", tasks[0].id - tasks[1].id > 0);

  reverseButton.innerHTML = reverseButtonArrowDirection();
});
