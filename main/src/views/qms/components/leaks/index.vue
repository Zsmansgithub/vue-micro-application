<template>
    <div>
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedLeaks">
            <div v-for="(leak,index) in leaks" :key="`${leak}${index}`">
                <el-checkbox :label="leak">
                    <span class="all_label"> {{ leak.leakType }}-{{leak.leakDesc}}</span>
                </el-checkbox>
            </div>
        </el-checkbox-group>
        <div class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="updateLeak">确 定</el-button>
        </div>
    </div>
</template>
<script>
    import { leaksSearch, updateLeak, updateLeaks } from '@/api/qms'
    export default {
        props: {
            row: Object,
            leaks: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            checkAll: {
                get({ checkedLeaks, leaks }) {
                    return checkedLeaks.length === leaks.length
                },
                set(val) {
                    this.checkedLeaks = val;
                }
            },
            isIndeterminate({ checkedLeaks, leaks }) {
                return Boolean(checkedLeaks.length && checkedLeaks.length < leaks.length)
            }
        },
        data() {
            return {
                checkedLeaks: [],
            }
        },
        methods: {
            // 漏洞更新
            updateLeak() {
                const { ID } = this.row;
                debugger
                updateLeak(ID, {
                    effectiveVulne: this.checkedLeaks.length
                }).then(res => {
                    if (res && res.status * 1 == 0) {
                        updateLeaks(this.checkedLeaks).then(res => {
                            if (res && res.status * 1 == 0) {
                                this.$message.success('漏洞更新成功');
                                this.$emit('updated')
                            }
                        });
                    }
                });
            },
            //   安全漏洞全选
            handleCheckAllChange(val) {
                this.checkedLeaks = val ? this.leaks : [];
            },
            close() {
                this.$emit('closeLeaks')
            }
        }
    }
</script>
<style lang="scss" scoped>
    .dialog-footer {
        padding: 20px;
        padding-bottom: 0;
        text-align: right;
    }

    .all_label {
        display: inline-grid;
        white-space: pre-line;
        word-wrap: break-word;
        overflow: hidden;
        line-height: 20px;
    }
</style>