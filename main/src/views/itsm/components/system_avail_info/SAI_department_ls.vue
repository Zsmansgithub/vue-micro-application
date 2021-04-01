<template>
  <div style="position: relative;padding-right: 10px;cursor: default" @click.stop="isShowMore = !isShowMore">
    <tip-text
      v-if="ls && ls[0]"
      :classStr="'textO text2'"
      :text="fixText(ls[0])"/>
    <template v-if="showMore">
      <i
        class="el-icon-arrow-right"
        :class="{'is-active': isShowMore}"
      ></i>
      <transition name="el-zoom-in-top">
        <div v-show="isShowMore">
          <template v-for="(j, index) in ls">
            <template v-for="(item, idxPeople) in j.own_people">
              <tip-text
                v-if="index !== 0 || idxPeople !== 0"
                :classStr="'textO text2'"
                :key="`${index}${idxPeople}`"
                :text="`${j.ou_name} ${item.own_people_name} ${ intPer(item.persent) }%`"/>
            </template>
          </template>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
  import TipText from '@/components/TipText/Tip_Text'
  export default {
    name: 'SAI_department_ls',
    data() {
      return {
        isShowMore: false
      }
    },
    methods: {
      fixText(item) {
        if(item.own_people && item.own_people[0]) {
          return `${item.ou_name} ${item.own_people[0].own_people_name} ${ this.intPer(item.own_people[0].persent) }%`
        } else {
          return '-'
        }
      }
    },
    computed: {
      showMore() {
        return this.ls.length > 1
      }
    },
    components: {
      TipText
    },
    props: {
      ls: Array
    },
    inject: ['intPer']
  }
</script>

<style lang="scss" scoped>
.el-icon-arrow-right {
  position: absolute;
  right: 0;
  top: 4px;
  transition: all .3s;
}
.is-active {
  transform: rotate(90deg);
}
</style>
