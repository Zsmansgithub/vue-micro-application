<template>
    <div class="page" style="height: 600px;">
        <div class="wrapper">
            <div class="content" ref="content" id="content" @wheel="scale" @mousedown="moveContainerStart" @mouseup="moveContainerEnd">
                <div :style="{transform: `translate(${position.left}px, ${position.top}px)`}" style="width: 0;height: 0;">
                    <div id="efContainer" ref="efContainer" class="container" :style="{transform: `scale(${this.scaleN})`}">
                        <template v-for="nodeItem in flowchartData.nodeList">
                            <flow-node
                                :id="nodeItem.id"
                                :key="nodeItem.id"
                                :node="nodeItem"
                                :isView="true"
                                @dblclick="dbclickNode"
                            >
                            </flow-node>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import { jsPlumb } from 'jsplumb';
import flowChartMixin from './components/mixins';
import flowNode from './components/node';
const sourceEndpoint = {
    endpoint: 'Dot',
    paintStyle: {
        stroke: '#7AB02C',
        radius: 7,
        strokeWidth: 1
    },
    isSource: true,
    isTarget: true,
    connector: [ 'Flowchart', { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
    dragOptions: {}
};
const nodeDef = {
    id: null,
    parentIds: [],
    childrenIds: [],
    name: null,
    type: 'task',
    left: null,
    top: null,
    ico: null,
    state: null
};
const contectPoints = ['TopCenter', 'BottomCenter', 'LeftMiddle', 'RightMiddle'];
const stateColors = {
    success: {
        pain: '#8BDC64',
        hoverPain: '#67c23a'
    },
    running: {
        pain: '#8BDC64',
        hoverPain: '#67c23a'
    }
};
const [nodeDefW, nodeDefH] = [300, 180];
export default {
    props: {
        propData: {
            type: Object,
            default: () => ({
                name: '',
                nodeList: [],
                lineList: []
            }),
        }
    },
    watch: {
        positioning(val) {
            this.position = val.positioning;
        }
    },
    computed: {
        flowchartData() {
            return this.$utils.index.deepClone(this.propData)
        }
    },
    data () {
        return {
            jsPlumb: null,
            position: {
                left: 0,
                top: 0
            },
            scaleN: 1
        };
    },
    mixins: [flowChartMixin],
    components: {
        draggable, flowNode
    },
    mounted () {
        this.dataReload();
    },
    methods: {
        // 初始化配置
        jsPlumbInit () {
            this.jsPlumb.ready(() => {
                // 导入默认配置
                this.jsPlumb.importDefaults(this.jsplumbSetting);
                // 会使整个jsPlumb立即重绘。
                this.jsPlumb.setSuspendDrawing(false, true);
                // 初始化节点
                this.jsPlumb.batch(() => {
                    this.loadEasyFlow();
                });
                this.jsPlumb.bind('dblclick', (conn, originalEvent) => {
                    const line = this.flowchartData.lineList.find((v) => { return (v.from === conn.sourceId && v.to === conn.targetId); });
                    console.log(line);
                });
            });
        },
        // 加载流程图
        loadEasyFlow () {
            // 初始化连线
            this.flowchartData.lineList.map((line) => {
                this.drawLine(line);
            });
        },
        // 绘制连线
        drawLine (line) {
            const stateFrom = this.flowchartData.nodeList.find((v) => { return v.id === line.from; }).state;
            const stateTo = this.flowchartData.nodeList.find((v) => { return v.id === line.to; }).state;
            const state = stateColors[stateFrom] && stateColors[stateTo] ? 'success' : null;
            const paintStyle = Object.assign(
                {},
                this.jsplumbSetting.PaintStyle,
                {
                    stroke: stateColors[state] ? stateColors[state].pain : '#E0E3E7'
                }
            );
            const connParam = {
                source: line.from,
                target: line.to,
                label: line.label ? line.label : '',
                connector: line.connector ? line.connector : 'Flowchart',
                anchors: line.anchor ? line.anchor : undefined,
                paintStyle: paintStyle
            };

            const content = this.jsPlumb.connect(connParam, this.jsplumbConnectOptions);
            content.setHoverPaintStyle({
                stroke: stateColors[state] ? stateColors[state].hoverPain : '#b0b2b5',
                strokeWidth: 2

            });
        },
        // 加载流程图
        dataReload () {
            this.$nextTick(() => {
                this.jsPlumb = jsPlumb.getInstance();
                this.$nextTick(() => {
                    this.jsPlumbInit();
                });
            });
        },
        dbclickNode(node) {
            console.log(node);
        },
        // 移动整个画布
        moveContainerStart ($event) {
            const [leftS, topS] = [$event.pageX, $event.pageY];
            const position = this.position;
            document.onmousemove = ($evt) => {
                const [leftN, topN] = [$evt.pageX - leftS, $evt.pageY - topS];
                this.position = {
                    left: position.left + leftN,
                    top: position.top + topN
                };
            };
        },
        moveContainerEnd () {
            document.onmousemove = null;
        },
        // 缩放整个图例
        scale ($evt) {
            this.scaleN = (this.scaleN * ($evt['deltaY'] > 0 ? 0.9 : 1.1)).toFixed(2) * 1;
            $evt.preventDefault()
        },
    }
};
</script>
<style lang="scss" scoped>
    @import "components/index";
</style>
