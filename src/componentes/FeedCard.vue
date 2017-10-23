<template>
  <section>
      <header>
        <nav>
            <!-- Botão para remover o item -->
            <button @click="remove(key)">Remover</button>
        </nav>

        <nav>
            <!-- titulo do site e link para ir para o mesmo -->
            <h1>
                <a :href="feed.url" target="_blank">
                    {{ feed.title | cortar(50) }}
                </a>
            </h1>
            <!-- descrição do site -->
            <small>{{ feed.description }}</small>
        </nav>
      </header>

      <section>
          <!-- Percorre os 5 primeiros posts daquele site -->
        <article v-for="item in feed.items" :key="item.created">
            <h2>
                <!-- Mostra titulo da postagem -->
                <a :href="item.url" target="_blank">
                    {{ item.title | cortar(50) }}
                </a>
            </h2>
            <!-- Mostra resumo da postagem em html -->
            <div v-html="item.description"></div>
        </article>
      </section>
  </section>
</template>

<script>
    export default {
        name: 'FeedCard',
        // propriedades extrenar, parametros que devemos receber para montar esse componente
        props: {
            // objeto do site, contem informações do site e a lista de noticias do mesmo
            feed: {
                required: true,
                type: Object,
                default: {}
            },
            // chave do vuex
            key: {
                required: true,
                type: Number
            }
        },
        methods:{
            // metodo remove emite uma notificação para remover um item, passando key como parametro
            remove(key) {
                this.$emit('removeNotify', key)
            }
        }
    }
</script>