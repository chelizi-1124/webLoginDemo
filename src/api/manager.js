import axios from "@/request/axios";

/**
 * 
 * @returns 获取验证码
 */

export function getCodeImg() {
    return axios.get("/code")
}

/**
 * 管理员登录
 * @param {*} userId 
 * @param {*} password 
 * @param {*} type 
 * @returns 
 */
export function adminLogin(userId, password, type, code, uuid) {
    return axios.post("/admin/user/login", {
        userId,
        password,
        type,
        code,
        uuid
    })
}

/**
 * 
 * @returns 查找用户信息
 */
export function getAdminInfo() {
    return axios.get("/admin/user")
}

