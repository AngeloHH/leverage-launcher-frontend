import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const appStore = defineStore('store', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  let url = (process.env.NODE_ENV.includes('dev'))? 'http://localhost:3000/' : '/'
  let go = (...params) => url + params.join('/')
  let notify = async (title, message) => fetch(url + `game/notification/?title=${title}&text=${message}`)
  let accounts = {}
  return { count, doubleCount, url, go, accounts, notify }
})
