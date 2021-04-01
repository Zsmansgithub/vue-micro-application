<template>
  <div class="loop-wrapper" ref="loopWrapper">
    <template v-for="(v, i) in components">
      <transition name="slide-fade" :key="`item${i}${grid[i]}`">
        <div class="loop-item" v-show="idx === i">
          <div class="item" :key="`item${i}${grid[i]}`">
            <component :is="v" v-if="grid[i]" style="width: 100%;height: 100%;"></component>
          </div>
        </div>
      </transition>
    </template>
    <!-- <transition name="slide-fade">
      <div class="loop-item" v-show="idx === 0">
        <div class="item" :key="`item1${grid[0]}`">
          <roctetmq></roctetmq>
        </div>
      </div>
    </transition>
    <transition name="slide-fade">
      <div class="loop-item" v-show="idx === 1">
        <div class="item" :key="`item2${grid[1]}`">
          <url_monitor_grid v-if="grid[1]"></url_monitor_grid>
        </div>
      </div>
    </transition>
    <transition name="slide-fade">
      <div class="loop-item" v-show="idx === 2">
        <div class="item" :key="`item3${grid[2]}`">
          <server_monitor_grid v-if="grid[2]"></server_monitor_grid>
        </div>
      </div>
    </transition> -->
  </div>
</template>

<script>
  import roctetmq from '@/views/dashboard/dashboard/roctetmq';
  import esdashboard from '@/views/dashboard/dashboard/esdashboard';
  import url_monitor_grid from '@/views/zabbix/url_monitor_grid';
  import server_monitor_grid from '@/views/dashboard/dashboard/server_monitor_grid';
  import machine_view from '@/views/cmdb/components/machine_view';
  import zabbixIndex from '@/views/dashboard/zabbix/index';

  const maxIdx = 2;
  const interval = 15;

  export default {
    components: {
      roctetmq,
      esdashboard,
      url_monitor_grid,
      server_monitor_grid,
      machine_view,
      zabbixIndex,
    },
    data() {
      return {
        idx: 0,
        grid: [true, false, false, false, false, false],
        components: ['roctetmq', 'url_monitor_grid', 'server_monitor_grid'],
      }
    },
    mounted() {
      this.loop();
    },
    methods: {
      loop() {
        setTimeout(() => {
          this.idx === maxIdx ? this.idx = 0 : this.idx++;
          if(!this[`grid${this.idx}`]) {
              const grid = this.grid;
              grid[this.idx] = true;
              this.grid = grid;
          }
          this.loop();
        }, interval * 1000)
      },
    }
  }
</script>

<style lang="scss" scoped>
.loop-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
}
.loop-item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.item {
  width: 100%;
  height: 100%;
}
.slide-fade-enter-active {
  transition: all .3s linear;
}
.slide-fade-leave-active {
  transition: all .3s linear;
}
.slide-fade-enter {
  transform: translateX(1200px);
}
.slide-fade-leave-to {
  transform: translateX(-1200px);
}
</style>
