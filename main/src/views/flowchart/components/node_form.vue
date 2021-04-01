<template>
    <div>
        <div class="ef-node-form">
            <div class="ef-node-form-header">
                编辑
            </div>
            <div class="ef-node-form-body">
                <div v-show="activeType === 'node'">
                    <el-form :model="activeNode" ref="dataForm" label-width="80px">
                        <el-form-item label="类型">
                            <!-- <el-input v-model="activeNode.type"></el-input> -->
                            <el-select v-model="activeNode.type">
                              <el-option v-for="p in options" :label="p.label" :value="p.value" :key="p.value">

                              </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="名称">
                            <el-input v-model="activeNode.name"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="left坐标">
                            <el-input v-model="activeNode.left" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="top坐标">
                            <el-input v-model="activeNode.top" :disabled="true"></el-input>
                        </el-form-item> -->
                        <el-form-item label="ico图标">
                            <el-input v-model="activeNode.ico"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="状态">
                            <el-select v-model="activeNode.state" :disabled="true" placeholder="请选择">
                                <el-option
                                        v-for="item in stateList"
                                        :key="item.state"
                                        :label="item.label"
                                        :value="item.state">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                    </el-form>
                    <div class="btns">
                      <el-button size="small" icon="el-icon-close">重置</el-button>
                      <el-button size="small" type="primary" icon="el-icon-check" @click="save">保存</el-button>
                      <el-button size="small" type="danger" icon="el-icon-check" @click="remove">删除</el-button>
                    </div>
                </div>
                <div v-show="activeType === 'line'">
                    <el-form :model="activeLine" ref="dataForm" label-width="80px">
                        <el-form-item label="条件">
                            <el-input v-model="activeLine.label"></el-input>
                        </el-form-item>
                        <el-form-item label="连接线">
                            <el-sel v-model="activeLine.anchor">
                            </el-sel>
                        </el-form-item>
                    </el-form>
                    <div class="btns">
                        <el-button icon="el-icon-close" size="small">重置</el-button>
                        <el-button type="primary" icon="el-icon-check" size="small" @click="saveLine">保存</el-button>
                        <el-button type="danger" icon="el-icon-check" size="small" @click="removeLine">删除</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mixInStore from './mixInStore';
import ElSel from './ElSel';

export default {
    mixins: [mixInStore],
    components: {ElSel},
    data () {
        return {
            stateList: [
                {
                    state: 'success',
                    label: '成功'
                },
                {
                    state: 'warning',
                    label: '警告'
                },
                {
                    state: 'error',
                    label: '错误'
                },
                {
                    state: 'running',
                    label: '运行中'
                }
            ],
            options: [
              {
                label: '圆角方形',
                value: 'start'
              },
              {
                label: '菱形',
                value: 'diamond'
              },
              {
                label: '方形',
                value: 'task'
              }
            ]
        };
    },
    methods: {
        // 修改连线
        saveLine () {
            this.setActiveLine(this.activeLine);
            this.$emit('setLine');
        },
        save () {
            this.setActiveNode(this.activeNode);
            this.$emit('repaintEverything');
        },
        remove () {
            this.$emit('remove');
        },
        removeLine () {
            this.$emit('removeLine');
        }
    }
};
</script>

<style>
  .ef-node-form-header {
      height: 32px;
      border-top: 1px solid #dce3e8;
      border-bottom: 1px solid #dce3e8;
      background: #F1F3F4;
      color: #000;
      line-height: 32px;
      padding-left: 12px;
      font-size: 14px;
  }

  .ef-node-form-body {
      margin-top: 10px;
      padding-right: 10px;
      padding-bottom: 20px;
  }

  .btns {
    text-align: center;
  }

  .el-node-form-tag {
      position: absolute;
      top: 50%;
      margin-left: -15px;
      height: 40px;
      width: 15px;
      background-color: #fbfbfb;
      border: 1px solid rgb(220, 227, 232);
      border-right: none;
      z-index: 0;
  }
</style>
