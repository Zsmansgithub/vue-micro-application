<template>
    <div class="build-deploy section-layout">
        <div class="title">构建部署</div>
        <div class="add-list mg-bt-20">
            <div class="mid-title">选择构建分支</div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="product" label="仓库" align="center" width="180">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.product" disabled placeholder="空"></el-input>
                    </template>
                </el-table-column>

                <el-table-column prop="store" label="选择分支" align="center">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.store" placeholder="选择分支">
                            <el-option v-for="item in scope.row.branchOptions" :key="item.id" :label="item.branchname"
                                :value="item.branchname">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <el-form :label-position="labelPosition" label-width="80px" :rules="formRules" :model="formLabelAlign">
                <el-form-item label="部署环境" prop="region">
                    <el-select v-model="formLabelAlign.env" placeholder="请选择部署环境">
                        <el-option v-for="item in envList" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部署方案" prop="region">
                    <el-select v-model="formLabelAlign.productlines" placeholder="请选择部署方案">
                        <el-option v-for="item in productList" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <!-- 按钮 -->
        <div class="btn-list">
            <el-button size="mini" type="primary" @click="buildDeploy">构建部署</el-button>
            <el-button size="mini" type="primary" @click="goBack" plain>取消</el-button>
        </div>
    </div>
</template>

<script>
    import { seachgit, buildExc } from "@/api/qms";
    export default {
        props: {
            testId: {
                type: Number | String,
                default: ''
            }
        },
        watch: {
            testId(val) {
                this.getGitList(val);
                this.formLabelAlign.test_id = val;
            }
        },
        data() {
            return {
                tableData: [{
                    product: '',
                    gitId: '',
                    store: '',
                    branchOptions: []
                }],
                labelPosition: 'right',
                formLabelAlign: {
                    test_id: '',
                    env: 'uat',
                    productlines: '1'
                },
                formRules: {
                    env: [{
                        required: true,
                        message: '构建环境不能为空，请选择环境',
                        trigger: 'change'
                    }],
                    productlines: [{
                        required: true,
                        message: '部署方案不能为空，请选择方案',
                        trigger: 'change'
                    }]
                },
                envList: [
                    { name: 'UAT', value: 'uat' },
                    { name: 'SIT', value: 'sit' },
                    { name: 'prod', value: 'prod' }
                ],
                productList: [{ name: 'uat标准流水线', value: '1' }]
            };
        },
        methods: {
            goBack() {
                this.$emit('close');
            },
            // 仓库查询
            getGitList(id) {
                seachgit({ test_id: id }).then(res => {
                    this.tableData = res.data.map(o => {
                        return {
                            product: o.name,
                            gitId: o.git_id,
                            branchOptions: o.branch,
                            store: ''
                        };
                    });
                });
            },
            buildDeploy() {
                let data = this.tableData.map(o => {
                    return {
                        git_id: o.gitId,
                        branch: o.store
                    };
                });
                buildExc({ data, ...this.formLabelAlign }).then((res) => {
                    var that = this;
                    if (res && res.status * 1 === 1) {
                        that.$message.success("构建请求已发送！！");
                        let apps = [];
                        res.data.forEach(a => {
                            apps.push(a.server_name);
                        });
                        that.$router.push({ name: 'buildList', params: { appname: apps.toString() } });
                    } else {
                        that.$message.error(res.message || "构建请求发送失败!");
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import '@/views/qms/components/style.scss';

    .build-deploy {

        .mid-title {
            padding: 10px 0;
            color: #606266;
        }

        .mg-bt-20 {
            margin-bottom: 20px;
        }

        .btn-list {
            margin-top: 30px;
        }
    }
</style>