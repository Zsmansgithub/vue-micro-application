<template>
  <div>
    <!-- <el-row v-for="(i, index) in val" :key="index" style="padding-bottom: 10px;min-width: 950px">
      <el-col :span="6">
        <el-select
          v-model="i.ouid"
          filterable
          clearable
          allow-create
          :placeholder="placeholder"
          style="width: 100%;"
          @blur="valiedate"
          @change="selChange(index)"
        >
          <el-option
            v-for="item in $attrs.selOptions[0]"
            :key="item.ouid"
            :label="item.ou_name"
            :value="item.ouid">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-row style="padding-bottom: 10px" :key="indexPeople" v-for="(j, indexPeople) in i.own_people">
          <el-col :span="14">
            <el-select
              v-model="j.own_people_id"
              filterable
              clearable
              allow-create
              placeholder="请选择责任人"
              @blur="valiedate"
              @change="userChange(index, indexPeople)"
              style="width: 100%;"
            >
              <el-option
                v-for="item in $attrs.selOptions[1]"
                :key="item.value"
                :label="`(${item.value})${item.label}`"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5" style="padding-right: 20px">
              <el-input style="width: 100%" @blur="valiedate" placeholder="请输入百分比" v-model="j.persent"></el-input>
            </el-col>
          <el-col :span="2"><el-button @click="delPeople(index, indexPeople)" type="danger" style="padding: 5px" icon="el-icon-delete" circle></el-button></el-col>
          <el-col v-if="indexPeople === i.own_people.length - 1" :span="2"><el-button style="padding: 5px" @click="addPeople(index)" type="primary" icon="el-icon-plus" circle></el-button></el-col>
        </el-row>
      </el-col> -->
      <!-- <el-col :span="1"><el-button @click="del(index)" type="danger" style="padding: 5px" icon="el-icon-delete" circle></el-button></el-col>
      <el-col v-if="index === val.length - 1" :span="1"><el-button style="padding: 5px" @click="add" type="primary" icon="el-icon-plus" circle></el-button></el-col> -->
    <!-- </el-row> -->
    <el-row v-for="(i, index) in val" :key="index + 1">
          <el-col :span="22">
            <div class="channel_name">{{`责任部门${index + 1}`}}</div>
            <div style="width: 980px">
              <el-table :data="i.own_people"
                        ref="multipleTable"
                        border
                        :cell-style="cellStyleClass"
                        :header-cell-style="deviceHeaderClass"
                        :span-method="objectSpanMethod"
                        >
                <el-table-column label="部门" :index="i.own_people.length">
                  <template>
                    <el-select
                      v-model="i.ouid"
                      filterable
                      clearable
                      allow-create
                      :placeholder="placeholder"
                      style="width: 100%;"
                      @blur="valiedate"
                      @change="selChange(index)"
                    >
                      <el-option
                        v-for="item in $attrs.selOptions[0]"
                        :key="item.ouid"
                        :label="item.ou_name"
                        :value="item.ouid">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="责任人">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.own_people_id"
                      filterable
                      clearable
                      allow-create
                      placeholder="请选择责任人"
                      @blur="valiedate"
                      @change="userChange(index, scope.$index)"
                      style="width: 100%;"
                    >
                      <el-option
                        v-for="item in $attrs.selOptions[1]"
                        :key="item.value"
                        :label="`(${item.value})${item.label}`"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="所占百分比">
                  <template slot-scope="scope">
                    <el-input style="width: 100%" @blur="valiedate" placeholder="请输入百分比" v-model="scope.row.persent"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" show-overflow-tooltip width="65px">
                  <div slot="header">
                    <el-button type="primary" icon="el-icon-plus" circle @click="addPeople(index)"/>
                  </div>
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-minus" circle @click="delPeople(index, scope.$index)"/>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
    <el-row>
      <el-col :sapn="8" :offset="8">
        <div style="border-top:dashed 1px darkgrey; border-bottom:dashed 1px darkgrey;width:300px;display:inline-block;
        margin:7px 17px;margin-bottom:0;text-align:center;">
          <el-button type="text" icon="el-icon-circle-plus-outline" @click="add">新增部门</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'SAI_select6',
    props: {
      value: Array,
      item: Object,
      placeholder: {
        type: String,
        default: '请输入名称'
      },
      required: true
    },
    computed: {
      val() {
        if(this.testArr(this.value)) {
          return this.value
        } else {
          return [{
            ouid: undefined,
            ou_name: undefined,
            own_people: [
              {
                own_people_id: undefined,
                own_people_name: undefined,
                persent: 100
              }
            ]
          }]
        }
      }
    },
    // watch: {
    //   val: {
    //     handler(val) {
    //       this.$emit('input', val)
    //       this.valiedate()
    //     },
    //     deep: true,
    //     immediate: true
    //   }
    // },
    methods: {
      valiedate() {
        this.$nextTick(() => {
          this.$parent.$parent.$parent.$parent.$parent.$refs.editAppForm.validateField('blame_department_name')
        })
      },
      selChange(idx) {
        if(this.val[idx].ouid) {
          const fit = this.$attrs.selOptions[0].filter(v => v.ouid === this.val[idx].ouid)
          const val = [...this.val]
          val[idx].ou_name = fit[0] ? fit[0].ou_name : val[idx].ouid
          this.updateVal(val)
        }
      },
      userChange(idx, idxPeople) {
        const user = this.val[idx].own_people[idxPeople]
        if(user) {
          const fit = this.$attrs.selOptions[1].filter(v => v.value === user.own_people_id)
          const val = [...this.val]
          val[idx].own_people[idxPeople].own_people_name = fit[0] ? fit[0].label : user.own_people_id
          this.updateVal(val)
        }
      },
      add() {
        const lastItem = this.val.slice(-1,)[0]
        const lastItemPeople = lastItem ? lastItem.own_people.slice(-1,) : []
        const isChkPeople = lastItemPeople && lastItemPeople.length > 0
          && lastItemPeople[0].own_people_id && lastItemPeople[0].persent
        if (this.val.length > 0 && lastItem.ouid && isChkPeople) this.val.push(
          {
            ouid: undefined,
            ou_name: undefined,
            own_people: [
              {
                own_people_id: undefined,
                own_people_name: undefined,
                persent: 100
              }
            ]
          }
        )
        this.setPer()
      },
      addPeople(idx, idxPeople) {
        const lastItemPeople = this.val[idx].own_people.slice(-1,)[0]
        if (lastItemPeople.own_people_id) this.val[idx].own_people.push(
          {
            own_people_id: undefined,
            own_people_name: undefined,
          }
        )
        this.setPer()
      },
      testArr(arr){
        return arr && typeof arr === 'object' && arr instanceof Array && arr.length > 0
      },
      del(idx) {
        if(this.val.length > 1) {
          this.val.splice(idx, 1)
          this.setPer()
        }
      },
      delPeople(idx, idxPeople) {
        if(this.val[idx].own_people.length > 1) {
          this.val[idx].own_people.splice(idxPeople, 1)
          this.setPer()
        } else {
          this.del(idx)
        }
      },
      setPer() {
        const depPer = 100/this.val.length;
        const val = this.val.reduce((list, v) => {
          const own_people = v.own_people.reduce((peos, p) => {
            peos.push({...p, persent: depPer/v.own_people.length})
            return peos
          }, [])
          list.push({...v, own_people})
          return list;
        }, [])
        this.updateVal(val)
      },
      updateVal(val) {
        this.$emit('input', val)
        this.valiedate()
      },
      cellStyleClass() {
        return 'padding:6px 0'
      },
      deviceHeaderClass() {
        return 'text-align: center;background:#f5f7fa;color:#56585c;padding:6px 0 5px 0;border-right-width: 0;'
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex === 0) {
            return {
              rowspan: column.index,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
       }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .channel_name {
    position: relative;
    top: 1px;
    z-index: 9999;
    background-color: #A3D3FF;
    border: solid 1px lightsteelblue;
    width: 200px;
    height: 26px;
    line-height: 26px;
    border-bottom-width: 0;
    width: 200px;
    overflow-x: visible;
    overflow-y: visible;
    border-radius: 7px 7px 0px 0px;
    text-align: center;
  }
  .el-table {
    border: 1px solid lightsteelblue;
    border-radius: 0px 7px 7px 7px;
    margin-bottom: 10px;
  }
</style>
