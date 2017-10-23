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

</style>
