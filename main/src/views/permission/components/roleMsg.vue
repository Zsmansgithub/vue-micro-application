<template>
    <div>
      <div class="tags-wrapper" v-if="!$attrs.isGroup">
        <span v-for="tag in roles" :key="tag.id"
              class="el-tag el-tag--small el-tag--light">{{tag.name}}<i
          @click="checkRole(tag)" class="el-tag__close el-icon-close"></i>
        </span>
      </div>
      <div class="role-list" :key="`roleList${$attrs.isGroup}`" :style="{height: $attrs.isGroup ? '520px' : '350px'}" ref="ul_filter">
        <el-scrollbar class="el-scrollbar-x" style="height: 100%">
          <ul v-infinite-scroll="load" style='list-style: none;padding: 0;margin: 0;'>
              <li class="role-list-item">
                <div class="item1" ref="ul_filter1">
                  <span @click="showFilterUl('id')">ID<i class="el-icon-arrow-down el-icon-arrow-up"></i></span>
                  <filter_ul @dofilter="filterullist" @doreset="reset" class="filter-ul" v-show="filterDom.id" v-model="filter.id"></filter_ul>
                </div>
                <div class="item2" :style="{flex: $attrs.isGroup ? '1' : '0 0 150px'}" ref="ul_filter2"><span @click="showFilterUl('name')">组名<i class="el-icon-arrow-down el-icon-arrow-up"></i></span>
                  <filter_ul @dofilter="filterullist" @doreset="reset" class="filter-ul" v-show="filterDom.name" v-model="filter.name"></filter_ul>
                </div>
                <div class="item3" v-if="!$attrs.isGroup">详情</div>
              </li>
              <li v-for="item in listul" class="role-list-item" :class="{'is-active': item.id === activeId && $attrs.isGroup}" :key='item.id' @click="hvr(item)">
                <div class="item1"><el-checkbox :key="`${item.id}${role_list.includes(item.id)}`" :checked="role_list.includes(item.id)" @change="checkRole(item)">{{ item.id }}</el-checkbox></div>
                <div class="item2" :style="{flex: $attrs.isGroup ? '1' : '0 0 150px'}">{{item[options.name]}}</div>
                <div class="item3" v-if="!$attrs.isGroup">{{item.detail}}</div>
              </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
</template>

<script>
  import filter_ul from './filter_ul'
  export default {
    props: {
      role_list: Array,
      list: Array,
      options: {
        type: Object,
        default: () => { return {name: 'name'} }
      }
    },
    components: {filter_ul},
    computed: {
      roles() {
        return this.list.filter(v => this.role_list.includes(v.id))
      }
    },
    watch: {
      list: {
        handler(val) {
            this.listFilter = val
            this.listul = val.slice(0, 20)
          },
          immediate: true
        }
    },
    data() {
      return {
        listFilter: [],
        listul: [],
        filter: {
          id: '',
          name: '',
        },
        filterDom: {
          id: false,
          name: false,
        },
        activeId: undefined,
      }
    },
    mounted() {
      window.addEventListener('click', this.closeDom)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('click', this.closeDom)
      })
    },
    methods: {
      checkRole(row) {
        this.hvr(row)
        let ids = this.$utils.index.deepClone(this.role_list)
        const idx = ids.findIndex((v) => { return v === row.id})
        idx === -1
          ? ids.push(row.id)
          : ids.splice(idx, 1)
        this.$emit('update:role_list', ids)
      },
      load() {
        const list = this.listFilter.length > 0 ? this.listFilter : this.list
        if (this.listul.length < list.length) {
          let idx = this.listul.length;
          this.listul =this.listul.concat(list.slice(idx, idx + 20))
        }
      },
      showFilterUl(key) {
        this.filterDom = Object.assign({}, this.$options.data().filterDom, {[key]: !this.filterDom[key]})
      },
      filterullist() {
        this.listFilter = this.list.reduce((list, v) => {
          const name = v[this.options.name]
          if(name.includes(this.filter.name) && v.id.toString().includes(this.filter.id)) list.push(v)
          return list;
        }, [])
        this.listul = this.listFilter.slice(0, 20)
        this.filterDom = this.$options.data().filterDom;
      },
      reset() {
        this.filter = this.$options.data().filter;
        this.listFilter = this.list;
        this.listul = this.listFilter.slice(0, 20);
        this.filterDom = this.$options.data().filterDom;
      },
      closeDom($event) {
          let sp;
          if (this.filterDom.id) {
            sp = this.$refs.ul_filter1;
          }
          if (this.filterDom.name) {
            sp = this.$refs.ul_filter2;
          }
          if(sp && $event && !sp.contains($event.target)){
            this.filterDom = this.$options.data().filterDom;
          }
      },
      hvr(item) {
        this.activeId = item.id;
        this.$emit('hv', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
.tags-wrapper {
  padding: 10px 0;
  min-height: 48px;
  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.role-list {
  height: 350px;
  padding: 0;
  margin: 0;
  .is-active {
    background: #f5f7fa!important;
  }
  .role-list-item {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #ebeef5;
    cursor: default;
    &:nth-child(even){
      background: #FAFAFA;
    }
    &:hover {
      background-color: #f5f7fa;
    }
    .item1 {
      flex: 0 0 70px;
      padding: 0 10px;
      position: relative;
    }
    .item2 {
      flex: 0 0 150px;
      position: relative;
    }
    .item3 {
      flex: 1;
    }
    .filter-ul {
      width: 100px;
      position: absolute;
      top: 20px;
      left: 0;
      transform-origin: center top;
      z-index: 2094;
    }
    .el-icon-arrow-down {
      font-size: 9px;
    }
  }
}
.el-scrollbar-x /deep/ {
  .el-scrollbar__wrap {
      overflow-x: auto;
    }
}
</style>
