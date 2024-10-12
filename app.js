document.addEventListener("DOMContentLoaded", function () {
    // Tarefas dos usuários
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

    let isAdminLoggedIn = false; // Flag para verificar se o admin está logado

    // Função para fazer login
    window.login = function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Carrega os dados do arquivo users.json
        fetch('Data/users.json') // Certifique-se de que este caminho está correto
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar usuários: ' + response.statusText);
                }
                return response.json();
            })
            .then(users => {
                const user = users.find(u => u.username === username && u.password === password);
                if (user && user.username === 'admin') {
                    isAdminLoggedIn = true; // O admin está logado
                    document.getElementById('login-form').style.display = 'none'; // Esconde o formulário
                    document.getElementById('kanban-board').style.display = 'block'; // Mostra o Kanban
                    renderTasks(); // Renderiza as tarefas
                } else {
                    alert('Usuário ou senha inválidos');
                }
            })
            .catch(err => console.error('Erro ao carregar usuários:', err));
    };

    // Função para adicionar nova tarefa à coluna "A Fazer"
    window.addTask = function (column) {
        if (!isAdminLoggedIn) {
            alert("Somente o administrador pode adicionar tarefas.");
            return;
        }
        const task = prompt("Digite a descrição da tarefa:");
        if (task) {
            tasks.admin[column].push(task); // Adiciona a tarefa ao admin
            renderTasks();
            renderUserTasks(); // Renderiza as tarefas para o usuário também
        }
    };

    // Renderiza as tarefas em suas respectivas colunas
    function renderTasks() {
        // Limpa as colunas
        document.getElementById('todo-items').innerHTML = '';
        document.getElementById('inprogress-items').innerHTML = '';
        document.getElementById('done-items').innerHTML = '';

        // Renderiza as tarefas do admin
        const adminTasks = tasks.admin;
        adminTasks.todo.forEach((task, index) => {
            const taskDiv = createTaskDiv(task, 'todo', index);
            document.getElementById('todo-items').appendChild(taskDiv);
        });

        adminTasks.inprogress.forEach((task, index) => {
            const taskDiv = createTaskDiv(task, 'inprogress', index);
            document.getElementById('inprogress-items').appendChild(taskDiv);
        });

        adminTasks.done.forEach((task, index) => {
            const taskDiv = createTaskDiv(task, 'done', index);
            document.getElementById('done-items').appendChild(taskDiv);
        });
    }

    // Renderiza as tarefas para o usuário
    function renderUserTasks() {
        // Limpa as colunas do usuário
        document.getElementById('todo-items-user').innerHTML = '';
        document.getElementById('inprogress-items-user').innerHTML = '';
        document.getElementById('done-items-user').innerHTML = '';

        // Renderiza as tarefas do admin no quadro do usuário
        const adminTasks = tasks.admin;
        adminTasks.todo.forEach((task) => {
            const taskDiv = createTaskDiv(task, 'todo-user', -1);
            document.getElementById('todo-items-user').appendChild(taskDiv);
        });

        adminTasks.inprogress.forEach((task) => {
            const taskDiv = createTaskDiv(task, 'inprogress-user', -1);
            document.getElementById('inprogress-items-user').appendChild(taskDiv);
        });

        adminTasks.done.forEach((task) => {
            const taskDiv = createTaskDiv(task, 'done-user', -1);
            document.getElementById('done-items-user').appendChild(taskDiv);
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
        if (currentColumn.includes('todo')) {
            nextColumn = currentColumn.replace('todo', 'inprogress');
        } else if (currentColumn.includes('inprogress')) {
            nextColumn = currentColumn.replace('inprogress', 'done');
        } else if (currentColumn.includes('done')) {
            nextColumn = currentColumn.replace('done', 'todo');
        }

        const currentTasks = tasks.admin[currentColumn.replace('-user', '')];
        const task = currentTasks[index];
        currentTasks.splice(index, 1); // Remove a tarefa da coluna atual
        tasks.admin[nextColumn.replace('-user', '')].push(task); // Adiciona a tarefa à próxima coluna
        renderTasks(); // Atualiza a exibição das tarefas
        renderUserTasks(); // Atualiza a exibição das tarefas para o usuário
    };

    // Inicializa o quadro de Kanban
    renderTasks();
    renderUserTasks(); // Renderiza tarefas iniciais para o usuário
});
