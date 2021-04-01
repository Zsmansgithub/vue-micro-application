<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" style="width: 100%;"
        filterable clearable default-first-option>
        <el-option v-for="item in userOptions" :key="item.id" :label="'('+item.username+')'+item.first_name"
            :value="item.username"></el-option>
    </el-select>
</template>

<script>
    import { fetchAuthUser } from '@/api/manage_monitor/manage'
    export default {
        name: 'development_select',
        props: {
            value: String | Number,
            placeholder: {
                type: String,
                default: '请选择'
            },
            required: true
        },
        data() {
            return {
                userOptions: []
            }
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
        },
        mounted() {
            // 开发组下拉接口
            fetchAuthUser()
                .then((res) => {
                    if (res && res instanceof Array) {
                        this.userOptions = res || [];
                    } else {
                        this.$message.error('出错了')
                    }
                })
                .catch((e) => {
                    console.error(e)
                })
        }
    }
</script>