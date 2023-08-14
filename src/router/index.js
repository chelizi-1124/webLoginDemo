import {
    createRouter,
    createWebHistory
} from "vue-router"

import { useCookies } from '@vueuse/integrations/useCookies'
import { ElNotification } from 'element-plus'
import store from "../store"

import Home from '@/pages/Home/index.vue'
import About from '@/pages/About/index.vue'
import NotFound from '@/pages/404.vue'
import Login from '@/pages/Login/index.vue'


const routes = [
    {
        path: "/",
        component: Home
    }, {
        path: "/about",
        component: About
    }, {
        path: "/login",
        component: Login
    }, {
        path: '/:pathMatch(.*)*',      // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
        name: 'NotFound',
        component: NotFound
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

//全局前置守卫
router.beforeEach(async(to, from, next) => {

    //获取token
    const cookie = useCookies()
    const token = cookie.get('token')

    //如果没有登录，强制返回登录
    if (!token && to.path != '/login') {
        ElNotification({
            message: '请先登录',
            type: 'error',
            duration: 3000,
        })
        return next({ path: '/login' })
    }

    //防止重复登录
    if (token && to.path == '/login') {
        ElNotification({
            message: '您已登陆，勿重复登录',
            type: 'warning',
            duration: 3000,
        })
        return next({ path: from.path ? from.path : '/' })
    }
    //如果用户登陆了，自动获取用户信息，并存储在vuex当中
    if(token){
        await store.dispatch("getInfo")
    }
    next()
})

export default router