import { http, parametros } from './config'

export default {
    adicionarFeed(url) {
        return http.get('?feedURL=' + url)
    }
}