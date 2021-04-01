<template>
  <div class="dest-ips">
    <div class="chk-ips">
      <el-scrollbar class="el-scrollbar-x el-scrollbar-h0">
        <div>自选<span style="color: #C0C4CC">（所选ip总数不能超过100）</span></div>
        <el-cascader
          v-model="chkips"
          style="width:100%;"
          :options="cascaderOptions"
          :props="{ multiple: true, expandTrigger: 'hover', disabled: 'disabled' }"
          :show-all-levels="false"
          filterable
          clearable
        >
        </el-cascader>
      </el-scrollbar>
      <el-scrollbar class="el-scrollbar-x el-scrollbar-h1">
        <div class="ips">
          <template v-for="(item, idx) in chkips">
            <div class="ip-item" v-for="(ip, ipidx) in item.slice(-1)[0].value" :key="`chkip${idx}${ipidx}`">
              {{ip}}
            </div>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <div class="form-wrapper">
      <div>自定义<span style="color: #C0C4CC">（自定义ip总数不能超过20）</span></div>
      <el-scrollbar class="el-scrollbar-x el-scrollbar-h2" ref="elScrollbar" :class="{'addP': addP}">
        <template v-if="destIpList && destIpList.length">
          <div class="froms"
            v-for="(item, idx) in destIpList"
            :key="`ip${idx}`">
            <div class="ipt"><el-input
                :value="item.ip"
                :ref="`destIpListIp${idx}`"
                @input="chageCust($event, idx, 'ip')"
                placeholder="IP"
                clearable
                class="ip"/>&nbsp;:&nbsp;<el-input
                :ref="`destIpListPort${idx}`"
                :value="item.port"
                @input="chageCust($event, idx, 'port')"
                clearable
                placeholder="端口"
                class="port"/>
            </div>
            <div>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delIP(idx)" circle></el-button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="froms">
            <div class="ipt"><el-input
                @input="chageCust($event, 0, 'ip')"
                placeholder="IP"
                clearable
                class="ip"/>&nbsp;:&nbsp;<el-input
                @input="chageCust($event, 0, 'port')"
                clearable
                placeholder="端口"
                class="port"/>
            </div>
            <div class="del-btn">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delIP(0)" circle></el-button>
            </div>
          </div>
        </template>
        <div class="btns-group">
          <el-button size="mini" @click="addDest('port')">新增端口</el-button>
          <el-button type="primary" size="mini" @click="addDest(null)">新增IP加端口</el-button>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
import {getmysqloracle} from '@/api/zabbix';
import {get_all_ipport} from '@/api/workflow/app_manage.js';
  export default {
    props: {
      value: {
        type: Object | String,
      },
    },
    computed: {
      chkips: {
        get() {
          return this.value && this.value.chkips && this.value.chkips instanceof Array ? this.value.chkips : []
        },
        set(val) {
          val = val || [];
          this.updateValue(Object.assign({custIps: []}, this.value, {chkips: val}))
        }
      },
      destIpList() {
          try {
            const ips = this.value && this.value.custIps && this.value.custIps instanceof Array ? this.value.custIps : []
            return ips.reduce((list, val) => {
              list.push({
                ip: val.split(':')[0] || '',
                port: val.split(':')[1] || '',
              })
              return list;
            },[])
          } catch (e) {
            console.error(e);
            return [];
          }
      },
      addP() {
        return this.destIpList.length > 5
      }
    },
    watch: {
      chkips(list) {
        let chkKeys = [];
        const len = list.reduce((sum, val) => {
          val = val.slice(-1)[0];
          sum += val.value.length;
          chkKeys.push(val.key);
          return sum;
        }, 0);
        if(len > 100) {
          this.cascaderOptions = this.traggerDisabled(true, chkKeys);
          this.disabled = true;
        } else {
          if(this.disabled) {
            this.cascaderOptions = this.traggerDisabled(false);
            this.disabled = false;
          }
        }
      },
      destIpList(newval, oldval) {
        if(!oldval.length && newval.length) {
          const id = newval[0].ip ? 'destIpListIp0' : 'destIpListPort0';
          this.$nextTick(() => {
            this.$refs[id][0].focus();
          })
        }
      }
    },
    data() {
      return {
        cascaderOptions: [],
        disabled: false
      }
    },
    created() {
      const body =  document.getElementsByTagName('body')[0];
      body.className = body.className + ' tool-remote-telnet-dest-ips';
      this.$once('hook:beforeDestroy', () => {
        this.$utils.index.toggleClass(body, 'tool-remote-telnet-dest-ips');
      })
    },
    mounted(){
      get_all_ipport().then((res) => {
        this.cascaderOptions = Object.entries(res).reduce((list, val) => {
          const labelLowerCase = val[0].toLowerCase();
          const children = Object.entries(val[1]).reduce((CList, i) => {
            const valueip = i[1].reduce((ips, ipPort) => {
              const groupIp = ipPort.split(',');
              const nip = groupIp[0].split(':')[0].replace(/\s{1,}/g, '');
              groupIp.forEach((p) => {
                  p = p.replace(/\s{1,}/g, '');
                  p = p.match(/\d:\d|\S:\d/) ? p : `${nip}:${p}`;
                  ips.push(p);
              })
              return ips;
            }, []).sort((a, b) => a.localeCompare(b,'zh-CN'))
            let valLabel;
            if(labelLowerCase === 'redis') {
              const index = i[0].indexOf('_');
              valLabel = i[0].slice(index+1);
            } else {
              valLabel = i[0];
            }
            const key = SparkMD5.hash(`${labelLowerCase}${valLabel}`).slice(0, 7);
            const ip = {
              label: i[0],
              disabled: false,
              value: {
                key: key,
                label: valLabel,
                value: valueip
              }
            }
            CList.push(ip)
            return CList;
          }, [])
          const item = {
            label: val[0],
            value: labelLowerCase,
            children
          }
          list.push(item)
          return list;
        }, [])
      })
    },
    methods:{
      updateValue(oldValue) {
        try{
          const value = JSON.parse(JSON.stringify(oldValue).replace(/\s+/g, ''));
          this.$emit('input', value);
        } catch(e) {
          console.error(e);
        }
      },
      chageCust(...args) {
          let custIps = this.value && this.value.custIps && this.value.custIps instanceof Array ? this.value.custIps : [];
          if(custIps.length) {
            custIps[args[1]] = args[2] === 'ip' ? `${args[0]}:${custIps[args[1]].split(':')[1]}` : `${custIps[args[1]].split(':')[0]}:${args[0]}`;
          } else {
            custIps[args[1]] = args[2] === 'ip' ? `${args[0]}:` : `:${args[0]}`;
          }
          this.updateValue(Object.assign({chkips: []}, this.value, {custIps}));
      },
      traggerDisabled(len, chkKeys){
        return this.cascaderOptions.reduce((options, val) => {
            const children = val.children.reduce((list, ipval) => {
              ipval = Object.assign({}, ipval, { disabled: len ? !chkKeys.includes(ipval.value.key) : false})
              list.push(ipval)
              return list;
            }, [])
            val = Object.assign({}, val,{children})
            options.push(val);
            return options;
          }, [])
      },
      strIps(list) {
        return list.reduce((str, v) => {
            str += (v.ip || v.port) ? `${v.ip && v.ip.trim()}:${v.port && v.port.trim()},` : ''
            return str;
          },'')
      },
      addDest(port) {
        const lastIp = this.destIpList.slice(-1,)[0];
        if(!this.destIpList.length || this.destIpList.length > 19 || !lastIp.ip || !lastIp.port) return;
        const c = port ? [`${lastIp.ip}:`] : [`:`]
        let custIps = this.value.custIps.concat(c);
        this.updateValue(Object.assign({}, this.value, {custIps}));
        this.$nextTick(() => {
          this.$refs.elScrollbar.$el.children[0].scrollTop += 46;
        })
      },
      delIP(idx) {
        let custIps = this.value.custIps || [];
        custIps.splice(idx, 1);
        this.updateValue(Object.assign({}, this.value, {custIps}));
        this.$nextTick(() => {
          this.destIpList && this.destIpList.length && this.$emit('validateDest');
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dest-ips {
    padding: 5px 15px;
    width: 100%;
    min-width: 570px;
    height: 327px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    display: grid;
    grid-template-columns: minmax(200px, 65%) 1fr;
    .chk-ips {
      padding-right: 15px;
      position: relative;
      height: 320px;
      &::after {
        display: block;
        content: ' ';
        position: absolute;
        right: 0;
        top: 0;
        width: 1px;
        height: 100%;
        background: #DCDFE6;
      }
      .ips{
        display: flex;
        flex-wrap: wrap;
        .ip-item {
          width: 33%;
          min-width: 150px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          // margin-bottom: 10px;
        }
      }
    }

    .form-wrapper {
      min-width: 300px;
      padding-left: 10px;
      .froms {
        display: flex;
        margin-bottom: 10px;
        padding-right: 10px;
        .ipt {
          width: 260px;
          display: flex;
          .ip {
            flex: 0 0 160px;
          }
          .port {
            flex: 0 0 80px;
          }
        }
        .del-btn {
          position: relative;
          left: 10px;
        }
      }
    }

  }
  .el-scrollbar-x /deep/ {
    .el-scrollbar__wrap {
        overflow-x: auto;
      }
  }
  .el-scrollbar-h0 {
    height: 73px;
    border-bottom: 1px solid #DCDFE6;
  }
  .el-scrollbar-h1 {
    height: 240px;
    padding-top: 10px;
  }
  .el-scrollbar-h2 {
    height: 270px;
    position: relative;
  }
  .addP /deep/{
    padding-bottom: 36px;
    .btns-group {
      position: absolute;
      bottom: 0;
      top: auto;
      left: 0;
      width: 100%;
      background: #fff;
    }
  }
  .el-cascader-d {
    width: 100%;
    .el-cascader-menu:not(:last-child) {
      .el-checkbox {
        visibility: hidden!important;
      }
    }
  }
</style>
<style lang="scss">
.tool-remote-telnet-dest-ips {
  .el-cascader-menu:first-child {
        .el-checkbox {
          visibility: hidden!important;;
        }
      }
}
</style>
