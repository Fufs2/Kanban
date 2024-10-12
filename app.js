let tasks = {
    todo: [],
    inprogress: [],
    done: []
};

let currentUser = null; // Variável para armazenar o usuário logado

// Função para fazer login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Carrega os dados do arquivo users.json
    fetch('Data/users.json') // O caminho deve ser correto
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar usuários');
            }
            return response.json();
        })
        .then(users => {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                currentUser = user.username; // Armazena o usuário logado
                console.log(`Usuário logado: ${currentUser}`); // Log do usuário logado
                document.getElementById('login-form').style.display = 'none'; // Esconde o formulário
                document.getElementById('kanban-board').style.display = 'block'; // Mostra o Kanban
                renderTasks(); // Renderiza as tarefas
            } else {
                alert('Usuário ou senha inválidos');
            }
        })
        .catch(err => console.error('Erro ao carregar usuários:', err));
}

// Adiciona nova tarefa à coluna "A Fazer"
function addTask(column) {
    const taskDescription = prompt("Digite a descrição da tarefa:");
    const assignee = document.getElementById('assignee').value; // Obter o usuário selecionado

    // Apenas o admin pode atribuir tarefas
    if (currentUser !== 'admin') {
        alert('Apenas o admin pode atribuir tarefas.');
        return;
    }

    if (taskDescription && assignee) {
        const newTask = {
            description: taskDescription,
            assignedTo: assignee,
        };

        tasks[column].push(newTask); // Adiciona a nova tarefa
        console.log(`Tarefa adicionada: ${JSON.stringify(newTask)}`); // Log da nova tarefa
        renderTasks();
    } else {
        alert('Por favor, preencha a descrição da tarefa e selecione um usuário.');
    }
}

// Renderiza as tarefas em suas respectivas colunas
function renderTasks() {
    // Limpa as colunas
    document.getElementById('todo-items').innerHTML = '';
    document.getElementById('inprogress-items').innerHTML = '';
    document.getElementById('done-items').innerHTML = '';

    // Renderiza as tarefas em cada coluna
    for (const column in tasks) {
        tasks[column].forEach((task, index) => {
            console.log(`Verificando tarefa: ${JSON.stringify(task)}`); // Log de cada tarefa
            if (task.assignedTo === currentUser || currentUser === 'admin') { // Exibe para o admin ou para o usuário atribuído
                const taskDiv = createTaskDiv(task, column, index);
                taskDiv.innerHTML += ` (Atribuído a: ${task.assignedTo})`;
                document.getElementById(`${column}-items`).appendChild(taskDiv);
            }
        });
    }
}

// Cria um elemento de tarefa
function createTaskDiv(task, column, index) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'kanban-item';
    taskDiv.innerHTML = `${task.description} <button onclick="moveTask('${column}', ${index})">Mover</button>`;
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
