<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" style="width: 100%;"
        filterable clearable default-first-option>
        <el-option v-for="item of pstatusOptions" :label="item.name" :value="item.id" :key="item.id">
        </el-option>
    </el-select>
</template>

<script>
    import { pstatus } from '@/api/qms'
    export default {
        name: 'pstatus',
        data() {
            return {
                pstatusOptions: []
            }
        },
        props: {
            value: String | Number,
            isDef: {
                type: Boolean,
                default: false,
            },
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
        },
        mounted() {
            // 项目状态接口
            pstatus()
                .then((res) => {
                    if (res && res.status * 1 === 0) {
                        let data = res.data || [];
                        data.unshift({ name: '全部', id: '' })
                        this.pstatusOptions = data;
                        if (this.isDef) return
                        this.$emit('input', this.pstatusOptions[1].id)
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