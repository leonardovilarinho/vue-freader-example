import { http } from './config'

export default {
    getFeed(query) {
        return http.get('?q=' + query)
    }
}