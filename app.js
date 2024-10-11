const tasks = {
    todo: [],
    inprogress: [],
    done: []
};

// Adiciona nova tarefa ao estado "A Fazer"
function addTask(column) {
    const task = prompt("Digite a descrição da tarefa:");
    if (task) {
        tasks[column].push(task);
        renderTasks();
    }
}

// Renderiza as tarefas em suas colunas
function renderTasks() {
    ['todo', 'inprogress', 'done'].forEach(column => {
        const itemsDiv = document.getElementById(`${column}-items`);
        itemsDiv.innerHTML = '';
        tasks[column].forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'kanban-item';
            taskDiv.innerText = task;
            taskDiv.onclick = () => moveTask(column, index);
            itemsDiv.appendChild(taskDiv);
        });
    });
}

// Move tarefas entre as colunas
function moveTask(currentColumn, index) {
    const nextColumn = currentColumn === 'todo' ? 'inprogress' :
                       currentColumn === 'inprogress' ? 'done' : 'todo';
    
    const task = tasks[currentColumn][index];
    tasks[currentColumn].splice(index, 1);
    tasks[nextColumn].push(task);
    renderTasks();
}

renderTasks();
