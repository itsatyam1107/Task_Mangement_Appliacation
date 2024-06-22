document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    // Fetch and display tasks
    fetchTasks();

    // Add task event
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addTask();
    });

    // Fetch tasks from server
    function fetchTasks() {
        fetch('http://localhost:3000/tasks')
            .then(response => response.json())
            .then(data => {
                taskList.innerHTML = '';
                data.forEach(task => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div>
                            <strong>Title:</strong> <span class="task-title">${task.title}</span> <br>
                            <strong>Description:</strong> <span class="task-description">${task.description}</span> <br>
                            <strong>Due Date:</strong> <span class="task-dueDate">${task.dueDate}</span>
                        </div>
                        <button onclick="editTask(${task.id})">Edit</button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    `;
                    taskList.appendChild(li);
                });
            });
    }

    // Add task to server
    function addTask() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;

        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, dueDate }),
        })
        .then(response => response.json())
        .then(data => {
            fetchTasks();
            taskForm.reset();
        });
    }

    // Edit task
    window.editTask = function(id) {
        const taskItem = document.querySelector(`li button[onclick='editTask(${id})']`).parentElement;
        const titleElement = taskItem.querySelector('.task-title');
        const descriptionElement = taskItem.querySelector('.task-description');
        const dueDateElement = taskItem.querySelector('.task-dueDate');

        const title = prompt('Edit Title', titleElement.textContent);
        const description = prompt('Edit Description', descriptionElement.textContent);
        const dueDate = prompt('Edit Due Date', dueDateElement.textContent);

        if (title && description && dueDate) {
            fetch(`http://localhost:3000/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, dueDate }),
            })
            .then(response => response.json())
            .then(data => {
                fetchTasks();
            });
        }
    };

    // Delete task from server
    window.deleteTask = function(id) {
        fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            fetchTasks();
        });
    };
});
