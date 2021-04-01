<template>
  <div class="app-container">
    <div>
      <el-button type="text" icon="el-icon-back" @click="handleBack">返回</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      实例信息：{{ ip }}
    </div>

    <el-form :model="historySearch" :inline="true" style="padding-top:10px;">
      <el-form-item prop="startime">
        <el-date-picker
          v-model="historySearch.startime"
          type="date"
          placeholder="监控时间"
          align="right"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endtime">
        <el-date-picker
          v-model="historySearch.endtime"
          type="date"
          placeholder="对比时间"
          align="right"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="renderline(0)">搜索</el-button>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" plain @click="renderline(3)">三天</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  plain @click="renderline(5)">五天</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="renderline(7)">七天</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col :span="12" >
        <chart ref="chart1" id="id1" style="width:100%;height:300px;" title="负载" v-bind:host_id="historySearch"
                url="midmonitor/es/get_history1"/>
      </el-col>
      <el-col :span="12">
        <chart ref="chart2" id="id2" style="width:100%;height:300px;" title="CPU使用率" v-bind:host_id="historySearch"
                url="midmonitor/es/get_history2"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <chart ref="chart3" id="id3" style="width:100%;height:300px;" title="内存使用率" v-bind:host_id="historySearch"
                url="midmonitor/es/get_history3"/>
      </el-col>
      <el-col :span="12">
        <chart ref="chart4" id="id4" style="width:100%;height:300px;" title="文件描述符" v-bind:host_id="historySearch"
                url="midmonitor/es/get_history4"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <chart ref="chart5" id="id5" style="width:100%;height:300px;" title="线程数" v-bind:host_id="historySearch"
                url="midmonitor/es/get_history5"/>
      </el-col>
      <el-col :span="12">
        <chart ref="chart6" id="id6" style="width:100%;height:300px;" title="磁盘使用率" v-bind:host_id="historySearch"
                url="midmonitor/es/get_history6"/>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import Chart from '@/components/Charts/LineHistory'

const pickerOptions={
  disabledDate(time) {
    return time.getTime() > Date.now();
  },
  shortcuts: [{
    text: '今天',
    onClick(picker) {
      picker.$emit('pick', new Date());
    }
  }, {
    text: '昨天',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      picker.$emit('pick', date);
    }
  }, {
    text: '一周前',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', date);
    }
  }]
}

export default {
  components: { Chart },
  directives: { waves },
  mixins: [resize],

  data() {
    return {
      ip: undefined,

      pickerOptions: pickerOptions,

      historySearch:{
        rid: undefined,
        startime: undefined,
        endtime: undefined,
        days: ''
      },

    }
  },

  created() {
    if (this.$route.params.id){
      localStorage.setItem("es_id", this.$route.params.id);
      localStorage.setItem("es_ipinfo", this.$route.params.ip);
    }
    this.historySearch.rid=localStorage.getItem("es_id")
    this.ip=localStorage.getItem("es_ipinfo")

  },

  mounted() {
  },

  methods: {
    renderline(days) {
      this.historySearch.days = days
      // console.log(this.historySearch)
      this.$refs.chart1.render( this.historySearch )
      this.$refs.chart2.render( this.historySearch )
      this.$refs.chart3.render( this.historySearch )
      this.$refs.chart4.render( this.historySearch )
      this.$refs.chart5.render( this.historySearch )
      this.$refs.chart6.render( this.historySearch )

    },

    handleBack() {
      this.$router.push({ name: 'es_instance_monitor'})
    },

  }

}
</script>

<style scoped>
</style>