<template>

  <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
    <div class="card-panel" @click="handleSetLineChartData('/zabbix/alarm-tables')">
      <div class="card-panel-icon-wrapper icon-money">
        <svg-icon :icon-class="icon" class-name="card-panel-icon"/>
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">
          {{title}}
          <el-tooltip v-if="tip" class="item" effect="dark" placement="top-start">
            <div slot="content">{{tip}}</div>
            <i class="el-icon-question" style="color:dodgerblue"></i>
          </el-tooltip>
        </div>

        <count-to :start-val="0" :end-val='value' :duration='duration' class="card-panel-num" :decimals="decimals"/>
        {{format_value}}
      </div>
    </div>
  </el-col>

</template>

<script>
  import CountTo from 'vue-count-to'

  export default {
    name: 'panel_card',
    components: {
      CountTo
    },
    props: {
      title: {type: String, default: 'title'},
      value: {type: Number, default: 0},
      decimals: {type: Number, default: 0},
      duration: {type: Number, default: 500},
      format_value: {type: String, default: ''},
      url:{type: String, default: ''},
      icon:{type: String, default: 'bug'},
      tip:{type: String, default: ''},
    },
    data() {
      return {}
    },
    created() {
    },
    methods: {
      handleSetLineChartData() {
        console.log(this.url)
        this.$router.push(this.url)
      },

    }
  }
</script>

<style lang="scss" scoped>
  .card-panel-col {
    margin-bottom: 15px;
  }

  .card-panel {
    height: 100px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }


  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
