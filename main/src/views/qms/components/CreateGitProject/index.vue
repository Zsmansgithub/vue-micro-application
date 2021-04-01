<template>
    <div>
        <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="120px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="部门" prop="category">
                        <depart-obj v-model="newAppForm.category" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="开发组" prop="developmentteam">
                        <development-obj v-model="newAppForm.developmentteam" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="产品" prop="product">
                        <product-obj v-model="newAppForm.product" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="仓库中文名" prop="warehouse_name">
                        <el-input v-model="newAppForm.warehouse_name" placeholder="请输入" style="width: 100%"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="仓库英文名" prop="warehouse_cname">
                        <el-input v-model="newAppForm.warehouse_cname" placeholder="请输入" style="width: 100%"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="仓库负责人" prop="Development">
                        <all-user v-model="newAppForm.Development" placeholder="请输入" style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="仓库功能描述" style="width: 100%;" prop="warehouse_desc">
                        <el-input v-model="newAppForm.warehouse_desc" type="textarea" roe="3" placeholder="请输入"
                            style="width: 100%"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div style="text-align: right;">
            <el-button type="primary" @click="onSub">提 交</el-button>
            <el-button @click="goBack" type="primary" plain>取 消</el-button>
        </div>
    </div>
</template>
<script>
    import { DepartObj, DevelopmentObj, ProductObj, AllUser } from "./../index";
    import { creategitproject } from '@/api/qms';
    export default {
        components: {
            DepartObj,
            DevelopmentObj,
            ProductObj,
            AllUser
        },
        data() {
            return {
                newAppForm: {
                    category: undefined,
                    // category_name: undefined, //	部门英文名称	STRING	必填
                    // category_cname: undefined, //	部门中文名称	STRING	必填
                    developmentteam: undefined,
                    // developmentteam_name: undefined, //	开发组英文名称	STRING	必填
                    // developmentteam_cname: undefined, //	开发组中文名称	STRING	必填
                    product: undefined,
                    // product_name: undefined, //	产品英文名称	STRING	必填
                    // product_cname: undefined, //	产品中文名称	STRING	必填
                    warehouse_name: undefined, //	仓库英文名称	STRING	必填
                    warehouse_cname: undefined, //	仓库中文名称	STRING	必填
                    Development: undefined, //	开发负责人	STRING	必填
                    warehouse_desc: undefined, //	仓库描述	STRING	必填
                },
                rules: {
                    category: [{ required: true, message: '请选择部门', trigger: 'blur' }],
                    developmentteam: [{ required: true, message: '请选择开发组', trigger: 'blur' }],
                    product: [{ required: true, message: '请选择产品', trigger: 'blur' }],
                    warehouse_name: [{ required: true, message: '请填写仓库英文', trigger: 'blur' }],
                    warehouse_cname: [{ required: true, message: '请填写仓库中文', trigger: 'blur' }],
                    Development: [{ required: true, message: '请填写仓库负责人', trigger: 'blur' }],
                    warehouse_desc: [{ required: true, message: '请填写仓库功能描述', trigger: 'blur' }],
                }
            }
        },
        methods: {
            goBack() {
                this.$emit('close');
            },
            onSub() {
                this.$refs.newAppForm.validate((valid) => {
                    if (valid) {
                        const newAppForm = this.newAppForm;
                        const { category, developmentteam, product } = newAppForm;
                        const query = {
                            category_name: category.id, //	部门英文名称	STRING	必填
                            category_cname: category.departmentcname, //	部门中文名称	STRING	必填
                            developmentteam_name: developmentteam.projectteam_name, //	开发组英文名称	STRING	必填
                            developmentteam_cname: developmentteam.projectteam_cname, //	开发组中文名称	STRING	必填
                            product_name: product.project_name, //	产品英文名称	STRING	必填
                            product_cname: product.project_cname, //	产品中文名称	STRING	必填
                            warehouse_name: newAppForm.warehouse_name, //	仓库英文名称	STRING	必填
                            warehouse_cname: newAppForm.warehouse_cname, //	仓库中文名称	STRING	必填
                            Development: newAppForm.Development, //	开发负责人	STRING	必填
                            warehouse_desc: newAppForm.warehouse_desc, //	仓库描述	STRING	必填
                        }
                        creategitproject(query)
                            .then((res) => {
                                if (res && res.status * 1 === 6000) {
                                    this.$message.success(res.message || '创建成功');
                                    this.newAppForm = this.$options.data().newAppForm;
                                    this.$emit('created');
                                }
                            })
                            .catch((e) => {
                                console.error(e)
                            })
                    }
                })

            }
        }
    }
</script>
<style lang="scss" scoped>
</style>