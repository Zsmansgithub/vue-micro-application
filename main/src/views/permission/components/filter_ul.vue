<template>
  <transition name="el-zoom-in-top">
    <div class="el-table-filter">
      <div class="el-table-filter__content">
        <div style="padding: 10px">
          <el-input :validate-event="false" v-model="val"></el-input>
        </div>
      </div>
      <div class="el-table-filter__bottom">
        <button type="button" @click.stop="dofilter" :class="{ 'is-disabled': isdisabled }" :disabled="isdisabled">筛选</button>
        <button type="button" @click.stop="reset">重置</button>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      value: String,
      required: true
    },
    computed: {
      val: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
      isdisabled() {
        return !(this.value && this.value.length > 0)
      }
    },
    methods: {
      dofilter() {
        this.$emit('dofilter')
      },
      reset() {
        this.$emit('doreset')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table-filter__bottom {
    line-height: 1.2rem;
  }
</style>
