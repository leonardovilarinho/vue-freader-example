export default {
    // filtros de dados
  filters: {
    // corta uma string no tamanho indicado como parametro
    crop(value, max) {
      if(value.length > max)
        return value.substring(max, -1) + '...'
      return value
    }
  }
}