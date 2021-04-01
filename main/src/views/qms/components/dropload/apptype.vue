<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" style="width: 100%;"
        filterable clearable default-first-option>
        <el-option label="全部" :value="undefined"></el-option>
        <el-option label="jar" value="jar"></el-option>
        <el-option label="war" value="war"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: 'appType',
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