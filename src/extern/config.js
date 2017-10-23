import axios from 'axios'

export const http = axios.create({
    baseURL: 'http://iftmvue.azurewebsites.net',
    timeout: 10000
})
