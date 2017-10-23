<template>
  <div id="app">
    <!-- Cabeçalho com o campo para cadastrar um novo site de noticias, caso o componente não 
    esteja carregando, é mostrado o campo de pesquisa, caso não, é necessário exibir o estado carregando -->
    <header>
      <h1>Meu agregador de notícias</h1>
      <input v-if="!loading" v-model="url" placeholder="Url do feed" @keyup="search" :readonly="loading"/>
      <input v-else readonly placeholder="Carregando...">
    </header>

    <!-- Percorre a lista de noticias pegas da internet e imprime elas na tela -->
    <main v-for="(feed, key) in feeds" :key="key">
      <!-- Cria um componente para exibir o cartão de noticias de um site, o remove irá emitir uma notificação para
      o remove daqui -->
      <feed-card :feed="feed" :key="key" @removeNotify="remove" />
    </main>
  </div>
</template>

<script>
import Noticias from './externos/noticias'
import FeedCard from './componentes/FeedCard.vue'

export default {
  name: 'app',
  // Registra componente para poder usa-lo aqui
  components: { FeedCard },
  // Declara variáveis
  data: () => ({
    // URL padrão, que será o valor do campo de pesqusa
    url: 'blog.caelum.com.br/feed',
    // lista de noticias encontradas
    feeds: [],
    // status de carregamento do site
    loading: false
  }),

  // Método construtor da aplciação
  mounted() {
    // Pega as urls da loja do vuex
    const urls = this.$store.getters.getUrls
    // Percorre urls encontradas
    for (let url of urls) {
      this.loading = true
      // Pega a noticia do site atual para exibir na tela
      Noticias.adicionarFeed(url).then(resultado => {
        let feed = resultado.data
        feed.title = feed.title == '' ? url : feed.title
        feed.description = feed.description == '' ? '...' : feed.description
        feed.items = resultado.data.items.splice(0, 5)
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
        this.registrarFeed()
    },
    //seta carregando, verifica se o feed ja foi registrado, se não ele busca na internet, adiciona
    //seu url na loja do Vuex e coloca ele na tela, com as noticias pegas
    registrarFeed() {
      this.loading = true

      if(this.$store.getters.getUrls.indexOf(this.urlFormatada) < 0) {
         Noticias.adicionarFeed(this.urlFormatada).then(resultado => {
          this.$store.commit('ADD_URL', this.urlFormatada)
          let feed = resultado.data
          feed.title = feed.title == '' ? this.url : feed.title
          feed.description = feed.description == '' ? '...' : feed.description
          feed.items = resultado.data.items.splice(0, 5)
          this.feeds.unshift(feed)
          this.loading = false
        }).catch(erro => {
          this.loading = false
          const oldurl = this.url
          this.url = 'Fonte de notícia invalida.'
          setTimeout(() => this.url = oldurl, 1300)
        })
      }
      else {
        this.loading = false
        const oldurl = this.url
        this.url = 'Fonte já cadastrada.'
        setTimeout(() => this.url = oldurl, 1300)
      }
    },
    // Remove um site da tela
    remove(id) {
      this.$store.commit('REMOVE_URL', id)
      this.feeds.splice(id, 1)
    }
  },
  // Armazena propriedades computadas
  computed: {
    // adiciona https:// na url digitado, caso não haja o protocolo explicito
    urlFormatada() {
      if(!this.url.includes('https://') && !this.url.includes('http://'))
        return `https://${this.url}`
      return this.url
    }
  },
  // filtros de dados
  filters: {
    // corta uma string no tamanho indicado como parametro
    cortar(valor, maximo) {
      if(valor.length > maximo)
        return valor.substring(maximo, -1) + '...'
      return valor
    }
  }
}
</script>