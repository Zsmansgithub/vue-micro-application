<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" style="width: 100%;"
        filterable clearable default-first-option>
        <el-option label="全部" :value="undefined"></el-option>
        <el-option label="A" value="A"></el-option>
        <el-option label="B" value="B"></el-option>
        <el-option label="C" value="C"></el-option>
        <el-option label="D" value="D"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: 'applevel',
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