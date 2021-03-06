// EventEmitter is included in JS so Node has access to it without
// installing anything!
import { EventEmitter } from 'events'
import dispatcher from '../dispatcher'

// this is storing data for the todo list
class TodoStore extends EventEmitter {
  // set initial state
  constructor() {
    super()
    this.todos = []
    this.title = 'To Do List'
    this.update = false
    }

    completeItem(id) {
      this.todos.forEach((todo) => {
        if (todo.id === id) {
          todo.complete ? todo.complete = false : todo.complete = true
        }
      })
      this.emit('change')
    }

    deleteItem(id) {
      this.todos = this.todos.filter((todo) => {
        return (todo.id !== id)
      })
      this.emit('change')
    }

    // create a new todo
    createToDo(text) {
      // creates a timestamp to use as an id
      const id = Date.now()

      // pushes the current todo into this.todos
      this.todos.push({
        id,
        text,
        complete: false
      })

      // sends a change notice to the event listener
      this.emit('change')
    }

    populateList(list) {
      this.todos = list
      this.update = true
      this.emit('change')
    }

    clearList() {
      this.todos = []
      this.title = 'To Do List'
      this.update = false
      this.emit('change')
    }

    moveUp(item, index) {
      const array = this.todos
      const newIndex = (index === 0) ? array.length : (index - 1)
      array.splice(index, 1)
      array.splice(newIndex, 0, item)
      this.emit('change')
    }

    // returns all todos
    getAll() {
      return this.todos
    }

    // dispatcher will send EVERY action that happens in the app to
    // EVERY listener, so this will handle the events and only
    // react to the ones I want it to
    handleActions(action) {
    if (action.type === 'CREATE_TODO') {
      this.createToDo(action.text)
    }
    if (action.type === 'COMPLETE_ITEM') {
      this.completeItem(action.id)
    }
    if (action.type === 'DELETE_ITEM') {
      this.deleteItem(action.id)
    }
    if (action.type === 'SIGN_OUT') {
      this.clearList()
    }
    if (action.type === 'CLEAR_LIST') {
      this.clearList()
    }
    if (action.type === 'DELETE_LIST') {
      this.clearList()
    }
    if (action.type === 'POPULATE_LIST') {
      this.populateList(action.data)
      this.title = action.title
      this.id = action.id
    }
    if (action.type === 'MOVE_UP') {
      this.moveUp(action.item, action.index)
    }
    }
}

// creates a new instance of the TodoStore
const todoStore = new TodoStore()

// registers this file as a listener on the dispatcher
// binds 'this' within the handleActions function to todoStore
dispatcher.register(todoStore.handleActions.bind(todoStore))
window.todoStore = todoStore
export default todoStore
