<template>
    <div
        ref="node"
        :style="nodeContainerStyle"
        @click="clickNode"
        @dblclick="dbclickNode"
        @mouseup="changeNodeSite"
        :class="nodeContainerClass"
    >
        <div class="ef-node-text" :show-overflow-tooltip="true">
            <i :class="nodeIcoClass"></i>
            {{node.name}}
        </div>
        <div class="ef-node-right-ico">
            <state-icon :state="node.state"></state-icon>
        </div>
        <svg
            v-if="node.type === 'diamond'"
            class="diamond"
            width="150" height="96"><path d="M 75 1 L 149 48 L 75 95 L 1 48 Z" class="inner">
        </path></svg>
    </div>
</template>

<script>
import mixInStore from './mixInStore';
import stateIcon from './stateIcon';
export default {
    props: {
        node: Object,
        isView: {
            type: Boolean,
            default: false
        }
    },
    components: { stateIcon },
    data () {
        return {};
    },
    mixins: [mixInStore],
    computed: {
        nodeContainerClass () {
            return `ef-node-container ef-mode-${this.node.type} ${this.activeNode.nodeId === this.node.id ? 'ef-node-active' : ''}`;
        },
        nodeContainerStyle () {
            return {
                top: `${this.node.top}px`,
                left: `${this.node.left}px`
            };
        },
        nodeIcoClass () {
            let nodeIcoClass = {};
            nodeIcoClass[this.node.ico] = true;
            nodeIcoClass['flow-node-drag'] = !this.node.viewOnly;
            return nodeIcoClass;
        }
    },
    methods: {
        clickNode () {
            this.setActiveType('node');
            this.setActiveNode(this.$utils.index.deepClone(this.node));
        },
        dbclickNode() {
            if(this.isView) {
                this.$emit('dblclick', this.node)
            }
        },
        changeNodeSite () {
            if (this.node.left === this.$refs.node.style.left && this.node.top === this.$refs.node.style.top) {
                return;
            }
            const nodeNow = Object.assign(this.node, {
                left: this.$refs.node.style.left,
                top: this.$refs.node.style.top
            });
            this.$emit('updateNode', nodeNow);
        }
    }
};
</script>
