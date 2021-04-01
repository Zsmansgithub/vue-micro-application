<template>
    <div class="dialog-com">
        <el-dialog :visible.sync="dialogFormVisible" title="关联应用" :close-on-click-modal="false" center
            :beforeClose="handleClose">
            <div class="mg-bt-20 top-content">
                <div class="top-info">需求编号：{{localData.demand_code}}</div>
                <div class="top-info">需求概述：{{localData.demand_desc}}</div>
            </div>
            <div class="title">应用信息</div>
            <el-form :model="form" :inline="true" class="form-info" ref="form">
                <el-form-item label="开发组" prop="development_group">
                    <development-sel v-model="form.development_group" @change="selectedChange" />
                </el-form-item>
                <el-form-item label="产品" prop="product">
                    <product v-model="form.product" :projectteamid="form.development_group" @change="selectedProduct" />
                </el-form-item>
                <el-form-item label="仓库" prop="git_warehouse">
                    <el-select v-model="form.git_warehouse" placeholder="请选择仓库" @change="warhouseSelected">
                        <el-option v-for="(item, index) in gitsOptions" :key="`git_${item.value}${index}`"
                            :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="应用" prop="appId">
                    <el-select v-model="form.appId" placeholder="请选择应用">
                        <el-option v-for="item in appOptions" :key="item.value" :label="item.name" :value="item.name"
                            @click.native="onChange(item.name)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开发分支" prop="branch">
                    <el-select v-model="form.branch" placeholder="请选择开发分支">
                        <el-option v-for="item in branchOptions" :key="item.value" :label="item.name"
                            :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <div class="form-btn">
                    <el-button size="mini" type="primary" @click="handleSave">新增</el-button>
                    <el-button size="mini" type="primary" plain @click="resetForm('form')">重置</el-button>
                </div>
            </el-form>
            <div class="demend-list mg-bt-20">
                <el-table :data="demendList" border style="width: 100%">
                    <el-table-column prop="appName" label="应用名" min-width="120" align="center">
                    </el-table-column>
                    <el-table-column prop="branch" label="开发分支" align="center" min-width="120">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="120">
                        <template slot-scope="scope">
                            <el-button type="danger" plain icon="el-icon-delete" size="mini" circle
                                @click="deleteList(scope.$index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="saveBtn">保存</el-button>
                <el-button size="mini" type="primary" plain @click="handleClose">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { developmentSel, product } from "./../index"

    import { searchGits, searchApp, seachbranch, demandRelated } from '@/api/qms'
    export default {
        components: {
            developmentSel,
            product
        },
        props: {
            diaData: {
                type: Object,
                default: () => { }
            }
        },
        data() {
            return {
                form: {
                    development_group: '',
                    product: '',
                    git_warehouse: '',
                    appId: '',
                    branch: '',
                    appName: ''
                },
                localData: {},
                searchData: [],
                demendList: [],
                dialogFormVisible: false,
                gitsOptions: [], // 仓库选项;
                appOptions: [], // 应用选项;
                branchOptions: [], // 分支选项;
                appMap: new Map(),
                branchMap: new Map()
            };
        },
        computed: {},
        watch: {
            diaData: {
                handler: function (val, oldVal) {
                    this.demendList = [];
                    this.localData = val;
                    this.localData.demand_app.forEach((item, index) => {
                        let obj = {
                            appId: item.app_id,
                            appName: item.app_name,
                            branch: item.branch,
                            development_group: item.development_group,
                            git_warehouse: item.git_warehouse,
                            product: item.product,
                            id: item.id
                        };
                        this.demendList.push(obj);
                    });
                },
                deep: true
            }
        },
        methods: {
            show() {
                this.dialogFormVisible = true;
            },
            onChange(val) {
                this.form.appName = val;
            },
            handleClose() {
                this.dialogFormVisible = false;
                this.demendList = [];
            },
            // 开发组选择,调用仓库接口，清空应用和分支;
            selectedChange(value) {
                this.gitsOptions = [];
                this.appOptions = [];
                this.branchOptions = [];
                this.productOptions = [];
                this.form.product = '';
                this.form.git_warehouse = '';
                this.form.branch = '';
                this.form.appId = '';
                this.form.appName = '';
            },
            // 产品筛选;
            selectedProduct(value) {
                this.gitsOptions = [];
                this.appOptions = [];
                this.branchOptions = [];
                this.form.git_warehouse = '';
                this.form.branch = '';
                this.form.appId = '';
                this.form.appName = '';
                this.getSearchGits(value);
            },
            // 仓库选择;调用应用接口，清空开发分支;
            warhouseSelected(value) {
                this.branchOptions = [];
                this.form.branch = '';
                this.form.appId = '';
                this.appOptions = [];
                this.form.appName = '';
                this.getApp(value);
                this.getBranch(value);
            },
            // 仓库下拉接口
            getSearchGits(projectteam_id = '') {
                searchGits({ product_id: projectteam_id, projectteam_id: '' })
                    .then(res => {
                        if (res && res.status * 1 === 1) {
                            this.gitsOptions = res.data.results.map(o => ({
                                name: o.name,
                                value: o.git_id
                            }));
                        } else {
                            this.$message.error(res.message || '出错了')
                        }
                    });
            },
            // 应用下拉接口
            getApp(git_id = '') {
                searchApp({ git_id: git_id }).then(res => {
                    if (res && res.status * 1 === 1) {
                        this.appOptions = res.data.results.map(o => {
                            this.appMap.set(o.app_name, o.app_id);
                            return {
                                name: o.app_name,
                                value: o.app_id
                            };
                        });
                    } else {
                        this.$message.error(res.message || '出错了')
                    }
                });
            },
            // 分支下拉接口
            getBranch(git_id = '') {
                seachbranch({ git_id: git_id }).then(res => {
                    if (res && res.status * 1 === 1) {
                        this.branchOptions = res.data.map(o => {
                            this.branchMap.set(o.branchname, o.id);
                            return {
                                name: o.branchname,
                                value: o.id
                            };
                        });
                    } else {
                        this.$message.error(res.message || '出错了')
                    }
                });
            },
            deleteList(index) {
                this.demendList.splice(index, 1);
            },
            handleSave() {
                if (!this.form.appId || !this.form.branch) return;
                let obj = JSON.parse(JSON.stringify(this.form));
                this.demendList.push(obj);
                this.resetForm('form');
            },
            // 重置表单;
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 保存;
            saveBtn() {
                let arr = JSON.parse(JSON.stringify(this.demendList));
                arr.forEach(it => {
                    it.appId = this.appMap.get(it.appId);
                });
                let params = {
                    demandId: this.diaData.demand_num,
                    appList: arr
                };
                demandRelated(params).then((res) => {
                    if (res.message == 'ok') {
                        this.dialogFormVisible = false;
                    }
                });
                this.$emit('save');
            }
        }
    };
</script>

<style lang="scss">
    .dialog-com {
        .el-dialog {
            .el-dialog__body {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #000000;
            }
        }

        .el-dialog__header {
            text-align: left;
        }

        .el-form-item__label {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
        }

        .title {
            margin-bottom: 10px;
        }

        .form-info {
            padding: 10px;
            border: 1px solid #DCDFE6;
            margin-bottom: 20px;

            .form-btn {
                text-align: center;
            }
        }

        .mg-bt-20 {
            margin-bottom: 20px;
        }

        .top-content {
            .top-info {
                padding: 10px 0;
            }
        }

        .del-btn {
            color: #D17275;
            text-decoration: underline;
        }

        .btn-list {
            margin-top: 30px;
        }
    }
</style>