document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);

    taskList.addEventListener('click', handleTaskActions);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            saveTask(task);
            taskInput.value = '';
            renderTask(task);
        }
    }

    function saveTask(task) {
        const tasks = getTasksFromStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasksFromStorage() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function loadTasks() {
        const tasks = getTasksFromStorage();
        tasks.forEach(task => renderTask(task));
    }

    function renderTask(task) {
        const taskItem = document.createElement('li');
        taskItem.className = `task ${task.completed ? 'completed' : ''}`;
        taskItem.setAttribute('data-id', task.id);
        taskItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
                <button class="complete-btn">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    }

    function handleTaskActions(e) {
        if (e.target.classList.contains('edit-btn')) {
            editTask(e.target.closest('.task'));
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTask(e.target.closest('.task'));
        } else if (e.target.classList.contains('complete-btn')) {
            toggleTaskCompletion(e.target.closest('.task'));
        }
    }

    function editTask(taskItem) {
        const taskId = taskItem.getAttribute('data-id');
        const taskText = taskItem.querySelector('.task-text').textContent;
        const newTaskText = prompt('Edit task:', taskText);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            taskItem.querySelector('.task-text').textContent = newTaskText;
            updateTaskInStorage(taskId, { text: newTaskText });
        }
    }

    function deleteTask(taskItem) {
        const taskId = taskItem.getAttribute('data-id');
        taskItem.remove();
        removeTaskFromStorage(taskId);
    }

    function toggleTaskCompletion(taskItem) {
        const taskId = taskItem.getAttribute('data-id');
        taskItem.classList.toggle('completed');
        const completed = taskItem.classList.contains('completed');
        updateTaskInStorage(taskId, { completed });
        taskItem.querySelector('.complete-btn').textContent = completed ? 'Uncomplete' : 'Complete';
    }

    function updateTaskInStorage(taskId, updates) {
        const tasks = getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex > -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function removeTaskFromStorage(taskId) {
        let tasks = getTasksFromStorage();
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
