<template>
    <el-card shadow="never" class="el-card_in_edit card-top" :class="`card-${typeCard}`">
        <div slot="header" class="clearfix">
            <div class="head-conyent">
                <svg-icon :icon-class="icon" class="icon" />
                <label class="text">{{title}}</label>
            </div>
        </div>
        <slot></slot>
    </el-card>
</template>
<script>
    export default {
        props: {
            typeCard: {
                type: String,
                default: 'paimary'
            },
            title: {
                type: String,
                default: '基础信息'
            },
            icon: {
                type: String,
                default: 'detail_info'
            },
        },
        name: "",
        data() {
            return {}
        },
        methods: {}
    }
</script>
<style lang="scss" scoped>
    @import '@/styles/detailCard.scss';
</style>