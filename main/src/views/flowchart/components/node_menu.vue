<template>
  <div class="flow-menu" ref="tool">
    <div class="menu-title">流程图</div>
    <draggable @end="end" @choose="start" class="menu-wrapper" v-model="menuList" :options="draggableOptions">
      <div v-for="subMenu in menuList" class="ef-node-menu" :class="`ef-mode-${subMenu.type}`" :ref="`node${subMenu.id}`" :key="subMenu.id" :id="`${subMenu.id}`">
        <div style="position: relative;z-index: 9;">
            <i :class="subMenu.ico"></i> {{subMenu.name}}
        </div>
        <div class="ef-node-right-ico">
          <state-icon :state="subMenu.state"></state-icon>
        </div>
            <svg v-if="subMenu.type === 'diamond'" class="diamond"
                width="150" height="96"><path d="M 75 1 L 149 48 L 75 95 L 1 48 Z" class="inner">
            </path></svg>
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import stateIcon from './stateIcon';

let mousePosition = {
    left: 0,
    top: 0
};

export default {
    data () {
        return {
            draggableOptions: {
                preventOnFilter: false,
                sort: false,
                disabled: false,
                ghostClass: 'tt',
                forceFallback: true
            },
            menuList: [
                {
                    id: '11',
                    type: 'start',
                    name: '节点',
                    ico: 'el-icon-user-solid',
                    state: 'success'
                },
                {
                    id: '12',
                    type: 'task',
                    name: '节点',
                    ico: 'el-icon-user-solid',
                    state: 'success'
                },
                {
                    id: '13',
                    type: 'diamond',
                    name: '节点',
                    ico: 'el-icon-user-solid',
                    state: 'success'
                }
            ],
            nodeMenu: {}
        };
    },
    components: {
        draggable, stateIcon
    },
    created () {
        if (this.isFirefox()) {
            document.body.ondrop = function (event) {
                event.preventDefault();
                event.stopPropagation();
            };
        }
    },
    methods: {
        getMenuByType (id) {
            return this.menuList.find((i) => { return i.id === id; });
        },
        start (evt, ...args) {
            const id = evt.item.attributes.id.nodeValue;
            const p = this.$refs[`node${id}`][0].getBoundingClientRect();
            mousePosition = {
                left: evt.originalEvent.pageX - p.x,
                top: evt.originalEvent.pageY - p.y
            };
            this.nodeMenu = this.getMenuByType(id);
        },
        end (evt, e) {
            this.$emit('addNode', evt, this.nodeMenu, mousePosition);
        },
        isFirefox () {
            let userAgent = navigator.userAgent;
            return userAgent.indexOf('Firefox') > -1;
        }
    }
};
</script>
<style lang="scss" scoped>
.menu-title {
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #F1F3F4;
  text-align: center;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
