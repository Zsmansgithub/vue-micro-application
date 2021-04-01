<template>
  <div class="app-container">
    <el-form :model="historySearch" inline>
      <el-form-item prop="cluster_name">
        <el-select
          v-model="historySearch.cluster_id"
          placeholder="集群名"
          filterable
          class="filter-item"
          @change="handleChange"
        >
          <el-option
            v-for="item in clusterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

      </el-form-item>
      <el-form-item prop="topic_name_s">
        <el-select
          v-model="historySearch.topic_name_s"
          placeholder="Topic名称"
          filterable
          clearable
          class="filter-item"
          style="width: 300px"
        >
          <el-option
            v-for="item in select1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

      </el-form-item>
      <el-form-item>
        <el-select v-model="historySearch.consumer_name_s" placeholder="Consumer名称" filterable clearable
                   class="filter-item" style="width: 300px">
          <el-option v-for="item in select2" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="monitor_time">
        <el-date-picker
          v-model="historySearch.monitor_time"
          type="date"
          placeholder="监控时间"
          align="right"
          value-format="timestamp"
          :picker-options="pickerOptions2">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="reference_time">
        <el-date-picker
          v-model="historySearch.compare_time"
          type="date"
          placeholder="对比时间"
          align="right"
          value-format="timestamp"
          :picker-options="pickerOptions2">
        </el-date-picker>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
<!--      <el-form-item>-->
<!--        <el-button type="primary"  plain @click="handleReset">重置</el-button>-->
<!--      </el-form-item>-->
      <el-form-item>

        <el-tooltip class="item" effect="light"  placement="bottom-end">
              <span slot="content" v-for="item in brokerinfo.master">
                {{ item[0] +':'+ item[1] }}
              </span>
          <el-button type="primary" plain>M</el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
                <el-tooltip class="item" effect="light"  placement="bottom-end">
              <span slot="content" v-for="item in brokerinfo.slave">
                {{ item[0] +':'+ item[1] }}
              </span>
        <el-button type="primary" plain>S</el-button>
       </el-tooltip>
      </el-form-item>
      <el-form-item>
                <el-tooltip class="item" effect="light"  placement="bottom-end">
              <span slot="content" v-for="item in brokerinfo.name">
                {{ item[0] +':'+ item[1] }}
              </span>
        <el-button type="primary" plain>N</el-button>
                   </el-tooltip>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card el-card class="box-card">
          <chart ref="chart1" id="id1" @func="getMsgFormSon" title="集群生产消费总量" style="width:100%;height:280px;"
                 v-bind:host_id="historySearch"
                 url="/midmonitor/broker_history_list"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card el-card class="box-card">
          <chart ref="chart2" id="id2" @func="getMsgFormSon" title="集群延迟总量" style="width:100%;height:280px;" v-bind:host_id="historySearch"
                 url="/midmonitor/broker_delay_history"/>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <el-tabs v-model="activeName"  type="border-card" @tab-click="tabcardClick">
      <el-tab-pane ref="parent" label="Topic生产消费数据" name="first">
        <el-table v-loading="listLoading" :data="topicdata" border stripe highlight-current-row style="width: 100%"
                  :default-sort = "{prop: 'offset', order: 'descending'}">
          <el-table-column type="expand" width="35">
            <template slot-scope="props">
              <el-table :data="props.row.consumer_detail" border stripe highlight-current-row
                        style="width: 100%" :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                        :row-style="{background:'#ecf5ff',color:'#606266'}">
                <el-table-column label="Topic名" prop="topic_name"  min-width="120"></el-table-column>
                <el-table-column label="消费组名" prop="consumer_name"  min-width="120"></el-table-column>
                <el-table-column label="生产量" prop="product_msg"  min-width="120"></el-table-column>
                <el-table-column label="消费量" prop="consumer_offset"  min-width="120"></el-table-column>
                <el-table-column label="延迟量" prop="consumer_diff"  min-width="120"></el-table-column>
                <el-table-column label="详情" prop="time" align="center" min-width="75">
                  <template slot-scope="scope">
                    <el-button type="text" @click.native.prevent="tcDetailRow(scope.row)">
                      <svg-icon icon-class="data1" style="width: 14px; height:16px;color:#1890FF;"/>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="Topic名/用途" prop="topic_name" min-width="180">
            <template slot-scope="scope">
              <span>{{scope.row.topic_name}}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.comment}}</div>
            </template>
          </el-table-column>
<!--          <el-table-column label="Topic描述" prop="comment" min-width="120"></el-table-column>-->
          <el-table-column label="每分钟生产量" prop="offset"  sortable min-width="120"></el-table-column>
          <el-table-column label="每分钟消费量" prop="consumer_offset"  sortable min-width="120"></el-table-column>
          <el-table-column label="延迟量" prop="diff_total"  sortable min-width="120"></el-table-column>
          <el-table-column label="消费者数量" prop="consumer_sum"  sortable min-width="120"></el-table-column>
          <el-table-column label="监控时间" prop="time" align="center" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="详情" align="center" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click.native.prevent="editRow(scope.row)"></el-button>
              <el-button type="text" @click.native.prevent="openRow(scope.row)">
                <svg-icon icon-class="data1" style="width: 14px; height:16px;color:#1890FF;"/>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getTopicList"
          style="padding-top: 5px;margin-top: 10px;"
        />
      </el-tab-pane>
      <el-tab-pane ref="parent" label="Consume消费量数据" name="first2">
        <el-table v-loading="listLoading" :data="consumedata" border stripe highlight-current-row style="width: 100%"
        :default-sort="{prop: 'diff_total', order: 'descending'}">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.topic_detail" border stripe highlight-current-row
                        style="width: 100%" :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                        :row-style="{background:'#ecf5ff',color:'#606266'}">
                <el-table-column label="消费组名" prop="consumer_name"  min-width="120"></el-table-column>
                <el-table-column label="Topic名" prop="topic_name"  min-width="120"></el-table-column>
                <el-table-column label="生产量" prop="product_msg"  min-width="80"></el-table-column>
                <el-table-column label="消费量" prop="consumer_offset" min-width="80"></el-table-column>
                <el-table-column label="延迟量" prop="consumer_diff" min-width="80"></el-table-column>
                <el-table-column label="ClientIp" prop="clientip" min-width="80">
                  <template slot-scope="scope">
                    <a style="color: #1890ff" @click="display_clientip(scope.row.clientip)">点击查看</a>
                  </template>
                </el-table-column>
                <el-table-column label="状态" min-width="50" align="center">
                  <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status===0">启用</el-tag>
                    <el-tag type="error" v-else>禁用</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="详情" prop="time" align="center" min-width="80">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="禁用" placement="top" :hide-after="300">
                      <el-button type="text" @click="suspendCommon(scope.row)" v-if="scope.row.status===0">
                        <svg-icon icon-class="suspend1" style="width: 16px; height:16px;color:#FFBA00;"/>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="启用" placement="top" :hide-after="300">
                      <el-button type="text" @click="suspendCommon(scope.row)" v-if="scope.row.status===1">
                        <svg-icon icon-class="play1" style="width: 16px; height:16px;color:#42B983;"/>
                      </el-button>
                    </el-tooltip>
                    <el-button type="text" @click.native.prevent="tcDetailRow(scope.row)">
                      <svg-icon icon-class="data1" style="width: 14px; height:16px;color:#1890FF;"/>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="consume_name" sortable label="消费组名/用途" min-width="180">
            <template slot-scope="scope">
              <span>{{scope.row.consume_name}}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.comment}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="produce_massage_values" sortable label="每分钟生产量"></el-table-column>
          <el-table-column prop="consumers_total" sortable label="每分钟消费量"></el-table-column>
          <el-table-column prop="consume_tps" sortable label="消费量TPS"></el-table-column>
          <el-table-column prop="diff_total" sortable label="延迟量"></el-table-column>
          <el-table-column prop="topic_sum" sortable label="Topic个数"></el-table-column>
          <el-table-column label="堆积时间/条数" prop="level" min-width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.level&&JSON.parse(scope.row.level)['time']">{{JSON.parse(scope.row.level)['time']+'分钟'}}</span>
<!--              <span v-else></span>-->
<!--              <span>{{scope.row.level}}</span>-->
              <div v-if="scope.row.level" style="color: #8492a6; font-size: 10px">{{JSON.parse(scope.row.level)['count']}}</div>
            </template>
          </el-table-column>
          <el-table-column label="tps/联系人" prop="is_alarm" min-width="120">
            <template slot-scope="scope">
<!--              <span v-if="scope.row.level">{{'大于'+JSON.parse(scope.row.level)['gte_tps']+' | 小于'+JSON.parse(scope.row.level)['lte_tps']}}</span>-->
              <span v-if="scope.row.level&&JSON.parse(scope.row.level)['gte_tps']">{{'大于'+JSON.parse(scope.row.level)['gte_tps']}}</span>
              <span v-if="scope.row.level&&JSON.parse(scope.row.level)['lte_tps']">{{' | 小于'+JSON.parse(scope.row.level)['lte_tps']}}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.alarm_user_info}}</div>
            </template>
          </el-table-column>
          <el-table-column label="告警" width="50">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.is_alarm===0">是</el-tag>
              <el-tag type="error" v-else>否</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="监控时间" sortable prop="time" align="center" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="详情" align="center" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click.native.prevent="edittcDetailRow(scope.row)"/>
              <el-button type="text" @click.native.prevent="consumerDetail(scope.row)">
                <svg-icon icon-class="data1" style="width: 14px; height:16px;color:#1890FF;"/>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totals>0"
          :total="totals"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getConsumeList"
          style="padding-top: 5px;margin-top: 10px;"
        />
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible" custom-class="rocketmqd" @open="dopen" :title="dtitle" width="70%" style="text-align: left">
      <el-form :model="historySearch" inline>
        <el-form-item prop="monitor_time">
          <el-date-picker
            v-model="historySearch.monitor_time"
            type="date"
            placeholder="监控时间"
            align="right"
            value-format="timestamp"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="reference_time">
          <el-date-picker
            v-model="historySearch.compare_time"
            type="date"
            placeholder="对比时间"
            align="right"
            value-format="timestamp"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="topichistorysearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="24">
          <chart ref="chartd11" id="dchart1" title="" style="width:100%;height:400px;" v-bind:host_id="historySearch"
             url="/midmonitor/topic_history_tables"/>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleTopicDetail"  custom-class="rocketmqd" @open="dopen" :title="dtitle" width="70%" style="text-align: left">
      <el-form :model="historySearch" inline>
        <el-form-item prop="monitor_time">
          <el-date-picker
            v-model="historySearch.monitor_time"
            type="date"
            placeholder="监控时间"
            align="right"
            value-format="timestamp"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="reference_time">
          <el-date-picker
            v-model="historySearch.compare_time"
            type="date"
            placeholder="对比时间"
            align="right"
            value-format="timestamp"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="topicconsumerhistorysearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <chart ref="chartd22" id="dchart2" title="" style="width:100%;height:400px;" v-bind:host_id="historySearch"
             url="/midmonitor/tc_history"/>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleConsumer" custom-class="rocketmqd"  width="70%" :title="dtitle" style="text-align: left">
      <el-form :model="historySearch" inline>
        <el-form-item prop="monitor_time">
          <el-date-picker
            v-model="historySearch.monitor_time"
            type="date"
            placeholder="监控时间"
            align="right"
            value-format="timestamp"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="reference_time">
          <el-date-picker
            v-model="historySearch.compare_time"
            type="date"
            placeholder="对比时间"
            align="right"
            value-format="timestamp"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="consumerhistorysearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <chart ref="dchart33" id="dchart33" title=""  style="width:100%;height:400px;" v-bind:host_id="historySearch"
             url="/midmonitor/consumer_history"/>
    </el-dialog>
    <el-dialog title="编辑描述" :visible.sync="dialogVisibleComment" width="450px">
      <el-form ref="remarkForm" :model="remarkForm" class="remarkForm" label-width="100px">
        <el-form-item label="Topic描述" style="width: 400px">
          <el-input v-model="remarkForm.comment"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <el-button @click="dialogVisibleComment=false">取 消</el-button>
        <el-button type="primary" @click="edit_remark()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑描述" :visible.sync="dialogVisibleConsumerComment" width="450px">
      <el-form ref="commentForm" :model="commentForm" class="commentForm" label-width="120px" :rules="rules">
        <el-form-item label="是否告警">
          <el-select v-model="commentForm.is_alarm" style="width: 100%">
            <el-option v-for="item in alarmOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="堆积时间">
          <label slot="label">
            <el-tooltip class="item" effect="dark" content="" placement="top-end">
              <div slot="content">满足所填堆积时间、堆积条数、消费tps正常范围三个条件任何一个都会发送报警</div>
              <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
            </el-tooltip>
            堆积时间
          </label>
          <el-select v-model="commentForm.time" allow-create filterable clearable default-first-option style="width: 100%">
            <el-option value="1" label="1分钟"></el-option>
            <el-option value="5" label="5分钟"></el-option>
            <el-option value="10" label="10分钟"></el-option>
            <el-option value="30" label="半小时"></el-option>
            <el-option value="120" label="两小时"></el-option>
            <el-option value="1440" label="一天"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="堆积条数">
          <el-input v-model="commentForm.count" type="number" style="width: 100%;">
            <template slot="append">条</template>
          </el-input>
        </el-form-item>
        <el-form-item label="消费tps正常范围">
          <el-input v-model="commentForm.gte_tps" type="number" style="width: 100%;">
            <template slot="append">大于</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="commentForm.lte_tps" type="number" style="width: 100%;">
            <template slot="append">小于</template>
          </el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="alarm_user">
          <el-select v-model="commentForm.alarm_user" placeholder="联系人" filterable clearable multiple style="width: 100%">
            <el-option v-for="(item,index) in userOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用途描述">
          <el-input v-model="commentForm.comment" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <el-button @click="dialogVisibleConsumerComment=false">取 消</el-button>
        <el-button type="primary" @click="edit_consumer()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Client信息" :visible.sync="dialogVisibleClient" width="30%">
<!--      <el-form :model="clientForm">-->
<!--        <el-form-item>-->
          <el-input v-model="client_ip" style="width: 100%" type="textarea" :rows="20" :readonly="true"></el-input>
<!--        </el-form-item>-->
<!--      </el-form>-->
    </el-dialog>
  </div>
</template>

<script>
  import {
    editConsumerConf,
    editConsumerTopic,
    editTopicConf,
    fetchBorkerInfo,
    fetchClusterInfo,
    fetchConsumeTable,
    fetchTopicTable,
    getConsumerName,
    getTopicName
  } from '@/api/midmonitor/base'
  import {getUserInfo} from '@/api/midmonitor/cluster_config'
  import waves from '@/directive/waves'
  import Pagination from '@/components/Pagination'
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import Chart from '@/components/Charts/LineHistory'
  import {mapGetters} from 'vuex'

  const pickerOptions = {
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
  let debounce;
  export default {
    name: 'RoctetmqMonitor',
    components: {
      Pagination, Chart
    },
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        activeName: 'first',
        topicdata: [],
        consumedata: [],
        userOptions:[],
        alarmOptions:[{'label':'是','value':0},{'label':'否', 'value':1}],
        listQuery: {
          page: 1,
          limit: 20,
          cluster_id: 1,
          topic_id:undefined,
          consumers_id:undefined,
          time: undefined

        },
        total: 0,
        totals: 0,
        dtitle: '生产量',
        listLoading: false,
        dialogVisible: false,
        dialogVisibleTopicDetail: false,
        dialogVisibleConsumer: false,
        dialogVisibleComment: false,
        dialogVisibleConsumerComment: false,
        dialogVisibleClient: false,
        brokerinfo:{},
        historySearch: {
          cluster_id: 1,
          topic_name_s: undefined,
          monitor_time: undefined,
          consumer_name_s: undefined,
          compare_time: undefined
        },
        remarkForm:{
          id:'',
          cluster_name:'',
          comment:''
        },
        commentForm:{
          id:'',
          is_alarm:'',
          alarm_user:'',
          level:'',
          comment:'',
          time:'',
          count:'',
          gte_tps:'',
          lte_tps:'',
        },
        statusForm:{
          id:'',
          status:''
        },
        pickerOptions2: pickerOptions,
        clusterOptions: [],
        topicOptions: [],
        consumerOptions: [],
        select1: [],
        select2: [],
        once: 0,
        client_ip:'',
        rules:{
          alarm_user:[{ max: 50, message: '长度不超过50 个字符', trigger: 'blur' }]
        },
      }
    },
    watch: {
      historySearch: {
        handler(newVal) {
          sessionStorage.setItem(`${this.$route.fullPath.replace(/\//g, '_')}_historySearch`, JSON.stringify(newVal));
        },
        deep: true,
      }
    },
    created() {
      if (this.$route.query.cid) {
        this.historySearch.cluster_id=parseInt(this.$route.query.cid)
        this.listQuery.cluster_id=this.$route.query.cid
      }
      const sessionHistorySearch = sessionStorage.getItem(`${this.$route.fullPath.replace(/\//g, '_')}_historySearch`)
      this.historySearch = sessionHistorySearch ? JSON.parse(sessionHistorySearch) : this.historySearch
      getUserInfo().then(response => {
      this.userOptions = response
    })
    },
    mounted() {
      this.getClusterInfo()
      // this.getTopicList()
      this.getBrokerList()
      this.getTopic()
      this.getConsumer()
      // this.getConsumeList()
      // this.handleChange(this.historySearch.cluster_id)
    },
    computed: {
      ...mapGetters(['name']),
    },
    methods: {
      display_clientip(row){
        this.dialogVisibleClient=true
        this.client_ip=row
      },
      getConsumer(){
        getConsumerName().then(res=>{
          this.consumerOptions=res.data
          this.handleChange(this.historySearch.cluster_id)
        })
      },
      suspendCommon(row) {
        this.statusForm.id=row.consumers_topic_id
        this.statusForm.change_user=this.name
        if (row.status === 0) {
          this.statusForm.status = 1
          const msg = '确定要禁用该consumer信息吗?禁用后星辰将不再进行监控'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            editConsumerTopic(this.statusForm.id,this.statusForm).then(res => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.getConsumeList()
            }).catch(err => {
              this.$message({
                message: err,
              });
            });
          })
        } else {
          this.statusForm.status = 0
          const msg = '确定要启用该consumer信息吗?启用后将正常进行监控'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            editConsumerTopic(this.statusForm.id,this.statusForm).then(res => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.getConsumeList()
            }).catch(err => {
              this.$message({
                message: err,
              });
            });
          })
        }
      },
      edit_consumer(){
        if (this.commentForm.alarm_user!=='null') {
          if (this.commentForm.alarm_user.length>8) {
            return this.$message({
              title:'错误',
              message:'联系人不得超过8人',
              type:'error'
            })
          }
          this.commentForm.alarm_user=this.commentForm.alarm_user.toString()
        }
        this.commentForm.change_user=this.name
        this.commentForm.level={
          time:this.commentForm.time,
          count:this.commentForm.count,
          gte_tps:this.commentForm.gte_tps,
          lte_tps:this.commentForm.lte_tps,
        }
        this.commentForm.level=JSON.stringify(this.commentForm.level)
        editConsumerConf(this.commentForm.id,this.commentForm).then(res=>{
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 3000
          })
          this.getConsumeList()
        }).catch(response => {
          this.$msgbox({
            title: '消息',
            message: response.re.message,
          })
        })
        this.dialogVisibleConsumerComment = false
      },
      edittcDetailRow(row){
        this.dialogVisibleConsumerComment=true
        this.commentForm.id=row.consumers_id
        if (row.alarm_user) {
          this.commentForm.alarm_user=row.alarm_user.split(',')
        }else {
          this.commentForm.alarm_user=row.alarm_user
        }
        this.commentForm.is_alarm=row.is_alarm
        this.commentForm.comment=row.comment
        if (row.level) {
          const level = JSON.parse(row.level)
          this.commentForm.time = level.time
          this.commentForm.count = level.count
          this.commentForm.gte_tps = level.gte_tps
          this.commentForm.lte_tps = level.lte_tps
        }else {
          this.commentForm.time = ''
          this.commentForm.count = ''
          this.commentForm.gte_tps = ''
          this.commentForm.lte_tps = ''
        }
      },
      edit_remark() {
        editTopicConf(this.remarkForm.id, this.remarkForm).then(res => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 3000
          })
          this.getTopicList()
        }).catch(response => {
          this.$msgbox({
            title: '消息',
            message: response.re.message,
          })
        })
        this.dialogVisibleComment = false
      },
      editRow(row){
        this.dialogVisibleComment=true
        this.remarkForm.comment=row.comment
        this.remarkForm.id=row.topic_id
        this.remarkForm.cluster_name=row.cluster_id
      },
      getClusterInfo(){
        fetchClusterInfo().then(request => {
          this.clusterOptions = request.data
          });
      },
      handleChange(pro) {
        if(debounce) clearTimeout(debounce);
        debounce = setTimeout(this.handleChange1, 500, pro);
      },
      handleChange1(pro) {
        if (this.once > 1 || !sessionStorage.getItem(`${this.$route.fullPath.replace(/\//g, '_')}_historySearch`)) {
          // this.historySearch.topic_name_s = undefined
          // this.historySearch.consumer_name_s = undefined
        }
        if (this.topicOptions[pro]) {
          this.select1 = this.topicOptions[pro]
        } else {
          this.select1 = []
        }
        if (this.consumerOptions[pro]) {
          this.select2 = this.consumerOptions[pro]
        } else {
          this.select2 = []
        }
        this.listQuery.cluster_id  = this.historySearch.cluster_id
        this.search();
        this.once++;
      },
      search() {
        this.listQuery.cluster_id = this.historySearch.cluster_id
        this.$refs.chart1.render(this.historySearch);
        this.$refs.chart2.render(this.historySearch);
        this.getTopicList()
        this.getConsumeList()
        this.getBrokerList()

      },
      topichistorysearch(){
          this.$refs.chartd11.render(this.historySearch);
      },

      topicconsumerhistorysearch(){
          this.$refs.chartd22.render(this.historySearch);
      },
      consumerhistorysearch(){
          this.$refs.dchart33.render(this.historySearch);
      },
      openRow(row) {
        this.dtitle = row.topic_name + '生产量'
        this.dialogVisible = true
        this.historySearch.rid = row.topic_id

        setTimeout(() => {
          this.$refs.chartd11.render(this.historySearch);
        }, 1.5 * 1000)

      },
      tcDetailRow(row) {
        this.dtitle = row.topic_name + '生产量消费量';
        this.dialogVisibleTopicDetail = true;
        this.historySearch.rid = row.consumers_topic_id
        setTimeout(() => {
          this.$refs.chartd22.render(this.historySearch);
        }, 1.5 * 2000)
      },
      consumerDetail(row) {
        this.dtitle = row.consume_name + '消费量'
        this.dialogVisibleConsumer = true
        this.historySearch.rid = row.consumers_id
        setTimeout(() => {
          this.$refs.dchart33.render(this.historySearch);
        }, 1.5 * 1000)
      },
      getTopicList(stime) {
        this.listLoading = true
        if (typeof(stime)=='number'){
          this.listQuery.time = stime
        }
        this.listQuery.topic_id = this.historySearch.topic_name_s
        fetchTopicTable(this.listQuery).then(response => {
          this.topicdata = response.data.results
          this.total = response.data.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getConsumeList() {
        this.listLoading = true
        this.listQuery.consumers_id=this.historySearch.consumer_name_s
        fetchConsumeTable(this.listQuery).then(response => {
          this.consumedata = response.data.results
          this.totals = response.data.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getBrokerList() {
        fetchBorkerInfo(this.listQuery).then(response => {
          this.brokerinfo=response.data
        })
      },
      getTopic() {
        getTopicName().then(response => {
          this.topicOptions = response.data
          this.handleChange(this.historySearch.cluster_id)
        })
      },
      getMsgFormSon(data) {
        this.getTopicList(data[0] / 1000)
        this.getConsumeList()
      },
      dopen(msq) {
        this.historySearch.temptime=new Date()
      },
      tabcardClick(){
        this.historySearch.temptime=new Date()
      },
      handleReset() {

      }
    },
    beforeRouteLeave (to, from, next) {
      const visitedViews = this.$store.getters.visitedViews;
      if (!visitedViews.find((val) => val.fullPath === from.fullPath)) sessionStorage.removeItem(`${from.fullPath.replace(/\//g, '_')}_historySearch`);
      next();
    },
  }
</script>
<style lang="scss" scoped>
.rocketmqd {
  .el-dialog__body {
    padding-top: 1px !important;
  }
  .el-form-item {
    margin-bottom: 2px;
  }
  .el-form--inline {
    padding-left: 60px;
  }
  .el-dialog__header {
    padding-left: 80px !important;
    padding:10px;
  }

}
</style>
