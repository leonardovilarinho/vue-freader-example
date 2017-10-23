import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import App from './App.vue'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    urls: []
  },
  mutations: {
    'ADD_URL': function(state, url) {
      const id = state.urls.indexOf(url)
      if(id < 0)
        state.urls.unshift(url)
    },
    'REMOVE_URL': function (state, id) {
      state.urls.splice(id, 1)
    }
  },
  getters: {
    getUrls(state) {
      return state.urls
    }
  },
  plugins: [createPersistedState()]
})

new Vue({
  el: '#app',
  render: h => h(App),
  store: store
})
