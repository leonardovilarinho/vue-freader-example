<template>
  <section>
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
  </section>
</template>

<script>
    export default {
        name: 'FeedCard',
        props: {
            feed: {
                required: true,
                type: Object,
                default: {}
            },
            key: {
                required: true,
                type: Number
            }
        },
        methods:{
            remove(key) {
                this.$emit('remove', key)
            }
        }
    }
</script>

<style>
  section {
    margin: 0px 30px 15px 30px;
    border-radius: 4px;
    border: 1px solid #35495E;
  }

  section > header {
    padding: 5px;
    margin: 0px;
    text-align: center;
    background-color: #41B883;
  }

  section > header > nav:first-child {
    float: right;
  }

  section > header > nav > h1 {
    margin: 0px;
    letter-spacing: 2px;
    font-size: 15pt;
  }

  section > header > nav > h1 > a {
    color: #fff;
  }

  section > header > nav > small {
    color: #F6F6F6;
    letter-spacing: 1px;
  }

  section > header > nav > button {
    padding: 4px;
    border-radius: 4px;
    border: 1px solid #35495E;
    color: #35495E;
    background-color: transparent;
  }

  section > header > nav > button:hover, section > header > nav > button:target {
    color: #fff;
    background-color: #35495E;
  }

  section > section  {
    margin: 0px;
    list-style: none;
  }

  section > section > article {
    padding: 5px 20px;
    margin: 0px;
    border-bottom: 1px solid #000;
  }

  section > section > article > h2 {
    text-align: center;
    margin: 0px;
    font-size: 12pt;
    letter-spacing: 1px;
  }

  section > section > article > h2 > a {
    color: #35495E;
  }

  section > section > article > div {
    font-size: 10pt;
  }

  section > small {
    text-align: center;
  }
</style>
