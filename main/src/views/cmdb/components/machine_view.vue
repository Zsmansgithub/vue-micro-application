<template>
  <div class="wrapper full-wrapper" ref="wrapper">
    <div class="breadcrumb">
      <i
        class="el-icon-back icon-back"
        @click="backToHouse"
        v-show="state === 'passageway'"
      ></i>
      <h2>{{ houseName }}</h2>
      <svg-icon
        v-show="!fullScreen"
        class="full-screen"
        @click="goFullScreen"
        icon-class="fullscreen"
      />
    </div>
    <div class="content">
      <transition name="fade-transform">
        <div class="house" v-if="state === 'house'">
          <div
            v-for="(item, index) in houseData"
            :key="item.name + index"
            @dblclick="goPassageway(item)"
            class="item"
          >
            <div class="border-content">
              <div class="item-title">{{ item.name }}</div>
              <liquid-fill-charts
                :id="item.name + index"
                :query="item"
                :title="item.name"
              ></liquid-fill-charts>
              <div class="item-data">
                <el-row>
                  <el-col :span="14" :offset="2">通道数</el-col>
                  <el-col class="num" :span="6" :offset="2">{{item.frame_count}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="14" :offset="2">机柜数</el-col>
                  <el-col class="num" :span="6" :offset="2">{{item.rack_count}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="14" :offset="2">已上架物理机数</el-col>
                  <el-col class="num" :span="6" :offset="2">{{item.used_servers}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="14" :offset="2">可上架总数</el-col>
                  <el-col class="num" :span="6" :offset="2">{{item.capacity_servers}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="14" :offset="2">剩余可上架数</el-col>
                  <el-col class="num" :span="6" :offset="2">{{item.remain_servers}}</el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="fade-transform">
        <div v-if="state === 'passageway'">
          <div
            class="passageway"
            v-for="(item, idx) in passagewayData[passagewayPage]"
            :key="item.frame_name"
            @mouseleave="rackOut(item.frame_name)"
          >
            <div class="name">{{ item.frame_name }}</div>
            <div class="passageway-content">
              <div
                class="focus-dom"
                :ref="item.frame_name"
                style="display: none"
                :style="focusDom"
              ></div>
              <template v-for="(itemRM, idxitem) in item.fr_detail">
                  <div
                    :key="idxitem"
                    class="table-cell"
                    @click="showRack(itemRM)"
                    :ref="item.frame_name + idxitem"
                    @mouseenter="rackEnter(item.frame_name, idxitem, idx)"
                  >
                    <div class="item item-content">
                     <el-tooltip placement="top" :key="idxitem">
                        <div slot="content" style="line-height: 1.5;">
                          可上架物理机总数：{{itemRM.capacity_servers}}
                          <br/>已上架数：{{itemRM.used_servers}}
                          <br/>剩余可上架数：{{itemRM.remain_servers}}
                        </div>
                        <div class="item-detail">{{`${itemRM.capacity_servers}/${itemRM.remain_servers}`}}</div>
                     </el-tooltip>
                      <div class="item-placeholder"></div>
                      <img
                        src="./../../../assets/server_room/Rack_42_(64).png"
                        alt
                        width="40px"
                      />
                      <span class="item-name">
                        <tip-text class="text" effect="dark" :text="itemRM.frame_rack" placement="bottom"
                        ><span>{{ itemRM.frame_rack }}</span></tip-text><span>/{{`共${itemRM.size_total}U`}}</span></span>
                    </div>
                    <div class="charts">
                      <liquid-fill-charts-rect
                        :status="computedStatus(itemRM)"
                        :id="item.frame_name + idxitem"
                        :query="{ usePercent: itemRM.used_servers/itemRM.capacity_servers * 100  }"
                      />
                    </div>
                  </div>
              </template>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <el-dialog
      :title="dialogData.data.frame_rack"
      :visible.sync="dialogData.dialogVisible"
      width="1200px"
    >
      <div class="rack-content">
        <div class="rack-img" style="padding-top: 10px">
          <template v-for="(item, idx) in dialogData.data.host_detail">
            <!-- <div :style="{
              position: 'absolute',
              left: 0,
              bottom: `${12 * item.rack_location + 16}px`,
              height: item.size * 12 + 'px',
              'padding-bottom': '4px'
              }" :key="idx">
              <div
                @mouseenter="machineActive(item, idx)"
                class="rackmountable"
                :class="{'rackmountable-active': dialogData.activeIdx === idx}"
              >
                <img
                  :src="rackmountableList[item.status]"
                  width="12"
                  height="12"
                  alt
                />
              </div>
              <span v-if="item.size > 1" class="location-text">{{item.rack_location}}~{{item.rack_location + item.size - 1}}</span>
              <span v-else class="location-text">{{item.rack_location}}</span>
            </div> -->
            <div :style="{
              position: 'absolute',
              left: 0,
              bottom: `${12 * item.rack_location + 18}px`,
              height: item.size * 12 + 'px',
              'padding-bottom': '4px'
              }" :key="idx">
              <div
                @mouseenter="machineActive(item, idx)"
                class="rackmountable"
                :class="{'rackmountable-active': dialogData.activeIdx === idx}"
              >
                <img
                  :src="rackmountableList[item.status]"
                  width="12"
                  height="12"
                  alt
                />
              </div>
              <div v-if="item.size > 1" class="location-text">{{item.rack_location}}~{{item.rack_location + item.size - 1}}</div>
              <div v-else class="location-text">{{item.rack_location}}</div>
            </div>
          </template>
          <div v-for="i in 42"
            class="scale-item"
            :style="{
              bottom: `${12 * i + 18}px`,
              }"
            :key="`scale${i}`">
            <div>{{i}}</div>
          </div>
        </div>
        <div class="rack-details">
          <div class="el-collapse-item__header">品牌：{{physicalMachine.brand || defText}}</div>
          <div class="el-collapse-item__header">设备型号：{{physicalMachine.device_model || defText}}</div>
          <div class="el-collapse-item__header">资产编号：{{physicalMachine.asset_number || defText}}</div>
          <div class="el-collapse-item__header">ip：{{physicalMachine.ip || defText}}</div>
          <div class="el-collapse-item__header">上架时间：{{physicalMachine.putaway_day || defText}}</div>
          <div class="el-collapse-item__header">过保时间：{{physicalMachine.expired_day || defText}}</div>
          <div class="el-collapse-item__header">sla级别：{{physicalMachine.sla || defText}}</div>
          <div class="el-collapse-item__header">设备sn码：{{physicalMachine.sn || defText}}</div>
          <div class="el-collapse-item__header">维保信息：{{physicalMachine.supplier || defText}}</div>
          <!-- <div class="el-collapse-item__header">机架起始位置：{{physicalMachine.rack_location || defText}}</div> -->
          <div class="el-collapse-item__header">设备大小（U）：{{physicalMachine.size || defText}}</div>
          <div class="el-collapse-item__header">报警数：
            <el-button v-if="physicalMachine.alarm_count > 0" type="text" @click="showErrorMsg(physicalMachine.ip)">{{physicalMachine.alarm_count}}</el-button>
            <span v-else type="text" >--</span>
          </div>
          <div class="el-collapse-item__header">IPMI：{{physicalMachine.ipmi || defText}}</div>
          <div class="el-collapse-item__header">产品线：{{physicalMachine.project_name || defText}}</div>
          <div class="el-collapse-item__header">应用名：{{physicalMachine.app_name || defText}}</div>
          <div class="el-collapse-item__header">应用负责人：{{physicalMachine.app_owner || defText}}</div>
          <div class="el-collapse-item__header">主机名：{{physicalMachine.host_name || defText}}</div>
          <div class="el-collapse-item__header">资源类型：{{physicalMachine.resource_type || defText}}</div>
          <div class="el-collapse-item__header">环境：{{physicalMachine.resource_env || defText}}</div>
          <div class="el-collapse-item__header">状态：{{physicalMachine.resource_status || defText}}</div>
          <div class="el-collapse-item__header">操作系统类型：{{physicalMachine.os_type || defText}}</div>
          <div class="el-collapse-item__header">操作系统版本：{{physicalMachine.os_version || defText}}</div>
          <div class="el-collapse-item__header">主机维护人：{{physicalMachine.maintainer || defText}}</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="报警信息" :visible.sync="dialogErrVisible" width="520px">
      <div>
        <div v-for="(item, index) in errorMsg" :key="index">
          <div v-if="index !== 0" class="el-divider el-divider--horizontal" style="margin: 10px 0"></div>
          <div >{{item}}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogErrVisible = false">确定</el-button>
      </div>
    </el-dialog>
    <ul class="pages" v-if="passagewayData.length > 2 && state === 'passageway'">
      <li v-for='item in passagewayData.length - 1' :class="{ 'active-li': item === passagewayPage }" :key="item" @click="page(item)">{{item}}</li>
    </ul>
  </div>
</template>
<script>
import liquidFillCharts from "./liquid-fill-charts";
import liquidFillChartsRect from "./liquid-fill-charts-rect";
import tipText from "@/components/TipText/Tip_Text";
import { getMachine, getPassageway, getCabinet, getErrorMsg } from "@/api/cmdb";

export default {
  components: {
    liquidFillCharts,
    liquidFillChartsRect,
    tipText
  },
  data() {
    return {
      houseName: "全部机房",
      passagewayData: [
        // {
        //   frame_name: "A",
        //   host_total: 0,
        //   rack_count: 18,
        //   size_remain: 652,
        //   size_total: 652,
        //   size_used: 0,
        //   the_third_level: [
        //     {
        //       frame_rack: "A1",
        //       host_total: 0,
        //       size_remain: 42,
        //       size_total: 42,
        //       size_used: 0,
        //       host_detail:[{
        //         rack_location: undefined, // 机架起始位置
        //         size: undefined, // 设备大小
        //         asset_number: "04050017053842",
        //         brand: "DELL",
        //         device_model: "R730xd",
        //         expired_day: "2021-04-04",
        //         putaway_day: "2020-03-06",
        //         sla: 1,
        //         sn: "3C56HP2",
        //         supplier: "DELL",
        //       }]
        //     }
        //   ]
        // },
      ],
      physicalMachine: {
        rack_location: undefined, // 机架起始位置
        size: undefined, // 设备大小
        asset_number: undefined, // 资产编号
        brand: undefined, // 品牌
        device_model: undefined, // 设备型号
        expired_day: undefined, // 上架时间
        putaway_day: undefined, // 过保时间
        sla: undefined, // sla级别
        sn: undefined, // 设备sn码
        supplier: undefined, // 维保信息
      },
      rackmountableList: [
        require("./../../../assets/server_room/light-success.png"),
        require("./../../../assets/server_room/light-error.png"),
        require("./../../../assets/server_room/light-warning.png")
      ],
      houseData: [
        // {
        //   distribution_frame_used: undefined, //
        //   frame_count: undefined, // 通道数
        //   host_total: undefined, // 物理机数
        //   id: undefined,
        //   name: undefined, // 名称
        //   rack_count: undefined, // 机柜数
        //   size_remain: undefined, //
        //   size_total: undefined, // 总U数
        //   size_used: undefined,// 已用U数
        // },
      ],
      dialogData: {
        dialogVisible: false,
        data: {
          // frame_rack: "A1",
          // host_total: 0,
          // size_remain: 42,
          // size_total: 42,
          // size_used: 0,
        }
      },
      state: "house",
      focusDom: {
        left: "0",
        top: "0"
      },
      fullScreen: false,
      passagewayPage: 1,
      stateData: {},
      time: undefined,
      dialogErrVisible: false,
      errorMsg: [],
      defText: '--'
    };
  },
  created() {
    this.fullScreen = this.$route.query.fullScreen;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getList();
      this.setRet();
      const bgImage = require('@/assets/dashboard1.jpg');
      const watermarkText = `${this.$store.getters.name} ${this.$store.getters.uuid}`;
      this.$utils.index.addWaterMarkImage(bgImage, this.$refs['wrapper'], watermarkText);
      this.$once('hook:beforeDestroy', () => {
          clearInterval(this.time)
        })
    },
    setRet() {
      this.time = setInterval(() => {
        if (this.state === 'house') {
          this.getList();
        }
        if (this.state === 'passageway') {
          this.goPassageway(this.stateData, false);
        }
      }, 60 * 1000)
    },
    reSetRet() {
      clearInterval(this.time)
      this.setRet();
    },
    getList() {
      getMachine().then((res) => {
        this.houseData = res;
      })
      .catch((e) => {
        console.error(e)
      })
    },
    backToHouse() {
      this.state = "house";
      this.reSetRet();
      this.houseName = "全部机房";
      this.passagewayData = [];
      this.scrollToTop();
    },
    page(item) {
      if(item === this.passagewayPage) return;
      this.passagewayPage = item;
      this.scrollToTop();
    },
    goPassageway(val, sta = true) {
      this.state = "passageway";
      this.reSetRet();
      this.houseName = val.name;
      this.stateData = val;
      if(sta) {
        this.scrollToTop();
      }
      getPassageway(val.id).then((res) => {
        let data = [null];
        let dataRes = [...res];
        while(dataRes.length > 0) {
          const item = dataRes.slice(0, 3)
          data.push(item)
          dataRes.splice(0, 3)
        }
        this.passagewayData = data;
        if(sta) {
          this.passagewayPage = 1;
        }
      })
      .catch((e) => {
        console.error(e)
      })
    },
    scrollToTop() {
      this.$utils["scroll-to"].scrollTo(0, 300);
    },
    showRack(item) {
      getCabinet(item.fr_id)
      .then((res) => {
        res.sort((a, b) => { return a.rack_location - b.rack_location });
        this.dialogData.dialogVisible = true;
        this.dialogData.data = item;
        this.dialogData.data.host_detail = res;
        this.physicalMachine = res[0] || {};
        this.dialogData.activeIdx = 0;
      })
      .catch((e) => {
        console.error(e)
      })
    },
    rackEnter(id, idx) {
      this.$refs[id][0].style.display = "block";
      this.focusDom = {
        left: this.$refs[id + idx][0].offsetLeft - 10 + "px",
        top: this.$refs[id + idx][0].offsetTop - 10 + "px",
        height: 208 + "px"
      };
    },
    rackOut(id) {
      if(!this.$refs[id][0]) return
      this.$refs[id][0].style.display = "none";
    },
    goFullScreen() {
      this.$router.push({
        name: "machine_fullscreen",
        query: {
          fullScreen: true
        }
      });
    },
    machineActive(item, idx) {
      this.physicalMachine = item;
      this.dialogData.activeIdx = idx;
    },
    computedStatus(itemRM) {
      // if(!itemRM || !itemRM.host_detail || typeof itemRM !== 'object') return 1
      // let status = [false, false]
      // itemRM.host_detail.map((v) => {
      //   if (v.status * 1 === 1) {
      //       status[0] = true
      //   }
      //   if (v.status * 1 === 2) {
      //       status[1] = true
      //   }
      // })
      // return status[0] ? 1 : status[1] ? 2 : 0
      return itemRM.host_down > 0 ? 1 : itemRM.host_alarm > 0 ? 2 : 0
    },
    showErrorMsg(ip) {
      getErrorMsg(ip).then((res) => {
        this.errorMsg = res.error_msg_list
        this.dialogErrVisible = true
      })
      .catch((e) => {
        console.error(e)
      })
    }
  }
};
</script>
<style lang="scss" scoped>
$tableCellWidth: 80px;
$chartsLeft: 30px;
$focusDomWidth: 100px;

$itemDetailHeight: 25px;
$itemDetailWidth: 100px;
$itemChartsTop: 28px;

$rackItemWidth: 129px;
.wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 159px);
  position: relative;
  /*color: #303133;*/
  color: #fff;
  background-image: url("./../../../assets/dashboard1.jpg");
  background-size: 100% 100%;

  .breadcrumb {
    width: 96%;
    margin-bottom: 20px;
    height: 30px;
    position: relative;
    text-align: center;
    /*color: #303133;*/

    .icon-back {
      position: absolute;
      left: 10px;
      top: 4px;
      font-size: 24px;
    }

    .full-screen {
      position: absolute;
      right: 0;
      top: 4px;
      font-size: 20px;
    }
  }

  .content {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 243px);
    overflow-x: hidden;

    & > div {
      width: 100%;
      min-height: 100%;
    }

    .item-content {
      display: inline-block;
      border-radius: 5px;
      text-align: center;
      position: relative;
      margin-bottom: 20px;
    }
    .item-detail {
      position: absolute;
      left: -10px;
      top: 0;
      width: $itemDetailWidth;
      height: $itemDetailHeight;
      line-height: 1.2;
    }
    .item-placeholder {
      height: $itemDetailHeight;
    }
    .item-name {
      position: absolute;
      left: -5px;
      bottom: 0;
      width: calc(#{$itemDetailWidth} - 10px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: flex;
      justify-content: center;
      .text {
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: normal;
        max-width: calc(#{$itemDetailWidth} - 50px);
      }
    }

    .passageway-wrapper {
      min-height: calc(100vh - 233px);
    }

    .passageway {
      margin: 0 10px 20px 10px;
      // color: #303133;
      border-radius: 3px;
      // border: 1px solid rgb(242, 246, 252);
      // background: rgba(242, 246, 252, 0.8);
      transition: all 0.1s;
      vertical-align: bottom;
      position: relative;

      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }

      &::after {
        clear: both;
        content: " ";
        display: block;
      }

      .name {
        position: absolute;
        left: 0;
        top: 0;
        width: 70px;
        padding: 10px 0 0 16px;
        /*color: #303133;*/
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .passageway-content {
        width: 100%;
        height: 100%;
        padding: 20px 20px 10px 110px;
        text-align: left;
        position: relative;

        .table-cell {
          display: inline-block;
          width: $tableCellWidth;
          margin-right: 20px;
          margin-bottom: 20px;
          vertical-align: bottom;
          position: relative;

          .charts {
            width: 17px;
            height: 120px;
            overflow: hidden;
            position: absolute;
            left: $chartsLeft;
            top: $itemChartsTop;
          }
        }

        .item {
          width: $tableCellWidth;
          padding-bottom: 30px;
          margin-right: 20px;
        }
      }
    }

    .house {
      padding: 10px 0;
      min-height: calc(100vh - 233px);

      .item {
        width: 50%;
        min-width: 315px;
        overflow: hidden;
        float: left;
        padding: 0 8px 15px 8px;
        /*color: #303133;*/
        position: relative;

        &:hover {
          .border-content {
            transition: all 0.2s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            /*box-shadow: inset 0 0 30px #102b4b;*/
            background: rgba(0, 0, 0, 0.3);
          }
        }

        .border-content {
          border: 2px solid #0d233e;
          /*box-shadow: inset 0 0 5px #102b4b;*/
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          padding-bottom: 20px;
          padding-left: 10px;
          cursor: pointer;
        }

        .item-title {
          padding-top: 5px;
          font-size: 18px;
          text-align: center;
          line-height: 30px;
        }

        .item-data {
          position: absolute;
          left: auto;
          right: 20px;
          top: 45px;
          font-size: 14px;
          min-width: 135px;
          width: 45%;
          line-height: 25px;

          .el-row {
            border-bottom: 1px solid rgb(34, 88, 155);
          }
          .num {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

      @media only screen and (min-width: 1200px) {
        .item {
          width: 33.3333%;
        }
      }

      @media only screen and (min-width: 1550px) {
        .item {
          width: 25%;
        }
      }
    }
  }
}

.rack-content {
  display: grid;
  grid-template-columns: minmax(310px, 310px) 1fr;
  &::after {
    clear: both;
    display: block;
    content: " ";
  }

  .rack-img {
    width: 200px;
    height: 550px;
    // padding-top: 7px;
    padding-bottom: 20px;
    margin: 0 50px 0 70px;
    background-image: url("./../../../assets/server_room/Rack_42_with_door_(64).png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    // display: flex;
    // flex-direction: column-reverse;
    .rackmountable {
      width: $rackItemWidth;
      height: 100%;
      background-image: url("./../../../assets/server_room/Rackmountable_1U_server_2D_(64).png");
      background-repeat: no-repeat repeat;
      background-size: $rackItemWidth 8px;
      transition: all 0.1s ease;
      position: relative;
      z-index: 999;
      img {
        position: absolute;
        bottom: 0;
        left: auto;
        right: 15px;
      }
    }
    .location-text {
      position: absolute;
      // left: -50px;
      right: -50px;
      top: -2px;
      line-height: 1;
      width: 40px;
      text-align: left;
      color: #077BF2;
    }
    .scale-item {
      position: absolute;
      left: -12px;
      height: 12px;
      width: 12px;
      border-bottom: 1px solid #333;
      box-sizing: border-box;
      & > div {
        position: absolute;
        left: -25px;
        // top: 4px;
        top: -2px;
        text-align: right;
        width: 20px;
        height: 100%;
      }
    }
    .rackmountable-active {
      transform: scale3d(1.1, 1.1, 1.5);
    }
  }

  .rack-details {
    display: flex;
    flex-wrap: wrap;
    .el-collapse-item__header {
      width: calc(50% - 20px);
      margin-right: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.focus-dom {
  position: absolute;
  left: 0;
  top: 0;
  width: $focusDomWidth;
  border-radius: 3px;
  background-color: rgba(140, 197, 255, 0.6);
  transition: all 0.3s ease;
}
.full-wrapper {
  min-height: calc(100vh);
  .content {
    min-height: calc(100vh);
    .passageway-wrapper {
      min-height: calc(100vh);
    }
    .house {
      min-height: calc(100vh);
    }
  }
}
.pages {
  width: 100%;
  list-style: none;
  display: flex;
  justify-content: center;
  text-align: center;
  line-height: 28px;
  cursor: default;
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 20px 0;
  & > li {
    margin: 0 5px;
    background-color: rgb(46, 50, 83);
    color: #fff;
    min-width: 30px;
    border-radius: 2px;
    &:hover,&:focus {
      background-color: rgb(58, 81, 107);
    }
  }
  .active-li {
    background-color: rgb(58, 81, 107);
  }
}
</style>
