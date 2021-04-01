<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile'">
      <app-main />
    </div>
    <div v-else>
      <sidebar class="sidebar-container" />
      <div :class="{ hasTagsView: needTagsView }" class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <navbar />
          <tags-view v-if="needTagsView" />
        </div>
        <section class="app-main" style="padding-top: 84px;">
          <transition name="fade-transform" mode="out-in">
            <div id="AppMain"></div>
          </transition>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";
import { registerMicroApps, start, initGlobalState } from "qiankun";

export default {
  name: "TYFBPT",
  components: {
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  data() {
    return {
      isMount: undefined
    };
  },
  mixins: [ResizeMixin],
  mounted() {
    if (!window.qiankunStarted) {
      const { token, name, roles, menu, uuid } = this.$store.getters;
      window.qiankunStarted = true;
      const child = JSON.parse(process.env.VUE_APP_CHILD).map(item => {
        const rmenu = menu.filter(
          menuItem => menuItem.meta && menuItem.meta.basePath === item.name
        );
        item.props = {
          userName: name,
          uuid,
          token,
          roles: JSON.stringify(roles),
          menu: JSON.stringify(rmenu)
        };
        return item;
      });
      registerMicroApps(child);
      start();
      this.isMount = setTimeout(() => {
        this.$store
        .dispatch("tagsView/delView", this.$route)
        this.$router.go(-1);
      }, 10 * 1000)
      // 初始化 state
      const state = {
        mounted: undefined
      };
      const actions = initGlobalState(state);

      actions.onGlobalStateChange((state, prev) => {
        clearTimeout(this.isMount)
        this.isMount = undefined;
        actions.offGlobalStateChange();
      });
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
