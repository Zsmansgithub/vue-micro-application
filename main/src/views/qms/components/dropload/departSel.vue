<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" style="width: 100%;"
        filterable clearable default-first-option>
        <el-option v-for="item of departOptions" :label="item.departmentcname" :value="item.id" :key="item.id">
        </el-option>
    </el-select>
</template>

<script>
    import { depart } from '@/api/qms'
    export default {
        name: 'depart_select',
        props: {
            value: String | Number,
            placeholder: {
                type: String,
                default: '请选择'
            },
            required: true,
            defaultValue: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                departOptions: []
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
            // 部门下拉接口
            depart()
                .then((res) => {
                    if (res && res.status * 1 === 0) {
                        let data = res.data || [];
                        data.unshift({ departmentcname: '全部', id: '' })
                        this.departOptions = data;
                        if (this.defaultValue === 'noFirst') return;
                        this.$emit('input', this.departOptions[1].id)
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