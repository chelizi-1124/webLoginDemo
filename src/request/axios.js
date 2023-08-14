import axios from "axios"
import { ElNotification } from 'element-plus'
import { useCookies } from '@vueuse/integrations/useCookies'
import router from '@/router/index.js'


const service = axios.create({
    baseURL: "/api"
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    //往header头自动添加token
    const cookie = useCookies()
    const token = cookie.get('token')
    if (token) {
        config.headers["token"] = token
    }
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    ElNotification({
        title: 'Error',
        message: error.response.data.msg,
        type: 'error',
        duration: 3000,
    })
    setTimeout(() => {
        if (error.response.data.msg == "登录过期,请重新登录!") {
          router.push('/login');
        }
      }, 1000);
    return Promise.reject(error);
});

export default service