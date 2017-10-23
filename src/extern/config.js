import axios from 'axios'

export const http = axios.create({
    baseURL: 'http://localhost/rss.php',
    timeout: 10000
})