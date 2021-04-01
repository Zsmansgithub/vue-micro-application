<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" style="width: 100%;"
        filterable clearable default-first-option>
        <el-option label="全部" value=""></el-option>
        <el-option label="测试中" value="1"></el-option>
        <el-option label="测试完成" value="2"></el-option>
        <el-option label="已上线" value="3"></el-option>
        <el-option label="打回开发" value="4"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: 'TestStatus',
        props: {
            value: String | Number,
            placeholder: {
                type: String,
                default: '请选择'
            },
            required: true
        },
        computed: {
            val: {
                get() {
                    return this.value
                },
                set(v) {
                    this.$emit('input', v)
                }
            }
        }
    }
</script>