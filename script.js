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

// Subcategorías por categoría
const SUBCATEGORIES = {
  "Música": ["tubos", "baterias", "steel"],
  "Traje": ["telas", "pasamaneria"],
};

function updateSubcategory() {
  const category = document.getElementById("category").value;
  const subcat = document.getElementById("subcategory");
  const label = document.getElementById("label-subcategory");
  subcat.innerHTML = "";
  if (SUBCATEGORIES[category]) {
    subcat.style.display = "block";
    label.style.display = "block";
    subcat.innerHTML = '<option value="">Selecciona una subcategoría</option>' + SUBCATEGORIES[category].map(s => `<option value="${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join("");
  } else {
    subcat.style.display = "none";
    label.style.display = "none";
  }
}
document.getElementById("category").addEventListener("change", updateSubcategory);

// Filtros en cabecera de tabla
["filter-title", "filter-category", "filter-person", "filter-status", "filter-subcategory", "filter-deadline"].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", loadTasks);
    el.addEventListener("change", loadTasks);
  }
});

let editIndex = null;

// Mostrar/ocultar formulario
const showAddBtn = document.getElementById("show-add-task");
const taskForm = document.getElementById("task-form");
const cancelBtn = document.getElementById("cancel-task");
showAddBtn.onclick = () => {
  taskForm.reset();
  updateSubcategory();
  editIndex = null;
  document.getElementById("status").value = "Pendiente";
  taskForm.style.display = "flex";
  showAddBtn.style.display = "none";
};
cancelBtn.onclick = () => {
  taskForm.style.display = "none";
  showAddBtn.style.display = "inline-block";
};

document.getElementById("task-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const subcategory = document.getElementById("subcategory").style.display !== "none" ? document.getElementById("subcategory").value : "";
  const person = document.getElementById("person").value.trim();
  const deadline = document.getElementById("deadline").value;
  const status = document.getElementById("status").value;
  if (!title || !category || (document.getElementById("subcategory").style.display !== "none" && !subcategory) || !person || !deadline) {
    alert("Por favor, completa todos los campos obligatorios.");
    return;
  }
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = { title, category, subcategory, person, deadline, status };
  if (editIndex !== null) {
    if (status === 'Hecho' && tasks[editIndex].status !== 'Hecho') {
      task.hechoDate = new Date().toISOString();
    } else if (status === 'Hecho' && tasks[editIndex].hechoDate) {
      task.hechoDate = tasks[editIndex].hechoDate;
    }
    if (status === 'Pendiente') {
      delete task.hechoDate;
    }
    tasks[editIndex] = { ...tasks[editIndex], ...task };
  } else {
    if (status === 'Hecho') {
      task.hechoDate = new Date().toISOString();
    }
    tasks.push(task);
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  this.reset();
  updateSubcategory();
  loadTasks();
  taskForm.style.display = "none";
  showAddBtn.style.display = "inline-block";
  editIndex = null;
});

function formatDateDMY(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

function renderAddRow() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" id="add-title" placeholder="Tarea" style="width:98%"></td>
    <td>
      <select id="add-category" style="width:98%">
        <option value="">Categoría</option>
        <option value="Música">Música</option>
        <option value="Traje">Traje</option>
        <option value="Estandarte">Estandarte</option>
        <option value="Espectáculo">Espectáculo</option>
        <option value="Carro">Carro</option>
      </select>
    </td>
    <td>
      <select id="add-subcategory" style="width:98%"></select>
    </td>
    <td><input type="text" id="add-person" placeholder="Persona" style="width:98%"></td>
    <td><input type="date" id="add-deadline" style="width:98%"></td>
    <td>
      <select id="add-status" style="width:98%">
        <option value="Pendiente">Pendiente</option>
        <option value="Hecho">Hecho</option>
      </select>
    </td>
    <td>
      <button class="btn-add" onclick="addTaskFromRow()" title="Añadir tarea">➕ Añadir</button>
    </td>
  `;
  // Subcategoría dependiente
  const subcatSel = tr.querySelector('#add-subcategory');
  const catSel = tr.querySelector('#add-category');
  function updateAddSubcat() {
    const cat = catSel.value;
    subcatSel.innerHTML = '';
    if (SUBCATEGORIES[cat]) {
      subcatSel.style.display = 'block';
      subcatSel.innerHTML = '<option value="">Subcategoría</option>' + SUBCATEGORIES[cat].map(s => `<option value="${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join("");
    } else {
      subcatSel.style.display = 'none';
    }
  }
  catSel.addEventListener('change', updateAddSubcat);
  updateAddSubcat();
  return tr;
}

function addTaskFromRow() {
  const title = document.getElementById('add-title').value.trim();
  const category = document.getElementById('add-category').value;
  const subcategory = document.getElementById('add-subcategory').style.display !== 'none' ? document.getElementById('add-subcategory').value : '';
  const person = document.getElementById('add-person').value.trim();
  const deadline = document.getElementById('add-deadline').value;
  const status = document.getElementById('add-status').value;
  if (!title || !category || (document.getElementById('add-subcategory').style.display !== 'none' && !subcategory) || !person || !deadline) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = { title, category, subcategory, person, deadline, status };
  if (status === 'Hecho') {
    task.hechoDate = new Date().toISOString();
  }
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // Filtros
  const fTitle = (document.getElementById("filter-title")?.value || "").toLowerCase();
  const fCategory = document.getElementById("filter-category")?.value || "";
  const fSubcategory = (document.getElementById("filter-subcategory")?.value || "").toLowerCase();
  const fPerson = (document.getElementById("filter-person")?.value || "").toLowerCase();
  const fStatus = document.getElementById("filter-status")?.value || "";
  const fDeadline = document.getElementById("filter-deadline")?.value || "";
  // Ordenar: primero Pendiente, luego por fecha
  tasks.sort((a, b) => {
    if (a.status !== b.status) return a.status === "Pendiente" ? -1 : 1;
    return (a.deadline || "9999-12-31").localeCompare(b.deadline || "9999-12-31");
  });
  // Filtrar
  const filteredTasks = tasks.filter(task =>
    (!fTitle || task.title.toLowerCase().includes(fTitle)) &&
    (!fCategory || task.category === fCategory) &&
    (!fSubcategory || (task.subcategory || "").toLowerCase().includes(fSubcategory)) &&
    (!fPerson || task.person.toLowerCase().includes(fPerson)) &&
    (!fStatus || task.status === fStatus) &&
    (!fDeadline || task.deadline === fDeadline)
  );
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  if (filteredTasks.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="7" style="text-align:center;color:#888;font-style:italic;">No hay tareas registradas</td>';
    list.appendChild(tr);
    return;
  }
  const today = new Date();
  today.setHours(0,0,0,0);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(today.getDate() + 7);
  filteredTasks.forEach((task, idx) => {
    const realIndex = tasks.findIndex(t =>
      t.title === task.title &&
      t.category === task.category &&
      t.subcategory === task.subcategory &&
      t.person === task.person &&
      t.deadline === task.deadline &&
      t.status === task.status
    );
    if (editIndex === realIndex) {
      // Render editable row
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="text" id="edit-title" value="${task.title}" style="width:98%"></td>
        <td>
          <select id="edit-category" style="width:98%">
            <option value="Música" ${task.category === 'Música' ? 'selected' : ''}>Música</option>
            <option value="Traje" ${task.category === 'Traje' ? 'selected' : ''}>Traje</option>
            <option value="Estandarte" ${task.category === 'Estandarte' ? 'selected' : ''}>Estandarte</option>
            <option value="Espectáculo" ${task.category === 'Espectáculo' ? 'selected' : ''}>Espectáculo</option>
            <option value="Carro" ${task.category === 'Carro' ? 'selected' : ''}>Carro</option>
          </select>
        </td>
        <td>
          <select id="edit-subcategory" style="width:98%"></select>
        </td>
        <td><input type="text" id="edit-person" value="${task.person}" style="width:98%"></td>
        <td><input type="date" id="edit-deadline" value="${task.deadline}" style="width:98%"></td>
        <td>
          <select id="edit-status" style="width:98%">
            <option value="Pendiente" ${task.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="Hecho" ${task.status === 'Hecho' ? 'selected' : ''}>Hecho</option>
          </select>
        </td>
        <td>
          <button class="btn-save" onclick="saveEdit(${realIndex})" title="Guardar cambios">💾</button>
          <button class="btn-cancel" onclick="cancelEdit()" title="Cancelar">❌</button>
        </td>
      `;
      list.appendChild(tr);
      const subcatSel = tr.querySelector('#edit-subcategory');
      const cat = tr.querySelector('#edit-category').value;
      updateEditSubcategory(cat, task.subcategory);
      tr.querySelector('#edit-category').addEventListener('change', function() {
        updateEditSubcategory(this.value, '');
      });
    } else {
      let deadlineClass = "";
      let deadlineStyle = "";
      if (task.deadline) {
        const taskDate = new Date(task.deadline);
        taskDate.setHours(0,0,0,0);
        if (taskDate < today) {
          deadlineClass = "date-past";
          deadlineStyle = "color:#e74c3c;font-weight:bold;";
        } else if (taskDate <= weekFromNow) {
          deadlineClass = "date-soon";
          deadlineStyle = "color:#e67e22;font-weight:bold;";
        }
      }
      let hechoDate = "";
      if (task.status === "Hecho" && task.hechoDate) {
        hechoDate = `<div style='font-size:0.85em;color:#888;margin-top:2px;'>Hecho el ${formatDateDMY(task.hechoDate)}</div>`;
      }
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${task.title}</td>
        <td>${task.category}</td>
        <td>${task.subcategory || "-"}</td>
        <td>${task.person}</td>
        <td class="${deadlineClass}" style="${deadlineStyle}">${formatDateDMY(task.deadline)}${hechoDate}</td>
        <td><span class="status-${task.status.toLowerCase()}">${task.status}</span></td>
        <td>
          <button class="btn-edit" title="Editar" onclick="editTask(${realIndex})">✏️</button>
          <button class="btn-status" title="Cambiar estado" onclick="toggleStatus(${realIndex})">${task.status === 'Hecho' ? '↩️' : '✅'}</button>
          <button class="btn-delete" title="Eliminar" onclick="deleteTask(${realIndex})">🗑️</button>
        </td>
      `;
      list.appendChild(tr);
    }
  });
}

function updateEditSubcategory(category, selected) {
  const subcatSel = document.getElementById('edit-subcategory');
  subcatSel.innerHTML = '';
  if (SUBCATEGORIES[category]) {
    subcatSel.style.display = 'block';
    subcatSel.innerHTML = '<option value="">Subcategoría</option>' + SUBCATEGORIES[category].map(s => `<option value="${s}" ${selected === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join("");
  } else {
    subcatSel.style.display = 'none';
  }
}

function editTask(index) {
  editIndex = index;
  loadTasks();
}

function cancelEdit() {
  editIndex = null;
  loadTasks();
}

function saveEdit(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const title = document.getElementById('edit-title').value.trim();
  const category = document.getElementById('edit-category').value;
  const subcategory = document.getElementById('edit-subcategory').style.display !== 'none' ? document.getElementById('edit-subcategory').value : '';
  const person = document.getElementById('edit-person').value.trim();
  const deadline = document.getElementById('edit-deadline').value;
  const status = document.getElementById('edit-status').value;
  if (!title || !category || (document.getElementById('edit-subcategory').style.display !== 'none' && !subcategory) || !person || !deadline) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }
  if (status === 'Hecho' && tasks[index].status !== 'Hecho') {
    tasks[index].hechoDate = new Date().toISOString();
  }
  if (status === 'Pendiente') {
    delete tasks[index].hechoDate;
  }
  tasks[index] = { ...tasks[index], title, category, subcategory, person, deadline, status };
  localStorage.setItem("tasks", JSON.stringify(tasks));
  editIndex = null;
  loadTasks();
}

function getTaskIndex(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  return tasks.findIndex(t =>
    t.title === task.title &&
    t.category === task.category &&
    t.subcategory === task.subcategory &&
    t.person === task.person &&
    t.deadline === task.deadline &&
    t.status === task.status
  );
}

function toggleStatus(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks[index].status === "Pendiente") {
    tasks[index].status = "Hecho";
    tasks[index].hechoDate = new Date().toISOString();
  } else {
    tasks[index].status = "Pendiente";
    delete tasks[index].hechoDate;
  }
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

// Cargar tareas al iniciar si ya está logueado
if (document.getElementById("app-container").style.display !== "none") {
  loadTasks();
}
