<template>
  <div id="app">
    <header>
      <h1>Meu agregador de notícias</h1>
      <input v-if="!loading" v-model="url" placeholder="Url do feed" @keyup="search" :readonly="loading"/>
      <input v-else readonly placeholder="Carregando...">
    </header>

    <main v-for="(feed, key) in feeds" :key="key">
      <header>
        <nav>
          <button @click="remove(key)">Remover</button>
        </nav>

        <nav>
          <h1>
            <a :href="feed.url" target="_blank">
              {{ feed.title | cortar(50) }}
            </a>
          </h1>
          <small>{{ feed.description }}</small>
        </nav>
      </header>

      <section>
        <article v-for="item in feed.items" :key="item.created">
            <h2>
              <a :href="item.url" target="_blank">
                {{ item.title | cortar(50) }}
              </a>
            </h2>
            <div v-html="item.description"></div>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
import Noticias from './externos/noticias'

export default {
  name: 'app',
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

  div > main {
    margin: 0px 30px 15px 30px;
    border-radius: 4px;
    border: 1px solid #35495E;
  }

  div > main > header {
    padding: 5px;
    margin: 0px;
    text-align: center;
    background-color: #41B883;
  }

  div > main > header > nav:first-child {
    float: right;
  }

  div > main > header > nav > h1 {
    margin: 0px;
    letter-spacing: 2px;
    font-size: 15pt;
  }

  div > main > header > nav > h1 > a {
    color: #fff;
  }

  div > main > header > nav > small {
    color: #F6F6F6;
    letter-spacing: 1px;
  }

  div > main > header > nav > button {
    padding: 4px;
    border-radius: 4px;
    border: 1px solid #35495E;
    color: #35495E;
    background-color: transparent;
  }

  div > main > header > nav > button:hover, div > main > header > nav > button:target {
    color: #fff;
    background-color: #35495E;
  }

  div > main > section  {
    margin: 0px;
    list-style: none;
  }

  div > main > section > article {
    padding: 5px 20px;
    margin: 0px;
    border-bottom: 1px solid #000;
  }

  div > main > section > article > h2 {
    text-align: center;
    margin: 0px;
    font-size: 12pt;
    letter-spacing: 1px;
  }

  div > main > section > article > h2 > a {
    color: #35495E;
  }

  div > main > section > article > div {
    font-size: 10pt;
  }

  div > main > small {
    text-align: center;
  }
</style>
