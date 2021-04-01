<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel data-box1" @click="handleSetLineChartData('/zabbix/alarm-tables')">
          <i class="topL"></i>
          <i class="topR"></i>
          <i class="bottomL"></i>
          <i class="bottomR"></i>
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="bug" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" >
            ZABBIX报警数<count-to :start-val="0" :end-val=panelgroup.alarm_sum :duration="3200" class="card-panel-num" />
          </div>
         <div class="card-panel-text" >
            中间件报警数<count-to :start-val="0" :end-val=panelgroup.alarm_sum :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel  data-box1" @click="handleSetLineChartData('/cmdb/resoucre')">
                  <i class="topL"></i>
          <i class="topR"></i>
          <i class="bottomL"></i>
          <i class="bottomR"></i>
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="excel" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            服务器总数
          </div>
          <count-to :start-val="0" :end-val=panelgroup.server_sum :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel  data-box1" @click="handleSetLineChartData('/cmdb/app')">
                  <i class="topL"></i>
          <i class="topR"></i>
          <i class="bottomL"></i>
          <i class="bottomR"></i>
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="component"  class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            APP总数
          </div>
          <count-to :start-val="0" :end-val=panelgroup.app_sum :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel  data-box1" @click="handleSetLineChartData('/cmdb/pool')">
                  <i class="topL"></i>
          <i class="topR"></i>
          <i class="bottomL"></i>
          <i class="bottomR"></i>
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="tree"  class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            项目总数
          </div>
          <count-to :start-val="0" :end-val=panelgroup.monitor_server_sum :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { fetchList } from '@/api/db'

export default {
  components: {
    CountTo
  },
  data(){
    return {
      panelgroup:{
        server_sum:0,
        app_sum:0,
        alarm_sum:0,
        monitor_server_sum:0,
      }

    }

  },
  created() {
    this.getList();
  },
  methods: {
    handleSetLineChartData(url) {
      this.$emit('handleSetLineChartData', url)
    },
    getList(){
      fetchList().then(response => {

          this.panelgroup=response.data
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;

    position: relative;
    color: #666;

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
        color: rgb(43, 231, 255);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
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

  .topL {
    width: 20px;
    height: 20px;
    border-top-width: 2px;
    border-top-color: #26c6f0;
    border-top-style: solid;
    border-left-width: 2px;
    border-left-color: #26c6f0;
    border-left-style: solid;
    position: absolute;
    top: -2px;
    left: -2px;
  }

  .topR {
    width: 20px;
    height: 20px;
    border-top-width: 2px;
    border-top-color: #26c6f0;
    border-top-style: solid;
    border-right-width: 2px;
    border-right-color: #26c6f0;
    border-right-style: solid;
    position: absolute;
    top: -2px;
    right: -2px;
  }

  .data-box1 {
    border: 2px solid #032d60;
    -webkit-box-shadow: #07417a 0px 0px 10px;
    -moz-box-shadow: #07417a 0px 0px 10px;
    box-shadow: inset 0 0 30px #07417a;
    position: relative;
  }

  .topL {
    width: 20px;
    height: 20px;
    border-top-width: 2px;
    border-top-color: #26c6f0;
    border-top-style: solid;
    border-left-width: 2px;
    border-left-color: #26c6f0;
    border-left-style: solid;
    position: absolute;
    top: -2px;
    left: -2px;
  }

  .topR {
    width: 20px;
    height: 20px;
    border-top-width: 2px;
    border-top-color: #26c6f0;
    border-top-style: solid;
    border-right-width: 2px;
    border-right-color: #26c6f0;
    border-right-style: solid;
    position: absolute;
    top: -2px;
    right: -2px;
  }

  .bottomL {
    width: 20px;
    height: 20px;
    border-bottom-width: 2px;
    border-bottom-color: #26c6f0;
    border-bottom-style: solid;
    border-left-width: 2px;
    border-left-color: #26c6f0;
    border-left-style: solid;
    position: absolute;
    bottom: -2px;
    left: -2px;
  }

  .bottomR {
    width: 20px;
    height: 20px;
    border-bottom-width: 2px;
    border-bottom-color: #26c6f0;
    border-bottom-style: solid;
    border-right-width: 2px;
    border-right-color: #26c6f0;
    border-right-style: solid;
    position: absolute;
    bottom: -2px;
    right: -2px;
  }


  .data-title-left, .data-title-right {
    font-family: "微软雅黑";
    font-size: 16px;
  }

  .data-title {
    width: 178px;
    margin: -18px auto 0 auto;
    color: #83c7e3;
    font-size: 20px;
  }

  .data-title span {
    margin: 0 15px;
  }
</style>
