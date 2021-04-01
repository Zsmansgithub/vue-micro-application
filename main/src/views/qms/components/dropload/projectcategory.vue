<template>
    <el-select v-model="val" v-bind="$attrs" v-on="$listeners" :popper-class="'projectcategory-sel-option'"
        :loading="loading" :remote="true" :remote-method="getList" value-key="project_num" :placeholder="placeholder"
        style="width: 100%;" filterable clearable default-first-option>
        <el-option v-for="item of projlistOptions" :label="`${item.project_num}_${item.project_name}`" :value="item"
            :key="`${item.project_num}_${item.project_name}`">
        </el-option>
    </el-select>
</template>

<script>
    import { projlist } from '@/api/qms'
    export default {
        name: 'projlist_select',
        props: {
            value: Object | String,
            placeholder: {
                type: String,
                default: '请选择'
            },
            required: true
        },
        data() {
            return {
                projlistOptions: [],
                loading: false
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
            this.getList();
        },
        methods: {
            getList(query) {
                // 项目下拉接口
                this.loading = true;
                projlist({ pageSize: 1000, pageNum: 1, project_category: '', project_name: query })
                    .then((res) => {
                        this.loading = false;
                        if (res && res.status * 1 === 0) {
                            this.projlistOptions = res.data.results || [];
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
<style>
    .projectcategory-sel-option {
        max-width: 600px;
    }
</style>