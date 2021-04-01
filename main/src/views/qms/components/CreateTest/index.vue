<template>
    <div class="create-test section-layout">
        <div class="title">新建提测单</div>
        <!-- 顶部表单 -->
        <el-form :label-position="labelPosition" inline :rules="rules" label-width="120px" :model="formLabelAlign">

            <el-form-item label="提测主题" prop="title" label-width="80px">
                <el-input v-model="formLabelAlign.title"></el-input>
            </el-form-item>

            <el-form-item label="提测环境" prop="env">
                <el-select v-model="formLabelAlign.env" placeholder="请选择提测环境">
                    <el-option label="UAT" value="UAT"></el-option>
                    <el-option label="SIT" value="SIT"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="测试执行人" prop="tester">
                <el-select v-model="formLabelAlign.tester" filterable placeholder="请选择测试执行人">
                    <el-option label="张荣梅" value="张荣梅"></el-option>
                    <el-option label="李国荣" value="李国荣"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <!-- 提测内容 -->
        <div class="test-contain mg-bt-10">
            <div class="mid-title">提测概述（含变更影响范围）</div>
            <el-input class="contain" v-model="formLabelAlign.testDesc" placeholder="请输入内容"></el-input>
        </div>
        <!-- 提测需求 -->
        <div>
            <div class="mid-title">
                <span>提测需求</span>
                <el-button size="mini" class="new-btn" type="primary" :disabled="true">新增</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="demand_code" label="需求编号" align="center" width="160">
                </el-table-column>
                <el-table-column prop="demand_desc" label="需求描述" width="180" align="center">
                </el-table-column>
                <el-table-column prop="project_num" label="项目" align="center" width="120">
                </el-table-column>
                <el-table-column prop="demand_app" label="应用分支" align="center">
                    <template slot-scope="scope">
                        <div v-for="(item, idx) in scope.row.demand_app" :key="`${item.app_id}${idx}`">
                            {{item.app_name+":"+item.branch}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="developer" label="开发人员" align="center" width="120">
                </el-table-column>
                <el-table-column prop="testStatus" label="是否完成自测" align="center" width="120">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.testStatus" placeholder="是否完成自测">
                            <el-option label="已自测" value="2"></el-option>
                            <el-option label="未自测" value="1"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button type="danger" plain icon="el-icon-delete" size="mini" circle
                            @click="handleDelete(scope.$index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 数据库变更 -->
        <div class="mg-bt-10 data-change">
            <div class="mid-title">数据库变更</div>
            <div class="flx flx-sp-bt">
                <el-input class="text-area" type="textarea" :rows="4" placeholder="请输入内容" v-model="formLabelAlign.sql">
                </el-input>
                <!-- 上传组件 -->
                <el-upload class="upload-demo" disabled drag action="https://jsonplaceholder.typicode.com/posts/"
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </div>
        </div>
        <!-- 配置变更 -->
        <div>
            <div class="mid-title">配置变更</div>
            <el-form :label-position="labelPosition" class="form-info" label-width="100px" ref="configForm"
                :model="configForm">
                <el-form-item label="配置类型" prop="type">
                    <el-select v-model="configForm.type" placeholder="配置变更类型">
                        <el-option v-for="item in configOptions" :key="item.type" :label="item.name" :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="变更信息" prop="value">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="configForm.value">
                    </el-input>
                </el-form-item>
                <div class="form-btn">
                    <el-button size="mini" type="primary" @click="handleSaveConfig">新增</el-button>
                    <el-button size="mini" type="primary" plain @click="resetForm('configForm')">重置</el-button>
                </div>
            </el-form>
            <!-- 配置展示表格 -->
            <el-table class="mg-bt-10" border :data="changeTableData" style="width: 100%">
                <el-table-column prop="type" label="配置变更类型" align="center">
                    <template slot-scope="scope">
                        <div>{{showType(scope.row.type)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="value" label="变更信息" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button type="danger" plain icon="el-icon-delete" size="mini" circle
                            @click="handleDelConfigInfo(scope.$index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 按钮 -->
        <div class="btn-list">
            <!-- <el-button size="mini"
                       type="primary" @click="openValidate">资源校验</el-button> -->
            <el-button size="mini" type="primary" @click="submitSave">保存</el-button>
            <el-button size="mini" type="primary" @click="submitTest">提交</el-button>
            <el-button size="mini" type="primary" @click="close" class="cancel" plain>取消</el-button>
        </div>
        <validate-source ref="validateSource" />
    </div>
</template>

<script>
    import validateSource from './../validateSource';
    import { sumbitTest } from "@/api/qms"
    export default {
        name: 'createTest',
        props: {
            requireData: {
                type: Array,
                default: () => []
            }
        },
        components: {
            validateSource,
        },
        watch: {
            requireData(val) {
                this.tableData = val
            }
        },
        data() {
            return {
                labelPosition: 'right',
                formLabelAlign: { // 表单;
                    title: '',
                    env: '',
                    tester: '',
                    testDesc: ' ', // 提测概述
                    sql: '' // 数据库变更;
                },
                // 需求列表表格
                tableData: [],
                // 配置变更项;
                changeTableData: [],
                // 配置表格;
                configForm: {
                    type: '',
                    value: ''
                },
                configOptions: [{ type: 1, name: '配置文件' },
                { type: 2, name: 'Apollo动态配置' },
                { type: 3, name: 'MQ配置' },
                { type: 4, name: '权限配置' },
                { type: 5, name: '菜单配置' },
                { type: 6, name: '组件变更' },
                { type: 7, name: '其他' }],
                rules: {
                    title: { required: true, message: "请填写提测主题", trigger: "blur" },
                    env: { required: true, message: "请填写提测环境", trigger: "blur" },
                    tester: { required: true, message: "请选择测试执行人", trigger: "blur" },
                }
            };
        },
        methods: {
            // 取消提测单
            close() {
                this.$emit('close')
            },
            // 删除需求
            handleDelete(index) {
                this.tableData.splice(index, 1)
            },
            // 删除已配置变更项;
            handleDelConfigInfo(index) {
                this.changeTableData.splice(index, 1);
            },
            showType(value) {
                let name = '';
                this.configOptions.filter((item) => {
                    if (item.type == value) {
                        name = item.name;
                    }
                });
                return name;
            },
            // 保存新增配置项;

            handleSaveConfig() {
                let configForm = JSON.parse(JSON.stringify(this.configForm));
                const result = this.changeTableData.filter((item) => {
                    if (item.type == configForm.type) return item;
                });
                if (result.length > 0) return;
                this.changeTableData.splice(this.changeTableData.length - 1, 0, configForm);
            },
            // 重置表单;
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            openValidate() {
                this.$refs.validateSource.open();
            },
            submitSave() {
                console.log(this.tableData);
            },
            submitTest() {
                let appList = [];
                this.tableData.forEach(item => {
                    let branchList = [];
                    item.demand_app.forEach(app => {
                        let b = {};
                        b.appName = app.app_name;
                        b.branch = app.branch;
                        branchList.push(b);
                    });
                    let d = {};
                    d.demandId = item.demand_num;
                    d.demandDesc = item.demand_desc;
                    d.testStatus = item.test_status.id;
                    d.projectNum = item.project_num;
                    d.branchList = branchList;
                    appList.push(d);
                });

                let params = {
                    ...this.formLabelAlign,
                    projectId: 1,
                    raiseTester: this.$store.state.user.name,
                    status: "1",
                    appList: appList,
                    sql: this.formLabelAlign.sql,
                    config: this.changeTableData
                };
                sumbitTest(params).then((res) => {
                    if (res && res.status * 1 == 1) {
                        this.$message.success("提测单创建成功！！");
                        this.$emit('save')
                    } else {
                        this.$message.warning(res.message || '出错了');
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .create-test {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;

        .mid-title {
            padding: 10px 0;
        }

        .mg-bt-10 {
            margin-bottom: 20px;
        }

        .test-contain {
            .contain {
                padding: 10px 10px 10px 0;
            }
        }

        .form-info {
            padding: 10px;
            border: 1px solid #DCDFE6;
            margin-bottom: 20px;

            .form-btn {
                text-align: center;
            }
        }

        .data-change {
            .text-area {
                margin-right: 20px;
            }
        }

        .btn-list {
            margin-top: 30px;

            .cancel {
                margin-left: 10px;
            }
        }

        .del-btn {
            color: #D17275;
            text-decoration: underline;
        }

        .new-btn {
            margin-left: 20px;
        }
    }

    .flx-sp-bt {
        display: flex;
    }
</style>
<style lang="scss" scoped>
    @import '@/views/qms/components/style.scss';

    .create-test {
        .el-form-item .el-form-item__label {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
        }
    }
</style>