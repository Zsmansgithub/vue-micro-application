<template>
    <div v-if="easyFlowVisible" class="page">
        <div style="position: fixed;left: 300px;top: 20px;z-index: 999;">
            <el-button @click="dataReload('A')">数据A</el-button>
            <el-button @click="dataReload('B')">数据B</el-button>
            <el-button @click="dataReload('C')">数据C</el-button>
            <el-button @click="dataReload('D')">数据D</el-button>
        </div>
        <div class="wrapper">
            <div class="side-left">
                <node-menu @addNode="addNode" ref="nodeMenu"></node-menu>
            </div>
            <div class="content" ref="content" id="content" @wheel="scale" @mousedown="moveContainerStart" @mouseup="moveContainerEnd">
                <div :style="{transform: `translate(${position.left}px, ${position.top}px)`}" style="width: 0;height: 0;">
                    <div id="efContainer" ref="efContainer" class="container" :style="{transform: `scale(${this.scaleN})`}">
                        <template v-for="nodeItem in flowChartData.nodeList">
                            <flow-node
                                :id="nodeItem.id"
                                :key="nodeItem.id"
                                :node="nodeItem"
                                @updateNode="updateNode"
                            >
                            </flow-node>
                        </template>
                    </div>
                </div>
            </div>
    <!--    右侧表单-->
            <div class="side-right">
                <flow-node-form
                    ref="nodeForm"
                    @setLine="setLine"
                    @repaintEverything="repaintEverything"
                    @removeLine="removeLine"
                    @remove="removeEverything"></flow-node-form>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import { jsPlumb } from 'jsplumb';
import flowChartMixin from './components/mixins';
import mixInStore from './components/mixInStore';
import flowNode from './components/node';
import flowNodeForm from './components/node_form';
import nodeMenu from './components/node_menu';
import { getData } from './components/data_B';
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
    data () {
        return {
            jsPlumb: null,
            easyFlowVisible: true,
            flowInfoVisible: false,
            loadEasyFlowFinish: false,
            flowHelpVisible: false,
            flowChartData: {},
            position: {
                left: 130,
                top: 100
            },
            scaleN: 1
        };
    },
    mixins: [flowChartMixin, mixInStore],
    components: {
        draggable, flowNode, flowNodeForm, nodeMenu
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            this.jsPlumb = jsPlumb.getInstance();
            this.$nextTick(() => {
                this.dataReload('C');
            });
        },
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
                this.jsPlumb.bind('click', (conn, originalEvent) => {
                    const line = this.flowChartData.lineList.find((v) => { return (v.from === conn.sourceId && v.to === conn.targetId); });
                    this.setActiveType('line');
                    this.setActiveLine(this.$utils.index.deepClone(line));
                });
                // 连线完成回调
                this.jsPlumb.bind('connection', (evt) => {
                    let from = evt.source.id;
                    let to = evt.target.id;
                    if (this.loadEasyFlowFinish && !this.hasLine(from, to)) {
                        if (from === this.activeLine.from && to === this.activeLine.to) {
                            this.flowChartData.lineList.push(this.activeLine);
                        } else {
                            this.flowChartData.lineList.push({
                                from,
                                to
                            });
                        }
                    }
                });

                // 删除连线回调
                this.jsPlumb.bind('connectionDetached', (evt) => {
                    this.deleteLine(evt.sourceId, evt.targetId);
                });

                // 连线右击
                this.jsPlumb.bind('contextmenu', (evt) => {
                    console.log('contextmenu', evt);
                });

                // 连线
                this.jsPlumb.bind('beforeDrop', (evt) => {
                    let from = evt.sourceId;
                    let to = evt.targetId;
                    if (from === to) {
                        this.$message.error('节点不支持连接自己');
                        return false;
                    }
                    if (this.hasLine(from, to)) {
                        this.$message.error('该关系已存在,不允许重复创建');
                        return false;
                    }
                    if (this.hashOppositeLine(from, to)) {
                        this.$message.error('不支持两个节点之间连线回环');
                        return false;
                    }
                    this.$message.success('连接成功');
                    return true;
                });

                // beforeDetach
                this.jsPlumb.bind('beforeDetach', (evt) => {
                    console.log('beforeDetach', evt);
                });
            });
        },
        // 加载流程图
        loadEasyFlow () {
        // 初始化节点
            this.flowChartData.nodeList.map((node) => {
                this.initNode(node);
            });
            // 初始化连线
            this.flowChartData.lineList.map((line) => {
                this.drawLine(line);
            });
            this.$nextTick(function () {
                this.loadEasyFlowFinish = true;
                this.flowChartData.lineList = this.flowChartData.lineList.reduce((list, line) => {
                    let conn = this.jsPlumb.getConnections({
                        source: line.from,
                        target: line.to
                    })[0];
                    const strTrans = (str) => { const Str = `${str.slice(0, 1).toLocaleUpperCase()}${str.slice(1)}`; return Str; };
                    let anchor = null;
                    let endpoint1 = conn.endpoints[0]._continuousAnchorEdge;
                    let endpoint2 = conn.endpoints[1]._continuousAnchorEdge;
                    if (endpoint1 && endpoint2) {
                        anchor = [strTrans(endpoint1), strTrans(endpoint2)];
                    }
                    line.anchor = anchor;
                    list.push(line);
                    return list;
                }, []);
            });
        },
        // 初始化节点
        initNode (node) {
            if (!node.viewOnly) {
                this.jsPlumb.draggable(node.id, {
                    grid: [10, 10],
                    stop: (el) => {
                        const nodeidx = this.flowChartData.nodeList.findIndex((node) => {
                            return node.id === el.el.id;
                        });
                        this.flowChartData.nodeList[nodeidx].left = el.finalPos[0];
                        this.flowChartData.nodeList[nodeidx].top = el.finalPos[1];
                    }
                });
            }
            this.addEndpoints(node.id, contectPoints);
        },
        setLine () {
            this.removeLine();
            this.drawLine(this.activeLine);
        },
        // 删除连线
        removeLine () {
            let conn = this.jsPlumb.getConnections({
                source: this.activeLine.from,
                target: this.activeLine.to
            })[0];
            this.jsPlumb.deleteConnection(conn);
        },
        // 绘制连线
        drawLine (line) {
            const stateFrom = this.flowChartData.nodeList.find((v) => { return v.id === line.from; }).state;
            const stateTo = this.flowChartData.nodeList.find((v) => { return v.id === line.to; }).state;
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
        // 删除线
        deleteLine (from, to) {
            this.flowChartData.lineList = this.flowChartData.lineList.filter(function (line) {
                return (line.from !== from || line.to !== to);
            });
        },
        // 是否具有该线
        hasLine (from, to) {
            const idx = this.flowChartData.lineList.findIndex((v) => {
                return v.from === from && v.to === to;
            });
            return idx > -1;
        },
        // 是否含有相反的线
        hashOppositeLine (from, to) {
            return this.hasLine(to, from);
        },
        // 节点数据编辑保存 重绘
        repaintEverything () {
          this.flowChartData.nodeList = this.flowChartData.nodeList.reduce((list, node) => {
                if (node.id === this.activeNode.id) {
                    node = Object.assign({}, node, this.activeNode);
                }
              list.push(node);
              return list;
            }, []);
            const lintList = this.flowChartData.lineList;
            this.delEndpoints(this.activeNode.id, contectPoints);
            this.$nextTick(() => {
              this.addEndpoints(this.activeNode.id, contectPoints);
              const linelist = lintList.filter(line => line.from === this.activeNode.id || line.to === this.activeNode.id);
              linelist.forEach((line) => {
                let conn = this.jsPlumb.getConnections({
                  source: line.from,
                  target: line.to
                })[0];
                this.jsPlumb.deleteConnection(conn);
                this.drawLine(line)
              })
            })
        },
        // 删除节点
        removeEverything () {
            this.flowChartData.nodeList = this.flowChartData.nodeList.filter((node) => {
                return node.id !== this.activeNode.id;
            });
            this.jsPlumb.remove(this.activeNode.id);
        },
        // 计算节点位置
        calcPosition (data) {
            let minLeftSize;
            const maxNodeW = data.nodeList.reduce((sub, v) => {
                if (v.childrenIds.length > 1) sub += v.childrenIds.length;
                return sub;
            }, 1) * nodeDefW;
            function fn (id, node) {
                const position = [node.left, node.top];
                const top = position[1] * 1 + nodeDefH;
                const cidx = node.childrenIds.findIndex((cid) => { return cid === id; }); // 当前id在父节点数据中排行位置
                const minLeft = `${position[0] * 1 - ((nodeDefW * (node.childrenIds.length - 1)) / 2)}`;

                const idx = data.nodeList.findIndex((val) => {
                    return val.id === id;
                });

                data.nodeList[idx].left = minLeft * 1 + (nodeDefW * cidx);
                data.nodeList[idx].top = top;
            }
            if (!(data.nodeList[0].left >= 0)) data.nodeList[0].left = (maxNodeW / 2).toFixed(1);
            if (!(data.nodeList[0].top >= 0)) data.nodeList[0].top = 50;
            let mapAll = {};
            let map = {};
            let map1 = {};
            let arr = [];
            mapAll[data.nodeList[0].id] = data.nodeList[0];
            map[data.nodeList[0].id] = data.nodeList[0];
            data.nodeList.slice(1,).map((v) => {
                mapAll[v.id] = v;
                (v.left > 0 && v.top > 0) ? (() => { map[v.id] = v; })() : (() => { arr.push(v.id); map1[v.id] = v; })();
            });
            const fn1 = (cid) => {
                if (map[cid]) return;
                let pid1 = null;
                mapAll[cid].parentIds && mapAll[cid].parentIds.map((pid) => {
                    if (!map[pid]) {
                        fn1(pid);
                    }
                    if (!pid1) {
                        pid1 = pid;
                    }
                });
                if (pid1) {
                    fn(cid, map[pid1]);
                    map[cid] = map1[cid];
                    map1[cid] = null;
                }
            };
            const isCalc = arr.length;
            while (arr.length) {
                const cid = arr.shift();
                fn1(cid);
            }
            if (isCalc) {
                data.nodeList.map((node) => {
                    minLeftSize = minLeftSize < node.left ? minLeftSize : node.left;
                });
                data.nodeList.map((v) => {
                    v.left = v.left - minLeftSize + 200;
                });
            }
            return data;
        },
        // 加载流程图
        dataReload (v) {
            let data = getData(v)
            this.easyFlowVisible = false;
            this.flowChartData.nodeList = [];
            this.flowChartData.lineList = [];
            this.setActiveType('node');
            this.setActiveNode(this.$utils.index.deepClone(data.nodeList[0]));
            this.$nextTick(() => {
                data = this.$utils.index.deepClone(data);
                this.easyFlowVisible = true;
                this.flowChartData = this.calcPosition(data);
                this.$nextTick(() => {
                    this.jsPlumb = jsPlumb.getInstance();
                    this.$nextTick(() => {
                        this.jsPlumbInit();
                    });
                });
            });
        },
        addNode (evt, nodeMenu, mousePosition) {
            const efContainer = this.$refs.content;
            const containerRect = efContainer.getBoundingClientRect();
            const pageX = evt.originalEvent.pageX;
            const pageY = evt.originalEvent.pageY;
            if (pageX < containerRect.x || pageX > containerRect.width + containerRect.x || pageY < containerRect.y || pageY > containerRect.y + containerRect.height) {
                this.$message.error('请把节点拖入到画布中');
                return;
            }
            let left = pageX - containerRect.x - this.position.left - mousePosition.left;
            let top = pageY - containerRect.y - this.position.top - mousePosition.top;
            left = (left / this.scaleN).toFixed(2) * 1;
            top = (top / this.scaleN).toFixed(2) * 1;

            let nodeId = this.$utils.index.createUniqueString();
            let node = {
                ...nodeDef,
                ...nodeMenu,
                ...{
                    id: nodeId,
                    left: left,
                    top: top
                }
            };
            this.flowChartData.nodeList.push(node);
            this.$nextTick(function () {
                this.initNode(node);
            });
        },
        delEndpoints (toId, sourceAnchors) {
            for (let i = 0; i < sourceAnchors.length; i++) {
                let sourceUUID = toId + sourceAnchors[i];
                this.jsPlumb.deleteEndpoint(sourceUUID);
            }
        },
        addEndpoints (toId, sourceAnchors) {
            for (let i = 0; i < sourceAnchors.length; i++) {
                let sourceUUID = toId + sourceAnchors[i];
                this.jsPlumb.addEndpoint(toId, sourceEndpoint, {
                    anchor: sourceAnchors[i], uuid: sourceUUID
                });
            }
        },
        updateNode (node) {
            let nodeList = this.flowChartData.nodeList.reduce((list, nodeItem) => {
                if (nodeItem.id === node.id) { nodeItem = node; }
                list.push(nodeItem);
                return list;
            }, []);
            this.flowChartData = {...this.flowChartData, nodeList};
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
            // this.scaleN = (this.scaleN * ($evt['deltaY'] > 0 ? 0.9 : 1.1)).toFixed(2) * 1;
        },
    }
};
</script>
<style lang="scss" scoped>
    @import "components/index";
</style>
