document.addEventListener("DOMContentLoaded", function () {
    let tasks = {
        admin: {
            todo: [],
            inprogress: [],
            done: []
        },
        user1: {
            todo: [],
            inprogress: [],
            done: []
        }
    };

    let currentUser = null;

    // Função para fazer login
    window.login = function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Carrega os dados do arquivo users.json
        fetch('Data/users.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar usuários: ' + response.statusText);
                }
                return response.json();
            })
            .then(users => {
                const user = users.find(u => u.username === username && u.password === password);
                if (user) {
                    currentUser = user.username;
                    document.getElementById('login-form').style.display = 'none'; // Esconde o formulário
                    document.getElementById('kanban-board').style.display = 'block'; // Mostra o Kanban

                    if (user.username === 'admin') {
                        document.getElementById('admin-controls').style.display = 'block'; // Mostra controles do admin
                    } else {
                        document.getElementById('admin-controls').style.display = 'none'; // Esconde controles do admin para usuários comuns
                    }

                    renderTasks(); // Renderiza as tarefas
                } else {
                    alert('Usuário ou senha inválidos');
                }
            })
            .catch(err => console.error('Erro ao carregar usuários:', err));
    };

    // Função para adicionar nova tarefa à coluna "A Fazer"
    window.addTask = function (column) {
        const task = prompt("Digite a descrição da tarefa:");
        if (task) {
            tasks[currentUser][column].push(task);
            renderTasks();
        }
    };

    // Função para atribuir tarefa a um usuário
    window.assignTask = function () {
        const username = document.getElementById('assign-username').value;
        const taskDescription = document.getElementById('assign-task').value;

        if (tasks[username]) {
            tasks[username].todo.push(taskDescription);
            alert(`Tarefa atribuída a ${username}: "${taskDescription}"`);
            renderTasks();
        } else {
            alert('Usuário não encontrado');
        }
    };

    // Renderiza as tarefas em suas respectivas colunas
    function renderTasks() {
        // Limpa as colunas
        document.getElementById('todo-items').innerHTML = '';
        document.getElementById('inprogress-items').innerHTML = '';
        document.getElementById('done-items').innerHTML = '';

        // Renderiza as tarefas do usuário atual
        const userTasks = tasks[currentUser];
        userTasks.todo.forEach((task, index) => {
            const taskDiv = createTaskDiv(task, 'todo', index);
            document.getElementById('todo-items').appendChild(taskDiv);
        });

        userTasks.inprogress.forEach((task, index) => {
            const taskDiv = createTaskDiv(task, 'inprogress', index);
            document.getElementById('inprogress-items').appendChild(taskDiv);
        });

        userTasks.done.forEach((task, index) => {
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
    window.moveTask = function (currentColumn, index) {
        let nextColumn;

        // Define para qual coluna a tarefa deve ser movida
        if (currentColumn === 'todo') {
            nextColumn = 'inprogress';
        } else if (currentColumn === 'inprogress') {
            nextColumn = 'done';
        } else if (currentColumn === 'done') {
            nextColumn = 'todo';
        }

        const task = tasks[currentUser][currentColumn][index];
        tasks[currentUser][currentColumn].splice(index, 1); // Remove a tarefa da coluna atual
        tasks[currentUser][nextColumn].push(task); // Adiciona a tarefa à próxima coluna
        renderTasks(); // Atualiza a exibição das tarefas
    };

    // Inicializa o quadro de Kanban
    renderTasks();
});
