export default {
  data() {
    return {
      jsplumbSetting: {
        // 动态锚点、位置自适应
        Anchors: ['TopCenter', 'RightMiddle', 'BottomCenter', 'LeftMiddle'],
        // 容器ID
        Container: 'efContainer',
        Connector: ['Flowchart', { stub: 30, gap: 1, alwaysRespectStubs: false, midpoint: 0.5, cornerRadius: 10 }],
        // 鼠标不能拖动删除线
        ConnectionsDetachable: false,
        // 删除线的时候节点不删除
        DeleteEndpointsOnDetach: false,
        Endpoint: ['Blank', { Overlays: '' }],
        EndpointStyle: { fill: '#1879ffa1', outlineWidth: 1 },
        LogEnabled: false,
        PaintStyle: {
          stroke: '#E0E3E7',
          strokeWidth: 1,
          outlineStroke: 'transparent',
          outlineWidth: 10
        },
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        Overlays: [
          ['Arrow', {
            width: 10, // 箭头尾部的宽度
            length: 8, // 从箭头的尾部到头部的距离
            location: 1, // 位置，建议使用0～1之间
            direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
            foldback: 0.623 // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
          }],
          ['Label', {
            label: '',
            location: 0.1,
            cssClass: 'aLabel'
          }]
        ],
        // 绘制图的模式 svg、canvas
        RenderMode: 'svg',
        // 鼠标滑过线的样式
        HoverPaintStyle: { stroke: '#b0b2b5', strokeWidth: 2 },
        // 滑过锚点效果
        Scope: 'jsPlumb_DefaultScope'
      },
      jsplumbConnectOptions: {
        isSource: true,
        isTarget: true,
        editable: true,
        anchor: 'Continuous',
        labelStyle: {
          cssClass: 'flowLabel'
        }
      },
      jsplumbSourceOptions: {
        filter: '.flow-node-drag',
        filterExclude: false,
        anchor: 'Continuous',
        allowLoopback: false,
        maxConnections: -1,
        onMaxConnections: function(info, e) {
          console.log(`超过了最大值连线: ${info.maxConnections}`)
        }
      },
      jsplumbTargetOptions: {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        filter: '.ef-node-container',
        filterExclude: false,
        // 是否允许自己连接自己
        anchor: 'Continuous',
        allowLoopback: true,
        dropOptions: { hoverClass: 'ef-drop-hover' }
      }
    }
  }
}
