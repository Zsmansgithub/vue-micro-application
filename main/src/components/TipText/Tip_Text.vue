<template>
  <el-tooltip :content="text" :disabled="isOver" :placement="placement" v-bind="$attrs" v-on="$listeners">
    <div @mouseenter="tips($event)" :class="classStr">{{ text }}</div>
  </el-tooltip>
</template>

<script>
  export default {
    name: 'Tip_Text',
    props: {
      text: String,
      classStr: String,
      placement: {
        type: String,
        default: 'top'
      }
    },
    data() {
      return {
        isOver: true
      }
    },
    methods: {
      tips($event) {
        this.isOver =  $event.target.offsetWidth >= $event.target.scrollWidth;
      }
    }
  }
</script>
