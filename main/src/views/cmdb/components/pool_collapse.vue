<template>
<div @click.stop="showContent = !showContent" style="position: relative;">
    <div v-for="(item, idx) in app_name.slice(0, 5)" :key="`tab_${idx}`">
        <el-link :underline="false" type="primary" @click.stop="toMallInfo(item.id,item.name)"
            :key="idx">{{item.name}}</el-link>
    </div>
    <template v-if="app_name.length > 5">
        <i :style="{transform: showContent ? 'rotate(0deg)' : 'rotate(90deg)'}" style="position: absolute;right: 5px;top: 50px;z-index: 9"
        class="el-icon-arrow-right"></i>
        <el-collapse-transition>
            <div v-show="showContent">
                <div v-for="(item, idx) in app_name.slice(5,)" :key="`con_${idx}`">
                    <el-link :underline="false" type="primary" @click.stop="toMallInfo(item.id,item.name)"
                        :key="idx">{{item.name}}</el-link>
                </div>
            </div>
        </el-collapse-transition>
    </template>
</div>
</template>
<script>
export default {
    props: {
        app_name: {
            type: Array,
            default: () => []
        }
    },
    data () {
    return {
        showContent: false
    }
    },
    methods:{
        toMallInfo(id, name) {
            this.$emit('toMallInfo', id, name)
        }
    }
}
</script>
<style lang="scss" scoped>
.el-icon-arrow-right {
  transition: all .3s ease;
}
</style>