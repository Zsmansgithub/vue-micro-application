<template>
  <div class="container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <el-input
            v-model="listQuery.ip"
            clearable
            placeholder="输入ip  例:10.130.10"
          ></el-input>
        </el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="getList"
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          plain
          icon="el-icon-refresh"
          @click="handleReset"
          >重置
        </el-button>
      </el-form>
    </div>
    <div class="chart-content" ref="content" :key="`content${width}${height}`">
      <div v-for="(item, idx) in dataList" class="con" :key="`dataItem${idx}`">
        <div
          class="data-item"
          @click="updateState(item)"
          :style="{
            width: `${getItemWidth(width, HEAPMAP_XAXIS_L)}px`,
            height: `${(height - 40) / HEAPMAP_YAXIS_L}px`,
            background: `${(dataListFPKV[item] && dataListFPKV[item].color) ||
              'rgba(63,217,254,0.102)'}`
          }"
        >
          <span>{{ item }}</span>
        </div>
      </div>
      <div
        v-for="(item, idx) in HEAPMAP_XAXIS_L * HEAPMAP_YAXIS_L -
          dataList.length"
        class="bg-item"
        :key="`bgItem${idx}`"
        :style="{
          width: `${getItemWidth(width, HEAPMAP_XAXIS_L)}px`,
          height: `${(height - 40) / HEAPMAP_YAXIS_L}px`
        }"
      ></div>
    </div>
  </div>
</template>
<script>
import { distributionIp, blankingIp, fetchIpManage } from "@/api/cmdb";
import sessionListQuery from "@/components/mixins/sessionListQuery";
export default {
  mixins: [sessionListQuery],
  data() {
    return {
      listQuery: {
        ip: undefined
      },
      typeDisabled: [1, 2, 3, 4, 5],
      dataListFPKV: {}, // 已分配IP key(ip) value
      dataList: [
        // 该段IP
        // {
        //   change_user: "not_set",
        //   create_time: "2020-01-16 10:42",
        //   id: 12013,
        //   ip: "10.130.10.100",
        //   resourcemanage: 26386,
        //   type: 1,
        //   type_name: "主IP",
        //   update_time: "2020-11-03T10:23:44.717991"
        // }
      ],
      HEAPMAP_XAXIS_L: 10, // 格子行数
      HEAPMAP_YAXIS_L: 26, // 每行格子数
      width: 900, // 格子区域宽度
      height: 450 // 格子区域高度
    };
  },
  created() {
    window.addEventListener("resize", this.getSize);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("resize", this.getSize);
    });
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened;
    }
  },
  watch: {
    sidebar(val) {
      setTimeout(() => {
        this.getSize();
      }, 300);
    }
  },
  mounted() {
    this.getSize();
    if (this.listQuery.ip) {
      this.getList();
    }
  },
  methods: {
    // 获取数据
    getList() {
      const ip = this.listQuery.ip;
      if (!/^\d{1,3}.\d{1,3}.\d{1,3}$/.test(ip)) {
        this.$message.warning("IP格式不正确");
        return;
      }
      fetchIpManage(ip)
        .then(res => {
          if (res) {
            this.dataList = new Array(254)
              .fill()
              .map((val, idx) => `${ip}.${idx + 1}`);
            this.dataListFPKV = res.reduce((obj, val) => {
              if (this.typeDisabled.includes(val.type)) {
                val.color = "#17cb7e";
              }
              if (val.type === 6) {
                val.color = "rgba(254, 156, 0, .8)";
              }
              obj[val.ip] = val;
              return obj;
            }, {});
          } else {
            this.$message.error("出错了");
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 更新IP
    updateState(ip) {
      const item = this.dataListFPKV[ip];
      if (item && this.typeDisabled.includes(item.type)) {
        return;
      }
      item && item.type === 6 ? this.blanking(item) : this.distribution(ip);
    },
    // 置空IP
    blanking(item) {
      blankingIp(item.id)
        .then(res => {
          this.$message.success("操作成功！");
          if (!this.listQuery.ip) {
            const i = item.ip.split(".");
            this.listQuery.ip = `${i[0]}.${i[1]}.${i[2]}`;
          }
          this.getList();
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 分配IP
    distribution(ip) {
      const query = {
        change_user: this.$store.getters.name,
        ip: ip,
        type: 6
      };
      distributionIp(query)
        .then(res => {
          this.$message.success("操作成功！");
          if (!this.listQuery.ip) {
            const i = ip.split(".");
            this.listQuery.ip = `${i[0]}.${i[1]}.${i[2]}`;
          }
          this.getList();
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 获取展示块尺寸
    getSize() {
      const content = this.$refs["content"];
      if (content) {
        this.width = this.$refs["content"].clientWidth;
        this.height = this.$refs["content"].clientHeight;
      }
    },
    // 重置
    handleReset() {
      this.listQuery = this.$options.data().listQuery;
    },
    // 单个色块宽度
    getItemWidth(width, HEAPMAP_XAXIS_L) {
      return Math.floor(((width - 40) / HEAPMAP_XAXIS_L) * 10) / 10;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 84px);
  overflow: auto;
}

.chart-content {
  width: 100%;
  height: calc(100% - 68px);
  overflow: hidden;
  min-width: 900px;
  min-height: 450px;
  background: #242830;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  flex-wrap: wrap;
  padding: 20px;
  .con {
    overflow: hidden;
  }
  .data-item {
    box-sizing: border-box;
    color: #fff;
    border: 1px solid rgba(5, 19, 64, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    cursor: default;
    &:hover {
      opacity: 0.8;
    }
  }
  .bg-item {
    box-sizing: border-box;
    border: 1px solid rgba(5, 19, 64, 0.5);
    background: rgba(63, 217, 254, 0.102);
  }
}
</style>
