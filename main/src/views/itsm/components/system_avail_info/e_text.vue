<template>
  <div :style="{ 'min-height': height }" style="position: relative;padding-right: 20px;text-align: left;">
    <transition name="el-zoom-in-center">
      <div v-show="show" ref="text" :style="{ width: width, height: height }" style="position: absolute;top: 0;left: 0;padding-right: 20px;width: 180px;">
        {{tip}}
      </div>
    </transition>
    <template v-if="isOver">
      <i @click.stop="show = !show" :style="{transform: show ? 'rotate(0deg)' : 'rotate(90deg)'}" style="position: absolute;right: 0;top: 5px;z-index: 9"
         class="el-icon-arrow-right"></i>
      <transition name="el-zoom-in-center">
        <div v-show="!show">{{text}}</div>
      </transition>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'e_text',
    props: {
      width: {
        type: String,
        default: '180px'
      },
      height: {
        type: String,
        default: '45px'
      },
      text: String,
      tip: String
    },
    data() {
      return {
        show: true,
        isOver: false
      }
    },
    mounted() {
      this.$nextTick(()=>{
        this.isOver = this.$refs['text'].scrollHeight > this.$refs['text'].clientHeight;
      })
    }
  }
</script>

<style lang="scss" scoped>
.el-icon-arrow-right {
  transition: all .3s ease;
}
</style>
