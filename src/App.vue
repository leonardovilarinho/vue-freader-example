<template>
  <div id="app">
    <!-- Cabeçalho com o campo para cadastrar um novo site de noticias, caso o componente não 
    esteja carregando, é mostrado o campo de pesquisa, caso não, é necessário exibir o estado carregando -->
    <header>
      <h1>Meu agregador de notícias ({{ countFeeds }} fontes)</h1>
      <input v-if="!loading" v-model="query" placeholder="Sobre o que quer saber?" @keyup="search" :readonly="loading"/>
      <input v-else readonly placeholder="Carregando...">
    </header>

    <!-- Percorre a lista de noticias pegas da internet e imprime elas na tela -->
    <main v-for="(feed, key) in feeds" :key="key">
      <!-- Cria um componente para exibir o cartão de noticias de um site, o remove irá emitir uma notificação para
      o remove daqui -->
      <feed-card :feed="feed" :id="key" @removeNotify="remove" />
    </main>
  </div>
</template>

<script>
import News from './extern/news'
import FeedCard from './components/FeedCard.vue'
import mixin from './components/mixin'

export default {
  name: 'app',
  mixins: [mixin],
  // Registra componente para poder usa-lo aqui
  components: { FeedCard },
  // Declara variáveis
  data: () => ({
    // URL padrão, que será o valor do campo de pesqusa
    query: 'iftm',
    // lista de noticias encontradas
    feeds: [],
    // status de carregamento do site
    loading: false
  }),

  // Método construtor da aplciação
  mounted() {
    // Pega as urls da loja do vuex
    const querys = this.$store.getters.getQuerys
    // Percorre urls encontradas
    for (let _query of querys) {
      this.loading = true
      // Pega a noticia do site atual para exibir na tela
      News.getFeed(_query).then(result => {
        let feed = result.data

        feed.title = feed.title == '' ? _query : feed.title
        feed.description = feed.description == '' ? '...' : feed.description
        feed.items = result.data.items.splice(0, 5)

        this.feeds.unshift(feed)
        this.loading = false
      }).catch(erro => {
        this.loading = false
      })
    }
  },
  // Declaração dos metodos a serem usados aqui
  methods: {
    // soregistra o feed quando o Enter for pressionado
    search(e) {
      if(e.keyCode == 13)
        this.registerFeed()
    },
    //seta carregando, verifica se o feed ja foi registrado, se não ele busca na internet, adiciona
    //seu url na loja do Vuex e coloca ele na tela, com as noticias pegas
    registerFeed() {
      this.loading = true

      if(this.$store.getters.getQuerys.indexOf(this.query.toLowerCase()) < 0) {
         News.getFeed(this.query).then(result => {

          this.$store.commit('ADD_QUERY', this.query)
          let feed = result.data

          feed.title = feed.title == '' ? this.query : feed.title
          feed.description = feed.description == '' ? '...' : feed.description
          feed.items = result.data.items.splice(0, 5)

          this.feeds.unshift(feed)
          this.loading = false
        })
      }
      else {
        this.loading = false
        const oldquery = this.query
        this.query = 'Pesquisa já cadastrada.'
        setTimeout(() => this.query = oldquery, 1300)
      }
    },
    // Remove um site da tela
    remove(id) {
      this.$store.commit('REMOVE_QUERY', id)
      this.feeds.splice(id, 1)
    }
  },
  // Armazena propriedades computadas
  computed: {
    // adiciona https:// na url digitado, caso não haja o protocolo explicito
    countFeeds() {
      return this.feeds.length
    }
  },
}
</script>