"strict mode";

let tasks = [];

const tableBody = document.querySelector(".tasks-table tbody");
const totalTasks = document.getElementById("total");

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
