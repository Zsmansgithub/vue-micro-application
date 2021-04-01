<template>
    <el-dialog title="流程图" width="1200" :visible.sync="visible" :before-close="() => { $emit('update:visible', false) }">
        <flowchart :propData="flowchartData"/>
    </el-dialog>
</template>
<script>
import flowchart from '@/views/flowchart/flowchart';
export default {
    props: {
        id: {
            type: String | Number,
            default: '',
            required: true
        },
        visible: {
            type: Boolean,
            default: false
        },
    },
    components: {flowchart},
    data() {
        return {
            flowchartData: {
                positioning: {
                    left: 235,
                    top: 0
                },
                name: 'SQL审核上线',
                nodeList: [
                    {
                    id: 'nodeA',
                    parentIds: [],
                    childrenIds: ['nodeB'],
                    name: '发起流程',
                    type: 'start',
                    left: 350,
                    top: 0,
                    ico: '',
                    state: ''
                    // viewOnly: true
                    },
                    {
                    id: 'nodeB',
                    parentIds: ['nodeA'],
                    childrenIds: ['nodeC'],
                    name: '数据库组审批',
                    type: 'task',
                    left: 350,
                    top: 90,
                    ico: '',
                    state: ''
                    },
                    {
                    id: 'nodeC',
                    parentIds: ['nodeB'],
                    childrenIds: ['nodeD', 'nodeF'],
                    name: '部门领导审批',
                    type: 'diamond',
                    left: 350,
                    top: 180,
                    ico: '',
                    state: ''
                    },
                    {
                    id: 'nodeD',
                    parentIds: ['nodeC'],
                    childrenIds: ['nodeE'],
                    name: '部门总监审批',
                    type: 'task',
                    left: 580,
                    top: 270,
                    ico: '',
                    state: ''
                    // viewOnly: true
                    },
                    {
                    id: 'nodeE',
                    parentIds: ['nodeD'],
                    childrenIds: ['nodeF'],
                    name: '系统运维总监审批',
                    type: 'task',
                    left: 580,
                    top: 380,
                    ico: '',
                    state: ''
                    },
                    {
                    id: 'nodeF',
                    parentIds: ['nodeC', 'nodeE'],
                    childrenIds: [],
                    name: '数据库组实施',
                    type: 'task',
                    left: 350,
                    top: 470,
                    ico: '',
                    state: ''
                    },
                    {
                    id: 'nodeG',
                    parentIds: ['nodeC', 'nodeD'],
                    childrenIds: [],
                    name: '执行完成',
                    type: 'task',
                    left: 350,
                    top: 560,
                    ico: '',
                    state: ''
                    },
                    {
                    id: 'nodeH',
                    parentIds: ['nodeC', 'nodeD'],
                    childrenIds: [],
                    name: '结束',
                    type: 'task',
                    left: 350,
                    top: 640,
                    ico: '',
                    state: ''
                    },
                ],
                lineList: [
                    {
                    from: 'nodeA',
                    to: 'nodeB',
                    anchor: ['Bottom', 'Top'],
                    },
                    {
                    from: 'nodeB',
                    to: 'nodeC',
                    anchor: ['Bottom', 'Top'],
                    },
                    {
                    from: 'nodeC',
                    to: 'nodeD',
                    anchor: ['Right', 'Top'],
                    label: '其他语句'
                    },
                    {
                    from: 'nodeD',
                    to: 'nodeE',
                    anchor: ['Bottom', 'Top']
                    },
                    {
                    from: 'nodeC',
                    to: 'nodeF',
                    anchor: ['Bottom', 'Top'],
                    label: 'create语句'
                    },
                    {
                    from: 'nodeE',
                    to: 'nodeF',
                    anchor: ['Bottom', 'Right']
                    },
                    {
                    from: 'nodeF',
                    to: 'nodeG',
                    anchor: ['Bottom', 'Top']
                    },
                    {
                    from: 'nodeG',
                    to: 'nodeH',
                    anchor: ['Bottom', 'Top']
                    },
                ]
            },
        }
    },
    methods: {
        getData() {},
    }
}
</script>
<style lang="scss" scoped>

</style>