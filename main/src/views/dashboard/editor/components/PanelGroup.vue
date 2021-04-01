<template>
  <el-row class="panel-group">
    <div class="card-panel">
      <div class="card-panel-icon-wrapper" @click="handleSetLineChartData('/zabbix/alarm-tables')">
        <svg-icon icon-class="dashboard_group1" class-name="icon-group1"/>
        <div class="card-panel-description">
          <div class="card-panel-text">当前报警数</div>
          <count-to :start-val="0" :end-val=panelgroup.alarm_sum :duration="3200" class="card-panel-num"/>
        </div>
      </div>
      <div class="card-panel-icon-wrapper" @click="handleSetLineChartData('/cmdb/resoucre')">
        <svg-icon icon-class="dashboard_group2" class-name="icon-group2"/>
        <div class="card-panel-description">
          <div class="card-panel-text">服务器总数</div>
          <count-to :start-val="0" :end-val=panelgroup.server_sum :duration="2600" class="card-panel-num"/>
        </div>
      </div>
      <div class="card-panel-icon-wrapper" @click="handleSetLineChartData('/cmdb/index1_app/app')">
        <svg-icon icon-class="dashboard_group3" class-name="icon-group3"/>
        <div class="card-panel-description">
          <div class="card-panel-text">APP总数</div>
          <count-to :start-val="0" :end-val=panelgroup.app_sum :duration="3000" class="card-panel-num"/>
        </div>
      </div>
      <div class="card-panel-icon-wrapper" @click="handleSetLineChartData('/workflow/workflow_list')">
        <svg-icon icon-class="dashboard_group4" class-name="icon-group4" />
        <div class="card-panel-description">
          <div class="card-panel-text">待办申请单</div>
          <count-to :start-val="0" :end-val="panelgroup.need_to_do"  :duration="1000" class="card-panel-num"/>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
  import CountTo from 'vue-count-to'
  import {fetchList} from '@/api/db'
  import {getWorkFlows} from '@/api/workflow/app_manage'

  export default {
    components: {
      CountTo
    },
    data() {
      return {
        panelgroup: {
          server_sum: 0,
          app_sum: 0,
          alarm_sum: 0,
          monitor_server_sum: 0,
          need_to_do: 0,
        }
      }
    },
    created() {
      this.getList();
    },
    activated() {
      this.getList();
    },
    methods: {
      handleSetLineChartData(url) {
        this.$emit('handleSetLineChartData', url)
      },
      getList() {
        fetchList().then(response => {
          this.panelgroup.server_sum = response.data.server_sum
          this.panelgroup.app_sum = response.data.app_sum
          this.panelgroup.alarm_sum = response.data.alarm_sum
        });
        getWorkFlows().then(response => {
          this.panelgroup.need_to_do = response.count
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .panel-group {
    padding:20px;

    .card-panel {
      float:left;
      width: 100%;
      height: 110px;
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);

      .card-panel-icon-wrapper {
        float: left;
        width: 25%;
        height: 100%;
        transition: all 0.38s ease-out;
        // border-right: 2px solid #F8F8F8;
        //居中
        display:flex;
        flex-direction:row;
        justify-content:center;
        align-items:center;
      }
      // .svg-icon {
      //   font-size:100px;
      //   padding:15px;
      // }
      .icon-group1:hover {
        background: #FF661F;
      }
      .icon-group2:hover {
        background: #0168FF;
      }
      .icon-group3:hover {
        background: #00BA95;
      }
      .icon-group4:hover {
        background: #FFA71D;
      }

      .card-panel-description {
        float: left;
        margin: 15px 20px;

        .card-panel-text {
          color: #888888;
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          color: #6D7278;
          font-weight: bold;
          font-size: 40px;
          font-family:SimSun ;
        }
      }
    }
  }
  // @media (max-width: 1920px){
    .svg-icon {
      font-size:100px;
      padding:15px;
    }
  // }
  @media (max-width: 1350px){
    .svg-icon {
      font-size:50px;
      padding:5px;
    }
  }
  @media (max-width: 1200px){
    .svg-icon {
      font-size:100px;
      padding:15px;
    }
    .card-panel-description {
      display: none;
    }
  }
</style>
