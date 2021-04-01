<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" style="width: 100%;"
        filterable clearable default-first-option>
        <el-option v-for="item of developmentteamOptions" :label="item.projectteam_cname" :value="item.id"
            :key="item.id">
        </el-option>
    </el-select>
</template>

<script>
    import { seachProject } from '@/api/qms'
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
                developmentteamOptions: []
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
            seachProject({ departmentid: '', developmentteam: '' })
                .then((res) => {
                    if (res && res.status * 1 === 1) {
                        this.developmentteamOptions = res.data || [];
                    } else {
                        this.$message.error(res.message || '出错了')
                    }
                })
                .catch((e) => {
                    console.error(e)
                })
        }
    }
</script>