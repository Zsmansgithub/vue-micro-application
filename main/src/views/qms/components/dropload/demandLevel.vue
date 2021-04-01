<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" style="width: 100%;"
        filterable clearable default-first-option>
        <el-option v-for="item of demandLevelOptions" :label="item.name" :value="item.id" :key="item.id">
        </el-option>
    </el-select>
</template>

<script>
    import { demandLevel } from '@/api/qms'
    export default {
        name: 'demandLevel',
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
                demandLevelOptions: []
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
            demandLevel()
                .then((res) => {
                    if (res && res.status * 1 === 0) {
                        let data = res.data || [];
                        data.unshift({ name: '全部', id: '' })
                        this.demandLevelOptions = data;
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