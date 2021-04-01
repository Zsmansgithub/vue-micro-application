<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" style="width: 100%;"
        filterable clearable default-first-option>
        <el-option v-for="item of productOptions" :label="item.project_cname" :value="item.id" :key="item.id">
        </el-option>
    </el-select>
</template>

<script>
    import { seachProduct } from '@/api/qms'
    export default {
        name: 'product',
        data() {
            return {
                productOptions: []
            }
        },
        props: {
            value: String | Number,
            placeholder: {
                type: String,
                default: '请选择'
            },
            projectteamid: {
                type: Number | String,
                default: ''
            },
            required: true
        },
        watch: {
            projectteamid() {
                this.getOptions()
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
            this.getOptions()
        },
        methods: {
            getOptions() {
                // 产品下拉接口
                seachProduct({ product_name: '', projectteamid: this.projectteamid })
                    .then((res) => {
                        if (res && res.status * 1 === 1) {
                            this.productOptions = res.data || [];
                        } else {
                            this.$message.error(res.message || '出错了')
                        }
                    })
                    .catch((e) => {
                        console.error(e)
                    })
            }
        }
    }
</script>