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

let currentUser = null;

// Função para fazer login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Carrega os dados do arquivo users.json
    fetch('users.json')  // O caminho deve ser ajustado se necessário
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                currentUser = user.username;
                document.getElementById('login-form').style.display = 'none'; // Esconde o formulário
                document.getElementById('kanban-board').style.display = 'block'; // Mostra o Kanban

                if (user.username === 'admin') {
                    document.getElementById('admin-controls').style.display = 'block'; // Mostra controles do admin
                }

                renderTasks(); // Renderiza as tarefas
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
        tasks[currentUser][column].push(task);
        renderTasks();
    }
}

// Atribui tarefa para um usuário específico
function assignTask() {
    const taskDescription = document.getElementById('taskDescription').value;
    const assignUser = document.getElementById('assignUser').value;

    if (taskDescription) {
        tasks[assignUser].todo.push(taskDescription); // Adiciona a tarefa à coluna "A Fazer" do usuário atribuído
        document.getElementById('taskDescription').value = ''; // Limpa o campo de entrada
        renderTasks();
    } else {
        alert("Digite a descrição da tarefa!");
    }
}

// Renderiza as tarefas em suas respectivas colunas
function renderTasks() {
    // Limpa as colunas
    document.getElementById('todo-items').innerHTML = '';
    document.getElementById('inprogress-items').innerHTML = '';
    document.getElementById('done-items').innerHTML = '';

    // Renderiza as tarefas do usuário atual
    tasks[currentUser].todo.forEach((task, index) => {
        const taskDiv = createTaskDiv(task, 'todo', index);
        document.getElementById('todo-items').appendChild(taskDiv);
    });

    tasks[currentUser].inprogress.forEach((task, index) => {
        const taskDiv = createTaskDiv(task, 'inprogress', index);
        document.getElementById('inprogress-items').appendChild(taskDiv);
    });

    tasks[currentUser].done.forEach((task, index) => {
        const taskDiv = createTaskDiv(task, 'done', index);
        document.getElementById('done-items').appendChild(taskDiv);
    });
}

// Cria um elemento de tarefa
function createTaskDiv(task, colu
