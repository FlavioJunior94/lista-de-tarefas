document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const progressBar = document.getElementById('progress');
  const progressLabel = document.getElementById('progress-label');

  let tasks = [];

  // Verificar se há tarefas salvas no localStorage
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    updateTasks();
    updateProgress();
  }

  // Event listener para adicionar tarefa
  taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      addTask(taskText);
      taskInput.value = '';
    }
  });

  // Função para adicionar tarefa à lista
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

  // Função para salvar tarefas no localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Função para atualizar a lista de tarefas no HTML
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

  // Função para deletar uma tarefa da lista
  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    updateProgress();
    updateTasks();
  }

  // Função para atualizar o gráfico de progresso
  function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
    progressLabel.textContent = `${percentage.toFixed(2)}%`;
  }
});
