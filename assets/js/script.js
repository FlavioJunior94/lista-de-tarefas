document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const progressBar = document.getElementById('progress');
  const progressLabel = document.getElementById('progress-label');

  let tasks = [];
  let editingTaskId = null;

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
    tasks.forEach((task, index) => {
      const li = document.createElement('li');

      if (editingTaskId === task.id) {
        li.innerHTML = `
          <div class="task-text">
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
            <input type="text" class="edit-input" value="${task.text}" id="edit-input-${task.id}">
            <div class="edit-actions">
              <button class="action-btn save-btn" onclick="saveEdit(${task.id})"><i class="fas fa-check"></i></button>
              <button class="action-btn cancel-btn" onclick="cancelEdit()"><i class="fas fa-times"></i></button>
            </div>
          </div>
        `;
      } else {
        li.innerHTML = `
          <div class="task-text">
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
            <div class="task-content">${task.text}</div>
          </div>
          <div class="task-actions">
            <button class="action-btn menu-btn" onclick="toggleMenu(${task.id})" title="Opções"><i class="fas fa-ellipsis-v"></i></button>
            <div class="actions-menu" id="menu-${task.id}" style="display: none;">
              <button class="action-btn edit-btn" onclick="editTask(${task.id})" title="Editar tarefa"><i class="fas fa-edit"></i></button>
              <button class="action-btn duplicate-btn" onclick="duplicateTask(${task.id})" title="Duplicar tarefa"><i class="fas fa-copy"></i></button>
              <button class="action-btn move-up-btn" onclick="moveTask(${index}, -1)" title="Mover para cima" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
              <button class="action-btn move-down-btn" onclick="moveTask(${index}, 1)" title="Mover para baixo" ${index === tasks.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
              <button class="action-btn delete-btn" onclick="deleteTask(${task.id})" title="Excluir tarefa"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `;
      }
      
      li.className = task.completed ? 'completed' : '';

      const checkbox = li.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', function() {
        task.completed = this.checked;
        saveTasks();
        updateProgress();
        updateTasks();
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

  window.editTask = function(id) {
    editingTaskId = id;
    updateTasks();

    setTimeout(() => {
      const editInput = document.getElementById(`edit-input-${id}`);
      if (editInput) {
        editInput.focus();
        editInput.select();
      }
    }, 100);
  };

  window.saveEdit = function(id) {
    const editInput = document.getElementById(`edit-input-${id}`);
    const newText = editInput.value.trim();
    
    if (newText !== '') {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.text = newText;
        saveTasks();
      }
    }
    
    editingTaskId = null;
    updateTasks();
  };


  window.cancelEdit = function() {
    editingTaskId = null;
    updateTasks();
  };


  window.duplicateTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const duplicatedTask = {
        id: Date.now(),
        text: task.text,
        completed: false
      };
      tasks.push(duplicatedTask);
      saveTasks();
      updateTasks();
      updateProgress();
    }
  };

  window.moveTask = function(currentIndex, direction) {
    const newIndex = currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < tasks.length) {

      [tasks[currentIndex], tasks[newIndex]] = [tasks[newIndex], tasks[currentIndex]];
      saveTasks();
      updateTasks();
    }
  };


  window.deleteTask = function(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    updateProgress();
    updateTasks();
  };


  window.toggleMenu = function(id) {
    const menu = document.getElementById(`menu-${id}`);
    const isVisible = menu.style.display !== 'none';

    document.querySelectorAll('.actions-menu').forEach(m => m.style.display = 'none');

    if (!isVisible) {
      menu.style.display = 'flex';
    }
  };

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && editingTaskId) {
      saveEdit(editingTaskId);
    } else if (e.key === 'Escape' && editingTaskId) {
      cancelEdit();
    }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.task-actions')) {
      document.querySelectorAll('.actions-menu').forEach(m => m.style.display = 'none');
    }
  });


  function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    progressBar.style.width = `${percentage}%`;
    progressLabel.textContent = `${Math.round(percentage)}%`;

    progressBar.classList.remove('red', 'orange', 'yellow', 'blue', 'green');
    
    if (percentage >= 0 && percentage < 20) {
      progressBar.classList.add('red');
    } else if (percentage >= 20 && percentage < 40) {
      progressBar.classList.add('orange');
    } else if (percentage >= 40 && percentage < 60) {
      progressBar.classList.add('yellow');
    } else if (percentage >= 60 && percentage < 80) {
      progressBar.classList.add('blue');
    } else if (percentage >= 80) {
      progressBar.classList.add('green');
    }
  }
});