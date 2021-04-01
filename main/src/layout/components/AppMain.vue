<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <watermark v-show="isCMDB" :key="`watermark_${isCMDB}`"/>
  </section>
</template>

<script>
import watermark from "@/components/WaterMark";

import {mapGetters} from 'vuex'
export default {
  name: 'AppMain',
  components: {
    watermark
  },
  computed: {
    ...mapGetters(['cachedViews', 'visitedViews']),
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    key() {
      return this.$route.fullPath
    },
    isCMDB() {
      return /^\/?cmdb\//.test(this.$route.fullPath);
    }
  },
  watch:{
    visitedViews(newVal) {
      let visitedViews = []
      newVal.map((item) => {
        visitedViews.push(item.fullPath.replace(/\//g, '_'))
      })
      sessionStorage.setItem('visitedViews', visitedViews)
    },
  },
  mounted() {
    let sessionDataKeysBefore = sessionStorage.getItem('visitedViews') && sessionStorage.getItem('visitedViews').split(',')
    let sessionDataKeysNow = []
    this.visitedViews.map(item => sessionDataKeysNow.push(item.fullPath.replace(/\//g, '_')))
    if (sessionDataKeysBefore) {
      sessionDataKeysBefore.filter(key => !sessionDataKeysNow.includes(key)).map(key => sessionStorage.removeItem(key))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
