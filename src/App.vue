<template>
  <div id="app">
    <header>
      <h1>Meu agregador de notícias ({{ countFeeds }} fontes)</h1>
      <input v-if="!loading" v-model="query" placeholder="Quero notícias sobre..." @keyup="search" :readonly="loading"/>
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
              {{ feed.title | crop(50) }}
            </a>
          </h1>
          <small>{{ feed.description }}</small>
        </nav>
      </header>

      <section>
        <article v-for="item in feed.items" :key="item.created">
            <h2>
              <a :href="item.url" target="_blank">
                {{ item.title | crop(50) }}
              </a>
            </h2>
            <div v-html="item.description"></div>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
import News from './extern/news'

export default {
  name: 'app',
  data: () => ({
    query: 'iftm',
    feeds: [],
    loading: false
  }),
  methods: {
    search(e) {
      if(e.keyCode == 13)
        this.registerFeed()
    },
    registerFeed() {
      this.loading = true
      News.getFeed(this.query).then(result => {
        let feed = result.data

        feed.title = feed.title == '' ? this.url : feed.title
        feed.description = feed.description == '' ? '...' : feed.description
        feed.items = result.data.items.splice(0, 5)

        this.feeds.unshift(feed)
        this.loading = false
      })
    },
    remove(id) {
      this.feeds.splice(id, 1)
    }
  },
  computed: {
    countFeeds() {
      return this.feeds.length
    }
  },
  filters: {
    crop(value, max) {
      if(value.length > max)
        return value.substring(max, -1) + '...'
      return value
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