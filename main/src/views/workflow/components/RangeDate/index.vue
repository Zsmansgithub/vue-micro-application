<template>
  <el-date-picker
    v-model="val"
    v-on="$listeners"
    v-bind="$attrs"
    :picker-options="pickerOptions"
    @focus='datePickerFocus'>
  </el-date-picker>
</template>
<script>
  export default {
    props: {
      value: {
        type: Array | null | undefined,
        required: true
      }
    },
    computed: {
      val: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    data () {
      return {
        pickerOptions: {}
      };
    },
    created () {
      this.init();
    },
    methods: {
      init () {
        this.pickerOptions.onPick = ({ maxDate, minDate }) => {
          this.setPickerOptions({ maxDate, minDate });
        };
      },
      datePickerFocus () {
        this.$set(this.pickerOptions, 'disabledDate', (time) => {
          return false;
        });
      },
      setPickerOptions ({ maxDate, minDate }) {
        // disabledDate 为true表示不可选,false表示可选  日期选择（pick）回调添加选择范围限制
        this.$set(this.pickerOptions, 'disabledDate', (time) => {
          const date = minDate || maxDate;
          const oneMonth = 1000 * 60 * 60 * 24 * 30
          let startTime = new Date(date.getTime() - oneMonth);
          let endTime = new Date(date.getTime() + oneMonth);

          return time.getTime() > endTime.getTime() || time.getTime() < startTime.getTime();
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
</style>
