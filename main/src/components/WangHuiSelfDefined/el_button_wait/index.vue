<!--在el-button基础上加个interval，表示按钮每隔一定时间(秒)才能再次点击-->

<template>
  <button
    class="el-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading || time_to_wait > 0"></i>
    <i :class="icon" v-if="icon && !loading && time_to_wait <= 0"></i>
    <span v-if="$slots.default && time_to_wait <= 0 "><slot></slot></span>
    <span v-if="$slots.default && time_to_wait > 0 ">等待{{time_to_wait}}秒</span>
    <!-- slots.default表示未具名插槽内插入的内容 -->

  </button>
</template>
<script>
  export default {
    name: 'ElButton',
    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },
    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      autofocus: Boolean,
      round: Boolean,
      circle: Boolean,
      interval: {
        default: 0
      }
    },
    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      buttonSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      // buttonDisabled() {
      //   return this.disabled || (this.elForm || {}).disabled;
      // },
    },
    data() {
      return {
        buttonDisabled: this.disabled,
        time_to_wait: 0
      }
    },
    // watch: {
    //   disabled() {
    //     this.buttonDisabled = this.disabled
    //   }
    // },
    methods: {
      handleClick(evt) {
        this.$emit('click', evt);
        this.buttonDisabled = true;
        this.time_to_wait = this.interval;
        let clock = setInterval(() => {
          this.time_to_wait = this.time_to_wait - 1;
          console.log(this.time_to_wait);
          if (this.time_to_wait <= 0) {
            clearInterval(clock);
            this.buttonDisabled = false;
          }
        }, 1000)
      }
    }
  }
  ;
</script>
