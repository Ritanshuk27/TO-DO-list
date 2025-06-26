// script.js

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = 'all') {
  const taskList = document.getElementById('taskList');
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  }).filter(task => task.text.toLowerCase().includes(searchQuery));

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'bg-white/30 backdrop-blur-sm p-3 rounded-lg flex items-center justify-between fade-in';

    const left = document.createElement('div');
    left.className = 'flex items-center space-x-2';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'form-checkbox h-5 w-5 text-green-500';
    checkbox.onchange = () => toggleComplete(index);

    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = task.completed ? 'line-through text-gray-300' : 'text-white';

    left.appendChild(checkbox);
    left.appendChild(span);

    const right = document.createElement('div');
    right.className = 'space-x-2';

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.className = 'text-blue-300 hover:text-blue-500';
    editBtn.onclick = () => editTask(index);

    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    delBtn.className = 'text-red-400 hover:text-red-600';
    delBtn.onclick = () => deleteTask(index);

    right.appendChild(editBtn);
    right.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(right);
    taskList.appendChild(li);
  });

  updateCounter();
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (text === '') return;
  tasks.push({ text, completed: false });
  input.value = '';
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt('Edit your task:', tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function clearAllTasks() {
  if (confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

function filterTasks(type) {
  renderTasks(type);
}

function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  document.getElementById('taskCounter').textContent =
    `${total} tasks (${completed} completed)`;
}

document.getElementById('searchInput').addEventListener('input', () => renderTasks());

window.onload = () => renderTasks();
