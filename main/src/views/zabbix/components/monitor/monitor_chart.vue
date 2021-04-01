<template>
  <div
    class="chart-wrapper"
    :id="id"
    :style="{ width: `${width}px`, height: `${height}px` }"
    style="user-select: none;position: relative;"
  >
    <div class="chart-title" @click="goDetail">{{ title | textName }}</div>
    <div class="chart-content" @mouseleave="wrapperOut">
      <div
        v-for="(item, idx) in data"
        class="con"
        @dblclick="goMsg(item)"
        @mouseenter="wrapperEnter(item)"
        :key="`dataItem${idx}`"
      >
        <div
          class="data-item"
          @mousemove="itemMove"
          :class="bgClass(item)"
          :style="{
            width: `${getItemWidth(width, HEAPMAP_XAXIS_L)}px`,
            height: `${(height - 80) / HEAPMAP_YAXIS_L}px`
          }"
        ></div>
      </div>
      <div
        v-for="(item, idx) in HEAPMAP_XAXIS_L * HEAPMAP_YAXIS_L - data.length"
        class="bg-item"
        :key="`bgItem${idx}`"
        style=""
        :style="{
          width: `${getItemWidth(width, HEAPMAP_XAXIS_L)}px`,
          height: `${(height - 80) / HEAPMAP_YAXIS_L}px`
        }"
      ></div>
    </div>
    <div
      class="tooltip-content"
      v-show="showTip"
      :id="`tooltipContent${id}`"
      :style="{
        'max-width': `${width}px`,
        'max-height': `${height * 2}px`,
        overflow: 'hidden'
      }"
    >
      <div class="content" :id="`CHTML${id}`"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "330px"
    },
    height: {
      type: String,
      default: "280px"
    },
    title: {
      type: Array,
      default: () => {
        return [];
      }
    },
    app_name: {
      type: Array,
      default: () => {
        return [];
      }
    },
    HEAPMAP_YAXIS_L: {
      type: Number,
      default: 10
    },
    HEAPMAP_XAXIS_L: {
      type: Number,
      default: 20
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    level: {
      type: String,
      default: "first"
    },
    roles: {
      type: Boolean,
      default: false
    },
    gridWrapper: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      showTip: false,
      left: 0,
      top: 0,
      chartWrapper1: [],
      CHTML: undefined
    };
  },
  mounted() {},
  watch: {
    data: {
      handler() {
        if (this.level === "first") {
          this.getChartWrapper();
        }
      },
      deep: true,
      immediate: true
    },
    gridWrapper() {
      this.getChartWrapper();
    }
  },
  methods: {
    getChartWrapper() {
      this.$nextTick(() => {
        const chartWrapper1 = document.getElementById(this.id);
        this.chartWrapper1 = [
          chartWrapper1.getBoundingClientRect().left + window.pageXOffset,
          chartWrapper1.getBoundingClientRect().right + window.pageXOffset,
          chartWrapper1.getBoundingClientRect().top + window.pageYOffset,
          chartWrapper1.getBoundingClientRect().bottom + window.pageYOffset
        ];
      });
    },
    goDetail() {
      this.$emit("goSecondLevel", this.app_name);
    },
    goMsg(item) {
      const route = this.linkDetail(item);
      this.$router.push(route);
    },
    wrapperEnter(item) {
      document.getElementById(`tooltipContent${this.id}`).style.display =
        "block";
      document.getElementById(`CHTML${this.id}`).innerHTML = this.formatter(
        item
      );
    },
    wrapperOut() {
      document.getElementById(`tooltipContent${this.id}`).style.display =
        "none";
    },
    itemMove($event) {
      const pageX = $event.pageX;
      const pageY = $event.pageY;
      const tooltipContent = document.getElementById(
        `tooltipContent${this.id}`
      );
      const width = tooltipContent.clientWidth;
      const height = tooltipContent.clientHeight;
      let Pleft = 0;
      let Ptop = 0;
      if (pageX + width > this.chartWrapper1[1]) {
        Pleft = pageX - width;
      } else {
        Pleft = pageX;
      }
      if (Pleft < this.gridWrapper[0]) {
        Pleft = 0;
      }
      if (pageY + height > this.chartWrapper1[3]) {
        Ptop = pageY - height;
      } else {
        Ptop = pageY;
      }
      if (Ptop < this.gridWrapper[2]) {
        Ptop = 0;
      }
      tooltipContent.style.left = `${
        Pleft ? Pleft - this.chartWrapper1[0] : 0
      }px`;
      tooltipContent.style.top = `${Ptop ? Ptop - this.chartWrapper1[2] : 0}px`;
    },
    bgClass(item) {
      const status =
        ((item.ins_count - item.ins_error_count) / item.ins_count) * 100 || 0;
      let typeClass = "bg-health";
      if (status < 100) {
        typeClass = "huxiWarning bg-warning";
      }
      if (status < 30) {
        typeClass = "huxiError bg-error";
      }
      return typeClass;
    },
    getItemWidth(width, HEAPMAP_XAXIS_L) {
      return Math.floor(((width - 40) / HEAPMAP_XAXIS_L) * 10) / 10;
    }
  },
  filters: {
    textName(name) {
      if (name) {
        name = name.join(",");
      }
      return name;
    }
  },
  inject: ["linkDetail", "formatter"]
};
</script>
<style lang="scss" scoped>
.chart-wrapper {
  box-sizing: border-box;
  background: #242830;
  padding: 20px;
  display: grid;
  grid-template-rows: auto 1fr;
  .chart-title {
    height: 40px;
    font-size: 20px;
    color: rgba(255, 255, 255, 0.75);
    font-weight: 400;
    text-align: left;
  }
  .chart-content {
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    flex-wrap: wrap;
    .con {
      overflow: hidden;
    }
    .data-item {
      box-sizing: border-box;
      border: 1px solid rgba(5, 19, 64, 0.5);
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
}

.tooltip-content {
  display: none;
  padding: 10px;
  position: absolute;
  white-space: nowrap;
  z-index: 9999999;
  transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s,
    top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
  left: 0px;
  top: 0px;
  pointer-events: none;
  .content {
    padding: 10px;
    background-color: rgba(50, 50, 50, 0.7);
    border-width: 0px;
    border-color: rgb(51, 51, 51);
    border-radius: 4px;
    border-style: solid;
    color: rgb(255, 255, 255);
    font: 14px / 21px "Microsoft YaHei";
  }
}

.bg-warning {
  // background-color:rgb(243, 156, 18);
  background-color: rgba(254, 156, 0, 0.8);
}

.bg-error {
  // background-color:rgba(221, 75, 57, 1);
  background-color: rgba(220, 63, 44, 0.8);
}

.bg-health {
  background-color: #17cb7e;
}

.huxiWarning {
  animation-name: lightWarning;
  animation-duration: 0.8s;
  // animation-timing-function: ease;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes lightWarning {
  from {
    background-color: rgba(254, 156, 0, 0.8);
  }
  to {
    background-color: rgba(254, 156, 0, 1);
  }
}

.huxiError {
  animation-name: lightError;
  animation-duration: 0.8s;
  // animation-timing-function: ease;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes lightError {
  from {
    background-color: rgba(220, 63, 44, 0.8);
  }
  to {
    background-color: rgba(220, 63, 44, 1);
  }
}
</style>
