document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        tasks
            .filter(task => {
                if (filter === 'completed') return task.completed;
                if (filter === 'active') return !task.completed;
                return true;
            })
            .forEach(task => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                li.innerHTML = `
                    <span>${task.text}</span>
                    <button onclick="deleteTask('${task.id}')">✖</button>
                `;
                li.addEventListener('click', () => toggleTask(task.id));
                taskList.appendChild(li);
            });
    };

    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ id: Date.now().toString(), text: taskText, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            renderTasks();
        }
    };

    const toggleTask = id => {
        tasks = tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    window.deleteTask = id => {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    addTaskBtn.addEventListener('click', addTask);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');
            renderTasks(btn.dataset.filter);
        });
    });

    renderTasks();
});
