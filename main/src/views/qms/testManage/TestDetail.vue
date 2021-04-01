<template>
    <info-second :goBack="goList">
        <div class="section-layout">
            <card-detail typeCard='success' title="基础信息" icon="detail_info">
                <div>
                    <div class="content1 mb-20">
                        <div><b>提测主题：</b>{{ listQuery.demand_test_title || defText }}</div>
                        <div><b>提测环境：</b>{{ listQuery.test_env || defText }}</div>
                        <div><b>测试执行人：</b>{{ listQuery.tester || defText }}</div>
                    </div>
                    <!-- 提测内容 -->
                    <div class="mb-20 ">
                        <div class="content-title"><b>提测内容</b></div>
                        <div v-if="listQuery.test_desc" class="border-light">{{ listQuery.test_desc }}</div>
                        <div v-else class="border-light empty">暂无数据</div>
                    </div>
                </div>
                <!-- 提测需求 -->
                <div class="mb-20">
                    <div class="content-title"><b>提测需求</b></div>
                    <el-table :data="changeTableData" border style="width: 100%">
                        <el-table-column prop="demand_num" label="需求编号" width="120">
                        </el-table-column>
                        <el-table-column prop="demand_desc" label="需求描述" width="160">
                        </el-table-column>
                        <el-table-column prop="app_name_branch" label="应用">
                            <template slot-scope="scope">
                                <div v-for="(it,index) in scope.row.app_name_branch" :key="index">{{ it }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="tester" label="开发人员" width="120">
                        </el-table-column>
                        <el-table-column prop="test_status" label="是否完成自测" width="120">
                        </el-table-column>
                    </el-table>
                </div>
            </card-detail>
            <card-detail typeCard='primary' title="其他信息" icon="detail_form">
                <div>
                    <!-- 数据库变更 -->
                    <div class="mb-20">
                        <div class="content-title"><b>数据库变更</b></div>
                        <div class="content-db">
                            <el-input class="text-area" type="textarea" :rows="4" placeholder="请输入内容"
                                v-model="listQuery.sql">
                            </el-input>
                            <!-- 上传组件 -->
                            <el-upload drag disabled class="upload-demo"
                                action="https://jsonplaceholder.typicode.com/posts/" multiple>
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            </el-upload>
                        </div>
                    </div>
                    <div class="mb-20 content-sel">
                        <div>
                            <label class="sel-label">SQL是否执行</label>
                            <el-select v-model="listQuery.sql_status">
                                <el-option v-for="it in isAction" :key="it.value" :label="it.label" :value="it.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label class="sel-label">配置是否执行</label>
                            <el-select v-model="listQuery.config_status">
                                <el-option v-for="it in isAction" :key="it.value" :label="it.label" :value="it.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <!-- 配置变更 -->
                    <div>
                        <div class="content-title"><b>配置变更</b></div>
                        <el-table :data="tableData" border style="width: 100%">
                            <el-table-column prop="type" label="配置类型">
                                <template slot-scope="scope">
                                    <div>{{showType(scope.row.type)}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="value" label="变更内容">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </card-detail>
            <!-- 按钮 -->
            <div class="btn-list">
                <el-button size="mini" type="primary" @click="confirTest('2')">确认</el-button>
                <el-button size="mini" type="primary" @click="confirTest('3')">驳回</el-button>
                <el-button size="mini" plain type="primary">取消</el-button>
            </div>
        </div>
    </info-second>
</template>

<script>
    import InfoSecond from "@/views/qms/components/InfoSecond";
    import CardDetail from "@/components/CardDetail";
    import sessionListQuery from '@/components/mixins/sessionListQuery';
    import { rejectTest } from '@/api/qms';
    export default {
        components: { CardDetail, InfoSecond },
        mixins: [sessionListQuery],
        data() {
            return {
                labelPosition: 'right',
                isAction: [{ label: '是', value: 0 }, { label: '否', value: 1 }],
                changeTableData: [{}],
                tableData: [{}],
                listQuery: {
                    sql: '',
                    sql_status: '1',
                    config_status: '1'
                },
                configOptions: [{ type: 1, name: '配置文件' },
                { type: 2, name: 'Apollo动态配置' },
                { type: 3, name: 'MQ配置' },
                { type: 4, name: '权限配置' },
                { type: 5, name: '菜单配置' },
                { type: 6, name: '组件变更' },
                { type: 7, name: '其他' }],
                defText: '--'
            };
        },
        created() {
            const row = this.$route.params.row;
            if (row) {
                this.listQuery = row;
            }
        },
        mounted() {
            this.changeTableData = this.listQuery.demandList;
            this.tableData = this.listQuery.configList;
        },
        methods: {
            goList() {
                this.$router.push('testList')
            },
            confirTest(btnVal) {
                // eslint-disable-next-line
                let { id, sql, sql_status, config_status } = this.listQuery;
                let params = {
                    id,
                    status: btnVal, // 	状态：1:初始状态 2:同意 3: 驳回
                    desc: sql,
                    sql_status,
                    config_status
                };
                rejectTest(params).then((res) => {
                    if (res && res.status * 1 === 1) {
                        this.$message.success(res.message || '操作成功');
                        this.$router.push({ name: 'testList' })
                    } else {
                        this.$message.success(res.message || '出错了')
                    }
                });
            },
            showType(value) {
                let name = '';
                this.configOptions.filter((item) => {
                    if (item.type == value) {
                        name = item.name;
                    }
                });
                return name;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import '@/styles/borderLightBlue.scss';
    @import './../components/style.scss';

    .mb-20 {
        margin-bottom: 20px;
    }

    .content-title {
        margin-bottom: 10px;
    }

    .content1 {
        display: flex;

        &>div {
            flex: 1;
        }
    }

    .border-light {
        @extend .border-light-blue;
    }

    .empty {
        text-align: center;
    }

    .content-db {
        display: flex;

        .text-area {
            margin-right: 10px;
        }
    }

    .content-sel {
        display: flex;

        &>div {
            flex: 1;
        }

        .sel-label {
            padding-right: 10px;
        }
    }
</style>