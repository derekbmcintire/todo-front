// EventEmitter is included in JS so Node has access to it without
// installing anything!
import { EventEmitter } from 'events'
import dispatcher from '../dispatcher'

class ListStore extends EventEmitter {
  constructor() {
    super()
    this.lists = []
    }

    getLists(data) {
      this.lists = data
      this.emit('change')
    }

    getAll() {
      return this.lists
    }

    handleActions(action) {
    if (action.type === 'GET_LISTS') {
      this.getLists(action.data)
    }
    }
}

const listStore = new ListStore()

// registers this file as a listener on the dispatcher
// binds 'this' within the handleActions function to todoStore
dispatcher.register(listStore.handleActions.bind(listStore))
export default listStore