let tasks = {
    user1: {
        todo: [],
        inprogress: [],
        done: []
    },
    admin: {
        todo: [],
        inprogress: [],
        done: []
    }
};

// Função para fazer login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Carrega os dados do arquivo users.json
    fetch('Data/users.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar usuários');
            }
            return response.json();
        })
        .then(users => {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                document.getElementById('login-form').style.display = 'none'; // Esconde o formulário
                document.getElementById('kanban-board').style.display = 'block'; // Mostra o Kanban
                if (user.username === "admin") {
                    document.getElementById('admin-controls').style.display = 'block'; // Mostra controles do admin
                }
                renderTasks(user.username); // Renderiza as tarefas do usuário
            } else {
                alert('Usuário ou senha inválidos');
            }
        })
        .catch(err => console.error('Erro ao carregar usuários:', err));
}

// Adiciona nova tarefa à coluna "A Fazer"
function addTask(column) {
    const task = prompt("Digite a descrição da tarefa:");
    if (task) {
        tasks.admin[column].push(task);
        renderTasks('admin');
    }
}

// Atribui uma tarefa a um usuário específico
function assignTask() {
    const taskDescription = document.getElementById('taskDescription').value;
    const assignedUser = document.getElementById('assignUser').value;
    if (taskDescription && assignedUser) {
        tasks[assignedUser].todo.push(taskDescription); // Adiciona a tarefa à coluna "A Fazer"
        renderTasks(assignedUser); // Renderiza tarefas do usuário
    }
}

// Renderiza as tarefas para um usuário específico
function renderTasks(user) {
    // Limpa as colunas
    document.getElementById('todo-items').innerHTML = '';
    document.getElementById('inprogress-items').innerHTML = '';
    document.getElementById('done-items').innerHTML = '';

    // Renderiza as tarefas do usuário
    tasks[user].todo.forEach((task, index) => {
        const taskDiv = createTaskDiv(task, 'todo', index, user);
        document.getElementById('todo-items').appendChild(taskDiv);
    });

    tasks[user].inprogress.forEach((task, index) => {
        const taskDiv = createTaskDiv(task, 'inprogress', index, user);
        document.getElementById('inprogress-items').appendChild(taskDiv);
    });

    tasks[user].done.forEach((task, index) => {
        const taskDiv = createTaskDiv(task, 'done', index, user);
        document.getElementById('done-items').appendChild(taskDiv);
    });
}

// Cria um elemento de tarefa
function createTaskDiv(task, column, index, user) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'kanban-item';
    taskDiv.innerHTML = `${task} <button onclick="moveTask('${user}', '${column}', ${index})">Mover</button>`;
    return taskDiv;
}

// Move tarefa para a próxima coluna
function moveTask(user, currentColumn, index) {
    let nextColumn;

    // Define para qual coluna a tarefa deve ser movida
    if (currentColumn === 'todo') {
        nextColumn = 'inprogress';
    } else if (currentColumn === 'inprogress') {
        nextColumn = 'done';
    } else if (currentColumn === 'done') {
        nextColumn = 'todo';
    }

    const task = tasks[user][currentColumn][index];
    tasks[user][currentColumn].splice(index, 1); // Remove a tarefa da coluna atual
    tasks[user][nextColumn].push(task); // Adiciona a tarefa à próxima coluna
    renderTasks(user); // Atualiza a exibição das tarefas
}

// Inicializa o quadro de Kanban
renderTasks('admin'); // Renderiza tarefas do admin inicialmente
