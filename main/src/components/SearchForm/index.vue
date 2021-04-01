<template>
  <div>
    <div style="position: relative;padding-right: 95px;z-index: 0;">
      <div
        class="listQuery-Search-icon"
        @click="updateState"
        style="cursor: pointer"
      >
        高级搜索<i
          class="el-icon-arrow-right"
          :class="{ 'is-active': listQuerySearch }"
        ></i>
      </div>
      <slot name="content"> </slot>
      <slot name="trigger"> </slot>
      <slot name="search"> </slot>
    </div>
    <slot name="fr"> </slot>
  </div>
</template>

<script>
export default {
  props: {
    listQuerySearch: {
      default: false
    }
  },
  methods: {
    updateState() {
      this.$emit("update:listQuerySearch", !this.listQuerySearch);
    }
  }
};
</script>

<style lang="scss" scoped>
.listQuery-Search-icon {
  position: absolute;
  right: 10px;
  top: 7px;
  z-index: 9;

  .el-icon-arrow-right {
    transition: transform 0.3s;
    will-change: transform;
  }

  .is-active {
    transform: rotate(90deg);
  }
}
</style>
