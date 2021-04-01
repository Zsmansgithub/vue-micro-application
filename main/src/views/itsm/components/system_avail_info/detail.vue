<template>
  <el-dialog title="详情" :visible.sync="detailsDialog" width="1000px" :before-close="doClose" append-to-body
    :lock-scroll='true'>
    <div>
      <card-detail typeCard='success' title="基础信息" icon="detail_info">
        <div class="detail-wrapper">
          <dom-item v-for="(item, index) in dataItemKeys1" :key="`definfo_${index}`" :data="item"></dom-item>
        </div>
      </card-detail>
      <card-detail typeCard='dealwith' title="处理信息" icon="detail_info">
        <div class="detail-wrapper">
          <dom-item v-for="(item, index) in dataItemKeys2" :key="`dealinfo_${index}`" :data="item"></dom-item>
        </div>
      </card-detail>
      <card-detail typeCard='primary' title="其他信息" icon="detail_form">
        <table width="100%">
          <col width="50%" />
          <col width="50%" />
          <div class="detail-wrapper">
            <dom-item v-for="(item, index) in dataItemKeys3" :key="`otherinfo_${index}`" :data="item"></dom-item>
            <dom-item v-for="(item, index) in dataItem.file_json" :key="`customizeinfo_${index}`" :data="item">
            </dom-item>
          </div>
        </table>
      </card-detail>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="doClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { star } from './e_rate';
  import CardDetail from "@/components/CardDetail";
  const domItem = {
    render: function (createElement) {
      const textFilter = {
        'e_link': (text) => { return text },
        'e_open': (text) => { return this.openArray(text) },
        'e_rate': (text) => { return [star(createElement, text)] },
        'date1': (text) => { return this.date1(text) },
        'e_company': (text) => { return text === '-' ? text : `${text}分钟` },
        'project_type': (text) => { return [project_type(text)] },
        'departments': (text) => { return text === '-' || text.length === 0 ? '-' : departments(text) },
      }
      const project_type = (text) => {
        const index = ['标准类', '维护类', '重构类'].findIndex(v => v === text);
        if (index > -1) {
          const attrs = [{ size: 'medium' }, { size: 'medium', type: "success" }, { size: 'medium', type: "info" }]
          return createElement('el-tag', {
            attrs: attrs[index],
            domProps: {
              innerHTML: `${text}`
            }
          })
        } else {
          return text
        }
      }
      const departments = (text) => {
        const Nls = text.reduce((nodeList, v) => {
          const nodeListPeople = v.own_people && v.own_people.reduce((nodeListPeople, p) => {
            nodeListPeople.push(createElement('div',
              {
                style: { display: 'block' },
                domProps: { innerHTML: `${v.ou_name} ${p.own_people_name} ${this.intPer(p.persent)}%` }
              }))
            return nodeListPeople
          }, [])
          nodeList = nodeList.concat(nodeListPeople)
          return nodeList
        }, [])
        return createElement('div', { style: { 'vertical-align': 'top' } }, Nls)
      }
      const itemtd = (val) => {
        const text = val.value || val[val.key] || '-';
        let vnode = text;
        if (val.filters) vnode = textFilter[val.filters](text);
        return createElement('div',
          { class: 'del-item', },
          [
            createElement('b', val.name + '：'),
            vnode,
          ]
        )
      }
      return itemtd(this.data)
    },
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    inject: ['openArray', 'date1', 'intPer']
  }
  export default {
    components: { domItem, CardDetail },
    computed: {
      dataItemKeys1() {
        return this.dataItem.fixkeys.filter((v) => v.infoType === 'info1').sort((a, b) => a.sortDetail - b.sortDetail)
      },
      dataItemKeys2() {
        return this.dataItem.fixkeys.filter((v) => v.infoType === 'info2').sort((a, b) => a.sortDetail - b.sortDetail)
      },
      dataItemKeys3() {
        return this.dataItem.fixkeys.filter((v) => v.infoType === 'info3').sort((a, b) => a.sortDetail - b.sortDetail)
      }
    },
    props: {
      dataItem: Object,
      detailsDialog: Boolean
    },
    methods: {
      doClose() {
        this.$emit('update:detailsDialog', false);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .detail-wrapper {
    font-size: 15px;
    padding: 5px;
  }

  /deep/ .del-item {
    display: inline-block;
    width: 50%;
    padding: 10px;
    line-height: 1.5rem;
    word-wrap: break-word;
    vertical-align: top;

    &>div {
      display: inline-block;
    }
  }
</style>