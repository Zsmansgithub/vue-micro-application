<template>
    <el-row>
        <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" :offset="2">
            <div style="padding: 10px 0;">
                <el-button type="text" icon="el-icon-back" @click="goBack">返回</el-button>
            </div>
            <slot></slot>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        props: {
            goBack: {
                type: Function,
                default: ''
            }
        }
    }
</script>