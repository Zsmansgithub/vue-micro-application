<template>
  <div>
    <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="130px" class="newAppForm" style="width:100%">
      <el-row>
        <el-col :span="12" class="col-1400-8 col-1400-offset-2">
          <el-form-item label="内网防火墙" prop="onORoff">
            <el-switch v-model="newAppForm.onORoff"
              active-text="开通" inactive-text="不开通" active-value="0" inactive-value="1" @change="changefirewall()">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="newAppForm.onORoff == '0'">
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="目的端集群">
              <span style="color:red;">
                ES、MQ、mysql、oracle、mongodb、redis，请通过集群添加目的端信息
                （若选择 mysql、oracle、mongodb、redis 集群，请与dba确认）
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="ES" prop="eslist">
              <el-select v-model="newAppForm.eslist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(newAppForm.eslist,esOptions,3)"
              @visible-change="esOptions2 = esOptions" :filter-method="((val)=>{clusterSearch(val,esOptions,3)})">
                <el-option v-for="item in Object.keys(esOptions2)" :label="item" :value="item" :key="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="MQ" prop="mqlist">
              <el-select v-model="newAppForm.mqlist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(newAppForm.mqlist,mqOptions,4)"
              @visible-change="mqOptions2 = mqOptions" :filter-method="((val)=>{clusterSearch(val,mqOptions,4)})">
                <el-option v-for="item in Object.keys(mqOptions2)" :label="item" :value="item" :key="item"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="mysql" prop="mysqllist">
              <el-select v-model="newAppForm.mysqllist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(newAppForm.mysqllist,mysqlOptions,5)"
              @visible-change="mysqlOptions2 = mysqlOptions" :filter-method="((val)=>{clusterSearch(val,mysqlOptions,5)})">
                <el-option v-for="item in Object.keys(mysqlOptions2)" :label="item" :value="item" :key="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="oracle" prop="oraclelist">
              <el-select v-model="newAppForm.oraclelist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(newAppForm.oraclelist,oracleOptions,6)"
              @visible-change="oracleOptions2 = oracleOptions" :filter-method="((val)=>{clusterSearch(val,oracleOptions,6)})">
                <el-option v-for="item in Object.keys(oracleOptions2)" :label="item" :value="item" :key="item"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="mongodb" prop="mongodblist">
              <el-select v-model="newAppForm.mongodblist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(newAppForm.mongodblist,mongodbOptions,7)"
              @visible-change="mongodbOptions2 = mongodbOptions" :filter-method="((val)=>{clusterSearch(val,mongodbOptions,7)})">
                <el-option v-for="item in Object.keys(mongodbOptions2)" :label="item" :value="item" :key="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="redis" prop="redislist">
              <el-select v-model="newAppForm.redislist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(newAppForm.redislist,redisOptions,8)"
              @visible-change="redisOptions2 = redisOptions" :filter-method="((val)=>{clusterSearch(val,redisOptions,8)})">
                <el-option v-for="item in Object.keys(redisOptions2)" :label="item" :value="item" :key="item"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="其他集群" prop="elselist">
              <el-select v-model="newAppForm.elselist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtableelse(newAppForm.elselist,9)"
              @visible-change="elseOptions2 = elseOptions":filter-method="((val)=>{elseclusterSearch(val,elseOptions)})">
                <el-option-group v-for="group in Object.keys(elseOptions2)" :key="group" :label="group">
                  <el-option v-for="item in Object.keys(elseOptions2[group])" :label="item" :value="group+'+'+item" :key="item"/>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col  :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="目的端信息">
              <el-table :data="newAppForm.dtable">
                <el-table-column prop="esmqname" label="名称/集群类型"  align="center" min-width="6">
                  <template slot-scope="scope">
                    <div style="line-height: 16px;">
                      <span style="display: block;">{{scope.row.cluster_name}}</span>
                      <div style="color: #8492a6; font-size: 10px">
                        <span>{{scope.row.cluster_type}}</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="ip" label="目的域名或IP"  align="center" min-width="8">
                  <template slot-scope="scope">{{scope.row.ip}}</template>
                </el-table-column>
                <el-table-column prop="port" label="目的端口"  align="center" min-width="8">
                  <template slot-scope="scope">{{scope.row.port}}</template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {get_all_ipport} from '@/api/workflow/app_manage'

  export default {
    data() {
      return {
        esOptions:[],
        mqOptions:[],
        mysqlOptions:[],
        oracleOptions:[],
        mongodbOptions:[],
        redisOptions:[],
        elseOptions:{},
        // 关键字搜索后的options
        esOptions2:[],
        mqOptions2:[],
        mysqlOptions2:[],
        oracleOptions2:[],
        mongodbOptions2:[],
        redisOptions2:[],
        elseOptions2:{},
        // props: {
        //   newAppForm: {
        //     type: Object,
        //     default () {
        //       return {}
        //     }
        //   },
        // },
        newAppForm: {
          onORoff:'1',
          steplinestatus:'1',
          eslist:[],
          mqlist:[],
          mysqllist:[],
          oraclelist:[],
          mongodblist:[],
          redislist:[],
          elselist:[],
          dtable:[],
        },
        rules: {},
      }
    },
    created() {
      get_all_ipport().then(response => {
        this.esOptions = response.ES
        this.mqOptions = response.MQ
        this.mysqlOptions = response.mysql
        this.oracleOptions = response.oracle
        this.mongodbOptions = response.mongodb || []
        this.redisOptions = response.Redis
        this.elseOptions = {}
        for (let key in response) {
          if (key !== 'ES' && key !== 'MQ' && key !== 'mysql' && key !== 'oracle' && key !== 'mongodb' && key !== 'Redis') {
            this.elseOptions[key] = response[key]
          }
        }
      });
    },
    methods: {
      resetForm() {
        this.$refs['newAppForm'].resetFields()
        this.newAppForm.dtable = [];
      },
      setnewAppForm(data){
        this.newAppForm.steplinestatus = data.steplinestatus
        this.newAppForm.onORoff = data.onORoff
        this.newAppForm.eslist = data.eslist
        this.newAppForm.mqlist = data.mqlist
        this.newAppForm.mysqllist = data.mysqllist
        this.newAppForm.oraclelist = data.oraclelist
        this.newAppForm.mongodblist = data.mongodblist
        this.newAppForm.redislist = data.redislist
        this.newAppForm.elselist = data.elselist
        this.newAppForm.dtable = data.dtable
      },
      //redis产品线_集群名  只显示集群名
      // findRedisAppName(redisLineAndApp){
      //   var index = redisLineAndApp.indexOf('_')
      //   return redisLineAndApp.slice(index+1)
      // },
      changedtable(list,options,status){
        //dtable中状态不为3 先存table里，清空dtable后再还原回去 (即删除dtable中status为3的数据)
        var table = []
        for (var i = 0; i < this.newAppForm.dtable.length; i++) {
          if(this.newAppForm.dtable[i].status !== status){
            table.push(this.newAppForm.dtable[i])
          }
        }
        this.newAppForm.dtable = []
        this.newAppForm.dtable = this.newAppForm.dtable.concat(table)
        //添加目的端信息
        if(list.length!==0){
          //合并端口
          for (var i = 0; i < list.length; i++) {
            var object = {}
            for (var j = 0; j < options[list[i]].length; j++) {
              var ip = options[list[i]][j].split(':')[0]
              var port = options[list[i]][j].split(':')[1]
              if (object[ip] == undefined) {
                object[ip] = port
              } else{
                object[ip] = object[ip]+','+port
              }
            }
            // 添加的ip port
            for (var key in object) {
              // this.newAppForm.dtable.unshift({esmqname:list[i],ip:key,port:object[key],status:status})
              if (status == 3) {var cluster_type = 'ES'}
              if (status == 4) {var cluster_type = 'MQ'}
              if (status == 5) {var cluster_type = 'mysql'}
              if (status == 6) {var cluster_type = 'oracle'}
              if (status == 7) {var cluster_type = 'mongodb'}
              if (status == 8) {var cluster_type = 'redis'}
               this.newAppForm.dtable.unshift({cluster_type:cluster_type,cluster_name:list[i],ip:key,port:object[key],status:status})
              // if (status == 8) {
              //   this.newAppForm.dtable.unshift({cluster_type:'redis',cluster_name:this.findRedisAppName(list[i]),ip:key,port:object[key],status:status})
              // } else{
              //   this.newAppForm.dtable.unshift({cluster_type:cluster_type,cluster_name:list[i],ip:key,port:object[key],status:status})
              // }
            }
          }
        }
      },
      changedtableelse(list,status){
        // console.log(list) // 集群类型+集群名
        //dtable中状态不为9 先存table里，清空dtable后再还原回去 (即删除dtable中status为9的数据)
        var table = []
        for (var i = 0; i < this.newAppForm.dtable.length; i++) {
          if(this.newAppForm.dtable[i].status !== status){
            table.push(this.newAppForm.dtable[i])
          }
        }
        this.newAppForm.dtable = []
        this.newAppForm.dtable = this.newAppForm.dtable.concat(table)
        //添加目的端信息
        if(list.length!==0){
          //合并端口
          for (var i = 0; i < list.length; i++) {
            var object = {}
            var cluster_type = list[i].split('+')[0]
            var cluster_name = list[i].split('+')[1]
            for (var j = 0; j < this.elseOptions[cluster_type][cluster_name].length; j++) {
              var ip = this.elseOptions[cluster_type][cluster_name][j].split(':')[0]
              var port = this.elseOptions[cluster_type][cluster_name][j].split(':')[1]
              if (object[ip] == undefined) {
                object[ip] = port
              } else{
                object[ip] = object[ip]+','+port
              }
            }
            // 添加的ip port
            for (var key in object) {
              this.newAppForm.dtable.unshift({cluster_type:cluster_type,cluster_name:cluster_name,ip:key,port:object[key],status:status})
            }
          }
        }
      },
      changefirewall(){
        this.newAppForm.eslist=[]
        this.newAppForm.mqlist=[]
        this.newAppForm.mysqllist=[]
        this.newAppForm.oraclelist=[]
        this.newAppForm.mongodblist=[]
        this.newAppForm.redislist=[]
        this.newAppForm.elselist=[]
        this.newAppForm.dtable=[]
        //当选择不开通 this.newAppForm.onORoff == '1'，则数据库信息表格this.newAppForm.configinfo中 所有firewall_Open都改为false
        if (this.newAppForm.onORoff == '1') {
          this.$emit('fatherMethod');
        }
      },
      dtablerules(){
        if (this.newAppForm.onORoff == '0' && this.newAppForm.dtable.length == 0) {
          this.$message({
            message: '请选择目的端集群',
            type: 'warning',
          })
          return false
        }
        // var dtable = this.newAppForm.dtable.filter(v => v.ip !== '')
        // if (dtable.length == 0) {
        //   this.newAppForm.steplinestatus = '1'
        // } else{
        //   this.newAppForm.steplinestatus = '0'
        // }
        if (this.newAppForm.onORoff == '1') {
          this.newAppForm.steplinestatus = '1'
        } else{
          this.newAppForm.steplinestatus = '0'
        }
        //传数据给父组件
        this.$emit('FormData',this.newAppForm)
      },
      clusterSearch(input,options,status){
        var options2 = []
        if (input) {
          for (let key in options) {
            //集群名称
            if (key.indexOf(input)!==-1) {
              options2[key] = options[key]
            } else{
              for (var i = 0; i < options[key].length; i++) {
                //ip:port1
                if (input.indexOf(':')!==-1 && options[key][i].split(':')[0].indexOf(input.split(':')[0])!==-1 && options[key][i].split(':')[1].indexOf(input.split(':')[1])!==-1) {
                  options2[key] = options[key]
                  break
                } else if (options[key][i].indexOf(input)!==-1) {
                  options2[key] = options[key]
                  break
                }
              }
            }
          }
        } else{ options2 = options }
        if (status == 3) {this.esOptions2 = options2}
        if (status == 4) {this.mqOptions2 = options2}
        if (status == 5) {this.mysqlOptions2 = options2}
        if (status == 6) {this.oracleOptions2 = options2}
        if (status == 7) {this.mongodbOptions2 = options2}
        if (status == 8) {this.redisOptions2 = options2}
      },
      elseclusterSearch(input,options){
        var options2 = {}
        if (input) {
          for (let type in options) {
            for (let key in options[type]) {
              //集群名称
              if (key.indexOf(input)!==-1) {
                if (!options2[type]) { options2[type] = {} }
                options2[type][key] = options[type][key]
              } else{
                for (var i = 0; i < options[type][key].length; i++) {
                  //ip:port1
                  if (input.indexOf(':')!==-1 && options[type][key][i].split(':')[0].indexOf(input.split(':')[0])!==-1 && options[type][key][i].split(':')[1].indexOf(input.split(':')[1])!==-1) {
                    if (!options2[type]) { options2[type] = {} }
                    options2[type][key] = options[type][key]
                    break
                  } else if (options[type][key][i].indexOf(input)!==-1) {
                    if (!options2[type]) { options2[type] = {} }
                    options2[type][key] = options[type][key]
                    break
                  }
                }
              }
            }
          }
        } else{options2 = options}
        this.elseOptions2 = options2
      },
      setdbcluster(type,db,open){
        if (this.newAppForm.onORoff == '1') {
          this.newAppForm.onORoff = '0' //先保持开通防火墙状态
        }
        var dblist = []
        for (var i = 0; i < db.length; i++) {
          if (dblist.indexOf(db[i][0]) == -1) {
            dblist.push(db[i][0])
          }
        }
        if (type.toLowerCase() == 'mysql') {
          for (var i = 0; i < dblist.length; i++) {
            if (open == false) {
              if (this.newAppForm.mysqllist.indexOf(dblist[i]) !== -1) {
                this.newAppForm.mysqllist.splice(this.newAppForm.mysqllist.indexOf(dblist[i]),1)
              }
            } else{
              if (Object.keys(this.mysqlOptions).indexOf(dblist[i]) == -1) {
                this.$message.error(`没有 ${dblist[i]} 集群,请联系数据库管理员`)
              } else{
                if (this.newAppForm.mysqllist.indexOf(dblist[i]) == -1) {
                  this.newAppForm.mysqllist.push(dblist[i])
                }
              }
            }
          }
          this.changedtable(this.newAppForm.mysqllist,this.mysqlOptions,5)
        } else if (type.toLowerCase() == 'oracle') {
          for (var i = 0; i < dblist.length; i++) {
            if (open == false) {
              if (this.newAppForm.oraclelist.indexOf(dblist[i]) !== -1) {
                this.newAppForm.oraclelist.splice(this.newAppForm.oraclelist.indexOf(dblist[i]),1)
              }
            } else{
              if (Object.keys(this.oracleOptions).indexOf(dblist[i]) == -1) {
                this.$message.error(`没有 ${dblist[i]} 集群,请联系数据库管理员`)
              } else{
                if (this.newAppForm.oraclelist.indexOf(dblist[i]) == -1) {
                  this.newAppForm.oraclelist.push(dblist[i])
                }
              }
            }
          }
          this.changedtable(this.newAppForm.oraclelist,this.oracleOptions,6)
        } else {
          for (var i = 0; i < dblist.length; i++) {
            if (open == false) {
              if (this.newAppForm.mongodblist.indexOf(dblist[i]) !== -1) {
                this.newAppForm.mongodblist.splice(this.newAppForm.mongodblist.indexOf(dblist[i]),1)
              }
            } else{
              if (Object.keys(this.mongodbOptions).indexOf(dblist[i]) == -1) {
                this.$message.error(`没有 ${dblist[i]} 集群,请联系数据库管理员`)
              } else{
                if (this.newAppForm.mongodblist.indexOf(dblist[i]) == -1) {
                  this.newAppForm.mongodblist.push(dblist[i])
                }
              }
            }
          }
          this.changedtable(this.newAppForm.mongodblist,this.mongodbOptions,7)
        }
        if (this.newAppForm.dtable.length == 0) {
          this.newAppForm.onORoff = '1'
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
</style>
