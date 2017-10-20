import Vue from 'vue'
// import VueRouter from 'vue-router'

import App from './App.vue'
// import Painel from './componentes/Painel.vue'
// import ProdutoLista from './componentes/ProdutoLista.vue'
// import ProdutoNovo from './componentes/ProdutoNovo.vue'

// Vue.use(VueRouter)

// const router = new VueRouter({
//   routes: [
//     { path: '/', component: Painel },
//     {
//       path: '/produtos',
//       component: ProdutoLista,
//       children: [
//         { path: 'novo', component: ProdutoNovo }
//       ]
//     },
//   ]
// })

new Vue({
  el: '#app',
  render: h => h(App),
  // router: router
})
