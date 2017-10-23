import Vue from 'vue'

/**
 * Importando o Vuex e um plugin do mesmo.
 * 
 * Vuex: gerenciador de estado, permite criar uma loja de variáveis, essas variáveis podem ser acessadas
 * de qualquer lugar da aplicação usando this.$store.
 * 
 * createPersistedState: plugin do vuex que grava os dados do Vuex no navegador, assim mesmo se o usuário
 * desligar o PC ele terá acesso aos dados salvos nos próximos acessos.
 */
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import App from './App.vue'

// Dizendo a Vue que ele deve usar o Vuex
Vue.use(Vuex)

// Criando uma instância da loja do Vuex, onde iremos armazenar os dados
const store = new Vuex.Store({
  // State armazena e declara os dados padrões da loja, no caso um array de urls do feed
  state: {
    querys: []
  },
  /**
   * Mutations são métodos que podem alterar o valor do state da loja
   */
  mutations: {
    /**
     * Adiciona uma url defeed na nossa loja
     */
    'ADD_QUERY': function(state, query) {
      const id = state.querys.indexOf(query.toLowerCase())
      if(id < 0)
        state.querys.unshift(query.toLowerCase())
    },
    /**
     * Remove um URL de feed da nossa loja
     */
    'REMOVE_QUERY': function (state, id) {
      state.querys.splice(id, 1)
    }
  },
  /**
   * Getters são usados para recuperar os dados daloja do Vuex
   */
  getters: {
    /**
     * Método recupera o array de urls da loja
     */
    getQuerys(state) {
      return state.querys
    }
  },
  // Registra o plugin para salvar o array de urls no navegador
  plugins: [createPersistedState()]
})

// Inicia nossa aplicação Vue
new Vue({
  el: '#app', // indica em qual elemento do arquivo index.html iremos montar a aplicação
  render: h => h(App), // define App como tela padrão da aplicação
  store: store // registra a loja de dados na aplicação
})
