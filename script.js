const PASSWORD = "1234"; // Puedes cambiarla por la que quieras

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === PASSWORD) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    loadTasks();
  } else {
    alert("Contraseña incorrecta");
  }
}

document.getElementById("task-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const person = document.getElementById("person").value;

  const task = { title, category, person, done: false };
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  this.reset();
  loadTasks();
});

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.title}</strong> | ${task.category} | ${task.person}
      <button onclick="toggleDone(${index})">${task.done ? '✅' : '❌'}</button>
      <button onclick="deleteTask(${index})">Eliminar</button>
    `;
    li.style.textDecoration = task.done ? "line-through" : "none";
    list.appendChild(li);
  });
}

function toggleDone(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[index].done = !tasks[index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function exportToExcel() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const worksheet = XLSX.utils.json_to_sheet(tasks);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tareas");
  XLSX.writeFile(workbook, "tareas.xlsx");
}
