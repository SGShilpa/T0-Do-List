const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const taskCount = document.getElementById("task-count");
const prioritySelector = document.getElementById("priority-selector");
const dueDateInput = document.getElementById("due-date");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Check if dark mode is set in localStorage
if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
}

// Add task
function addTask() {
    const taskText = inputBox.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText === '') {
        alert("You must write something!");
        return;
    }

    // Check for duplicates
    const tasks = Array.from(listContainer.children).map(li => li.textContent.replace("\u00d7", "").trim());
    if (tasks.includes(taskText)) {
        alert("This task already exists!");
        return;
    }

    let li = document.createElement("li");
    li.innerHTML = `${taskText} <small>Due: ${dueDate}</small>`;
    li.classList.add(prioritySelector.value);
    listContainer.appendChild(li);

    // Add delete button
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    li.addEventListener('dblclick', () => {
        let newTask = prompt("Edit task:", li.innerText.replace("×", "").trim());
        if (newTask) {
            li.innerHTML = `${newTask} <small>Due: ${dueDate}</small>`;
            li.classList.add(prioritySelector.value);
            li.appendChild(span);
        }
    });

    inputBox.value = "";
    dueDateInput.value = "";
    saveData();
    updateTaskCount();
}

// Handle task interactions (check/uncheck, delete)
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
        updateTaskCount();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
        updateTaskCount();
    }
});

// Save data to localStorage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

// Load tasks from localStorage
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data") || "";
    updateTaskCount();
}
showTask();

// Clear all tasks
function clearAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        listContainer.innerHTML = "";
        saveData();
        updateTaskCount();
    }
}

// Filter tasks based on active/completed
function filterTasks(filter) {
    const tasks = listContainer.children;
    for (let task of tasks) {
        if (filter === "all") {
            task.style.display = "block";
        } else if (filter === "active" && task.classList.contains("checked")) {
            task.style.display = "none";
        } else if (filter === "completed" && !task.classList.contains("checked")) {
            task.style.display = "none";
        } else {
            task.style.display = "block";
        }
    }
}

// Update task count
function updateTaskCount() {
    const totalTasks = listContainer.children.length;
    const completedTasks = Array.from(listContainer.children).filter(task => task.classList.contains("checked")).length;
    const activeTasks = totalTasks - completedTasks;
    taskCount.innerHTML = `Total: ${totalTasks} | Active: ${activeTasks} | Completed: ${completedTasks}`;
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
    } else {
        localStorage.setItem("dark-mode", "disabled");
    }
}
