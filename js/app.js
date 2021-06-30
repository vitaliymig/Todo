// const todo = {
//     id: 1,
//     title: 'Title todo 1',
//     text: 'Text todo 1',
//     completed: false,
//     createdAt: 1664546546,
//     completedAt: null
// }

if (!localStorage.todos) {
    localStorage.todos = JSON.stringify([])
}

const todoListEl = document.getElementById('todoList')
const addTodoFormEl = document.getElementById('addTodoForm')

renderTodoList(todoListEl, todosActions({ type: 'GET' }))

addTodoFormEl.addEventListener('submit', event => {
    event.preventDefault()
    const { title, text } = event.target
    todosActions({ type: 'ADD', payload: { title: title.value, text: text.value } })
    event.target.reset()
})

todoListEl.addEventListener('click', e => {
    const todoRemoveBtn = e.target.closest('.todo-remove')
    if (todoRemoveBtn) {
        const currentTodoEl = todoRemoveBtn.closest('.todo')
        const currentTodoId = +currentTodoEl.dataset.id
        todosActions({ type: 'DELETE', payload: currentTodoId })
    }
})

todoListEl.addEventListener('dblclick', e => {
    const currentTodoEl = e.target.closest('.todo')
    if (currentTodoEl) {
        const currentTodoId = +currentTodoEl.dataset.id
        todosActions({ type: 'UPDATE_STATUS', payload: currentTodoId })
    }
})

function todosActions(action) {
    const todos = JSON.parse(localStorage.todos)
    switch (action.type) {
        case 'GET': {
            return todos
        }
        case 'ADD': {
            todos.push(new Todo(todos, action.payload.title, action.payload.text))
            break;
        }
        case 'DELETE': {
            const currentTodoIdx = todos.findIndex(todo => todo.id === action.payload)
            todos.splice(currentTodoIdx, 1)
            break;
        }
        case 'UPDATE_STATUS': {
            const currentTodo = todos.find(todo => todo.id === action.payload)
            const currentStatus = currentTodo.status
            if (currentStatus !== 3) {
                currentTodo.status = currentStatus + 1
                currentTodo.updatedAt = Date.now()
            }
            break;
        }
        default:
            throw new Error(`Unknown action.type! (" ${action.type} ")`)
    }
    if (action.type !== 'GET') {
        renderTodoList(todoListEl, todos)
        localStorage.todos = JSON.stringify(todos)
    }
}

// function getNewTodoStatus(currentStatus) {
//     switch (currentStatus) {
//         case 1:
//             return 2
//         case 2:
//             return 3
//         case 3:
//             return 3
//         default:
//             throw new Error(`Unknown currentStatus! (" ${currentStatus} ")`)
//     }
// }

function determineTodoStatus(statusTermin) {
    switch (statusTermin) {
        case 1:
            return 'new'
        case 2:
            return 'process'
        case 3:
            return 'complete'
        default:
            throw new Error(`Unknown statusTermin! (" ${statusTermin} ")`)
    }
}

function Todo(todos, title, text) {
    const maxId = Math.max(...todos.map(todo => todo.id))
    const newId = (maxId < 0) ? 1 : maxId + 1
    this.id = newId
    this.title = title
    this.text = text
    this.status = 1
    this.createdAt = Date.now()
    this.updatedAt = null
}

function renderTodoList(todoListEl, todos) {
    todoListEl.innerHTML = createTodoListHTML(todos).join(``)
}

function createTodoListHTML(todos) {
    todos.sort((a, b) => a.status - b.status || b.updatedAt - a.updatedAt || b.createdAt - a.createdAt)
    return todos.map(todo => createTodoHTML(todo))
}

function createTodoHTML(todo) {
    return `<div class="todo ${determineTodoStatus(todo.status)}" data-id="${todo.id}">
    <button class="todo-remove">&#10060;</button>
    <h2>${todo.title}</h2>
    <h3>${todo.text}</h3>
    <h4>${determineTodoStatus(todo.status)}</h4>
    <div>
      <small>${new Date(todo.createdAt).toLocaleTimeString()}</small>
      <small>${todo.updatedAt ? new Date(todo.updatedAt).toLocaleTimeString() : ''}</small>
    </div>
  </div>`
}
















































// [{
//     id: 1,
//     title: 'Title todo 1',
//     text: 'Text todo 1',
//     completed: false,
//     createdAt: Date.now(),
//     completedAt: null
// },{
//     id: 2,
//     title: 'Title todo 2',
//     text: 'Text todo 2',
//     completed: false,
//     createdAt: Date.now() + 80000,
//     completedAt: null
// },{
//     id: 3,
//     title: 'Title todo 3',
//     text: 'Text todo 3',
//     completed: true,
//     createdAt: Date.now() + 100000,
//     completedAt: Date.now() + 120000
// },{
//     id: 4,
//     title: 'Title todo 4',
//     text: 'Text todo 4',
//     completed: false,
//     createdAt: Date.now() + 150000,
//     completedAt: null
// }]