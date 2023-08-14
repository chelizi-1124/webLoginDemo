<template>
    <div>
        关于
        <el-button @click="addCount">{{ count }}</el-button>
        <el-button type="primary" @click="addCount2">{{ from.count }}</el-button>
    </div>
</template>

<script setup>
import {ref,reactive} from "vue"

// let count = 1;
let count = ref(true)

function addCount() {
    // count.value++
    count.value = !count.value
    console.log(count.value);
}

const from = reactive({
    count:2
})

function addCount2(){
    from.count++
}

</script>



