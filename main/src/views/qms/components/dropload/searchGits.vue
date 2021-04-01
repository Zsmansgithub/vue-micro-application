<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" style="width: 100%;"
        filterable clearable default-first-option>
        <el-option v-for="item of gitOptions" :label="item.name" :value="item.id" :key="item.id">
        </el-option>
    </el-select>
</template>

<script>
    import { searchGits } from '@/api/qms'
    export default {
        name: 'searchGits',
        data() {
            return {
                gitOptions: []
            }
        },
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
        },
        mounted() {
            // 仓库下拉接口
            searchGits({ product_id: '', projectteam_id: '' })
                .then((res) => {
                    if (res && res.status * 1 === 1) {
                        try {
                            this.gitOptions = res.data.results || [];
                        } catch (e) {
                            this.gitOptions = [];
                            console.error(e)
                            this.$message.error('出错了');

                        }
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