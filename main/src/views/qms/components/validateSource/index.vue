<template>
    <div class="dialog-validate">
        <el-dialog :visible.sync="dialogFormVisible" :show-close="true" :close-on-click-modal="false" center>
            <div class="demend-list mg-bt-20">
                <el-table :data="demendList" border style="width: 100%">
                    <el-table-column prop="product" label="部署服务名" align="center">
                    </el-table-column>
                    <el-table-column prop="store" label="服务类型" align="center">
                    </el-table-column>
                    <el-table-column prop="store" label="产品线" align="center">
                    </el-table-column>
                    <el-table-column prop="store" label="应用说明" align="center">
                    </el-table-column>
                    <el-table-column prop="store" label="服务等级" align="center">
                    </el-table-column>
                    <el-table-column prop="store" label="IP及端口" align="center">
                    </el-table-column>
                    <el-table-column prop="store" label="资源校验结果" align="center">
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div slot="footer" class="dialog-footer">
              <el-button type="primary" size="mini">保存</el-button>
              <el-button size="mini" type="primary" plain @click="dialogFormVisible = false">取消</el-button>
            </div> -->
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                demendList: [
                    { product: 'ashjhdasjhj', store: 'jasjhashdjsh' }
                ],
                dialogFormVisible: false
            };
        },
        methods: {
            open() {
                this.dialogFormVisible = true;
            },
            onSubmit() {
                console.log('submit!');
            }
        }
    };
</script>

<style lang="scss">
    .dialog-validate {
        .el-dialog {
            .el-dialog__body {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #000000;
            }
        }

        // .el-dialog__header {
        //     padding: 0;
        // }
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