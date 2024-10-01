document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const progressBar = document.getElementById('progress');
  const progressLabel = document.getElementById('progress-label');

  let tasks = [];

  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    updateTasks();
    updateProgress();
  }

  taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      addTask(taskText);
      taskInput.value = '';
    }
  });

  function addTask(taskText) {
    const task = {
      id: Date.now(),
      text: taskText,
      completed: false
    };

    tasks.push(task);
    saveTasks();
    updateTasks();
    updateProgress();
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function updateTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${task.text}</span>
        <div>
          <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
          <button class="delete-btn">X</button>
        </div>
      `;
      li.className = task.completed ? 'completed' : '';
      const checkbox = li.querySelector('input');
      checkbox.addEventListener('change', function() {
        task.completed = this.checked;
        saveTasks();
        updateProgress();
        updateTasks();
      });
      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', function() {
        deleteTask(task.id);
      });
      taskList.appendChild(li);
    });
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    updateProgress();
    updateTasks();
  }

  function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
    progressLabel.textContent = `${percentage.toFixed(2)}%`;
  }
});
