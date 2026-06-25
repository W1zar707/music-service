import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:80',
    withCredentials:true
})

let isRefreshing = false

api.interceptors.response.use(
    response => response,
    async error => {
        if(error.response?.status===403||error.response?.status===401){
            if(isRefreshing) return Promise.reject(error)
            isRefreshing = true
            try {
                await api.post('token/refresh')
                isRefreshing = false
                return api(error.config)
            } catch {
                isRefreshing = false
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    } 
)

export default api