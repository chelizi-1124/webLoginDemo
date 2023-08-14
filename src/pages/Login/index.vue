<template>
    <el-row class="login">
        <el-col :lg="14" :md="12" class="flex">
            <div>
                <div class="mb-4">
                    <img src="https://www.luas.edu.cn/_upload/site/00/02/2/logo.png" alt="">
                </div>
                <div class="leftText">
                    宿 舍 管 理 系 统
                </div>
            </div>
        </el-col>
        <el-col :lg="10" :md="12" class="flex bg-light-50">
            <div class="text-center">
                <h2 class="h2">欢迎回来</h2>
                <div class="flex my-5 to-gray-300 space-x-2">
                    <span class="line"></span>
                    <span>账号密码登录</span>
                    <span class="line"></span>
                </div>
                <div>
                    <el-form :model="form" :rules="rules" ref="formRef" class="w-[250px]">
                        <el-form-item prop="userId">
                            <el-input v-model.number="form.userId" placeholder="请输入学号/职工号">
                                <template #prefix>
                                    <el-icon>
                                        <User />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
                                <template #prefix>
                                    <el-icon>
                                        <Lock />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="type">
                            <el-select style="width: 100%;" v-model="form.type" placeholder="请选择您的身份">
                                <template #prefix>
                                    <el-icon>
                                        <Postcard />
                                    </el-icon>
                                </template>
                                <el-option label="学生" value="学生" />
                                <el-option label="宿舍管理员" value="宿舍管理员" />
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="code">
                            <el-input style="width: 55%;" v-model="form.code" placeholder="请输入验证码">
                                <template #prefix>
                                    <el-icon>
                                        <ChatRound />
                                    </el-icon>
                                </template>
                            </el-input>
                            <div class="inline">
                                <img :src="codeUrl" @click="getCode">
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button round color="#164E63" class="w-[250px]" type="primary" @click="onSubmit"
                                :loading="loading">登录</el-button>
                        </el-form-item>

                    </el-form>
                </div>

            </div>
        </el-col>
    </el-row>
</template>

<script setup>
import { ref, reactive, onMounted,onBeforeUnmount } from 'vue'
import { adminLogin, getCodeImg } from "@/api/manager.js"
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'


const router = useRouter()

const form = reactive({
    userId: 12207405136,
    password: '123456',
    type: '',
    code: '',
    uuid: '',
})

const rules = ({
    userId: [
        { required: true, message: '请输入学号/职工号', trigger: 'blur' },
        { pattern: /^\d{11}$/, message: '长度必须是11位之间', trigger: 'blur' },
        { type: 'number', message: '必须为数字' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度必须在6~15位之间', trigger: 'blur' },
    ],
    type: [
        {
            required: true,
            message: '请选择您的登录身份',
            trigger: 'change',
        },
    ],
    code: [
        {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
        }
    ]

})
const codeUrl = ref('');
const getCode = () => {
    getCodeImg().then((res) => {
        codeUrl.value = res.img;
        form.uuid = res.uuid;
    });
};
onMounted(() => {
    // 获取验证码
    getCode();
});
const formRef = ref(null)
const loading = ref(false)
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            loading.value = true;
            adminLogin(form.userId, form.password, form.type, form.code, form.uuid)
                .then((res) => {
                    //提示成功
                    ElNotification({
                        message: '登录成功',
                        type: 'success',
                        duration: 3000,
                    })
                    //存储cookie和用户相关信息
                    const cookie = useCookies()
                    cookie.set('token', res.token) 
                    router.push('/')
                }).finally(() => {
                    loading.value = false
                })
        } else {
            return false
        }
    })
}

//监听回车事件
function onKeyUp(e){
    if(e.keyCode == 13){
        onSubmit();
    }
}

//添加监听键盘事件
onMounted(() => {
    document.addEventListener('keyup', onKeyUp)
    
})
//移除键盘监听
onBeforeUnmount(() => {
    document.removeEventListener('keyup', onKeyUp)
})


</script>

<style  scoped>
.login {
    @apply min-h-screen bg-cyan-900
}

.flex {
    @apply flex items-center justify-center
}

.leftText {
    @apply font-bold text-4xl text-light-50 text-center;
}

.h2 {
    @apply font-bold text-3xl text-cyan-900;
}

.line {
    @apply h-[1px] w-16 bg-gray-200;
}
</style>