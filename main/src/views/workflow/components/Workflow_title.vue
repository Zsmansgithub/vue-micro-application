<template>
  <div class="content">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span class="title">{{name}}</span>
        <!-- <span class="title">{{this.newAppForm.routeParams && this.newAppForm.routeParams.name}}</span> -->
        <a class="link" @click="getHelpDoc">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>帮助指引</a>
        <br>
      </el-col>
    </div>
</template>
<script>
export default {
  props: {
    name: String,
    help_doc_url: String
  },
  data () {
   return {}
  },
   methods:{
      getHelpDoc() {
        if(this.help_doc_url) this.$router.push('/'+this.help_doc_url.split('/')[2])
      }
   }
}
</script>
<style lang="scss" scoped>
  .content {
    padding:20px 0 60px 0;
  }
  .title {
      font-size:1.17em;
      font-weight:bold;
      color:#48096b;
    }
    .link {
      font-size:15px;
      color: red;
    }
</style>