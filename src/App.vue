<template>
  <div id="app">
    <header>
      <h1>Meu agregador de notícias</h1>
      <input v-if="!loading" v-model="url" placeholder="Url do feed" @keyup="search" :readonly="loading"/>
      <input v-else readonly placeholder="Carregando...">
    </header>

    <main v-for="(feed, key) in feeds" :key="key">
      <feed-card :feed="feed" :key="key" @remove="remove" />
    </main>
  </div>
</template>

<script>
import Noticias from './externos/noticias'
import FeedCard from './componentes/FeedCard.vue'

export default {
  name: 'app',
  components: { FeedCard },
  data: () => ({
    url: 'blog.caelum.com.br/feed',
    feeds: [],
    loading: false
  }),
  mounted() {
    
    const urls = this.$store.getters.getUrls
    for (let url of urls) {
      this.loading = true
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
  methods: {
    search(e) {
      if(e.keyCode == 13)
        this.registrarFeed()
    },
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
    remove(id) {
      this.$store.commit('REMOVE_URL', id)
      this.feeds.splice(id, 1)
    }
  },
  computed: {
    urlFormatada() {
      if(!this.url.includes('https://') && !this.url.includes('http://'))
        return `https://${this.url}`
      return this.url
    }
  },
  filters: {
    cortar(valor, maximo) {
      if(valor.length > maximo)
        return valor.substring(maximo, -1) + '...'
      return valor
    }
  }
}
</script>

<style>
  body {
    font-family: 'Roboto', sans-serif;
    margin: 0px;
    padding: 0px 10px;
  }

  div > header {
    padding: 10px 5px;
    text-align: center;
  }

  div > header > h1 {
    letter-spacing: 3px;
    font-size: 14pt;
  }

  div > header > input {
    width: 60%;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    border-style: none;
    border: 1px solid #41B883;
    text-align: center;
    color: #35495E;
    font-weight: bold;
  }

  a {
    text-decoration: none;
    color: #727F80;
  }
</style>
