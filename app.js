const tasks = {
    todo: [],
    inprogress: [],
    done: []
};

// Adiciona nova tarefa à coluna "A Fazer"
function addTask(column) {
    const task = prompt("Digite a descrição da tarefa:");
    if (task) {
        tasks[column].push(task);
        renderTasks();
    }
}

// Renderiza as tarefas em suas respectivas colunas
function renderTasks() {
    // Limpa as colunas
    document.getElementById('todo-items').innerHTML = '';
    document.getElementById('inprogress-items').innerHTML = '';
    document.getElementById('done-items').innerHTML = '';

    // Renderiza as tarefas em cada coluna
    tasks.todo.forEach((task, index) => {
        const taskDiv = createTaskDiv(task, 'todo', index);
        document.getElementById('todo-items').appendChild(taskDiv);
    });

    tasks.inprogress.forEach((task, index) => {
        const taskDiv = createTaskDiv(task, 'inprogress', index);
        document.getElementById('inprogress-items').appendChild(taskDiv);
    });

    tasks.done.forEach((task, index) => {
        const taskDiv = createTaskDiv(task, 'done', index);
        document.getElementById('done-items').appendChild(taskDiv);
    });
}

// Cria um elemento de tarefa
function createTaskDiv(task, column, index) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'kanban-item';
    taskDiv.innerHTML = `${task} <button onclick="moveTask('${column}', ${index})">Mover</button>`;
    return taskDiv;
}

// Move tarefa para a próxima coluna
function moveTask(currentColumn, index) {
    let nextColumn;

    // Define para qual coluna a tarefa deve ser movida
    if (currentColumn === 'todo') {
        nextColumn = 'inprogress';
    } else if (currentColumn === 'inprogress') {
        nextColumn = 'done';
    } else if (currentColumn === 'done') {
        nextColumn = 'todo';
    }

    const task = tasks[currentColumn][index];
    tasks[currentColumn].splice(index, 1); // Remove a tarefa da coluna atual
    tasks[nextColumn].push(task); // Adiciona a tarefa à próxima coluna
    renderTasks(); // Atualiza a exibição das tarefas
}

// Inicializa o quadro de Kanban
renderTasks();
