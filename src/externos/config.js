import axios from 'axios'

export const http = axios.create({
    baseURL: 'https://morning-earth-19323.herokuapp.com/',
    timeout: 10000
})
