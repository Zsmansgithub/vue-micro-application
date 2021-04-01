<template>
  <div class="app-container">
    <div v-html="content" style="margin:0 100px;"/>
  </div>
</template>

<script>
import { getHelpDocContent } from '@/api/management/help_doc'

export default {
  name: 'helpDocPreview',

  data() {
    return {
      content: '',
    }
  },

  created() {
    let content = this.$route.params.content
    // if(content) {
    //   localStorage.setItem("help_doc_preview", content);
    // }

    let q_obj = this.$route.query
    // if(q_obj.id || (q_obj.board && q_obj.title)) {
      getHelpDocContent(q_obj).then(response => {
        this.content = response.content
        // localStorage.setItem("help_doc_preview", this.content)
      })
    // }
  },

}
</script>
