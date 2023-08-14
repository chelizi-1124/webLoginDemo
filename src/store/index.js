import { createStore } from 'vuex'
import { getAdminInfo } from "@/api/manager.js"
const store = createStore({

    state() {
        return {
            //用户信息
            admin: {}
        }
    }, mutations: {
        //记录用户信息
        SET_ADMININFO(state, admin) {
            state.admin = admin
        }
    },
    actions: {
        //获取当前登录用户信息
        getInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getAdminInfo().then(res => {
                    commit('SET_ADMININFO', res)
                    resolve(res)
                }).catch(err => reject(err))
            })

        }
    }

})


export default store