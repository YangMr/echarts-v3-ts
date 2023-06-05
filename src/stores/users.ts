import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => {
    return {
      name: 'jack',
      age: 100
    }
  },
  getters: {
    getName(state) {
      return state.name + '!23'
    }
  },
  actions: {
    saveName(name: string) {
      this.name = name
    }
  }
})
