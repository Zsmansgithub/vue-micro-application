<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="rowAdd" :rules="rules" label-width="80px">
      <el-form-item label="板块" prop="board" >
        <el-select v-model="rowAdd.board" placeholder="请选择板块" filterable clearable style="width:470px">
          <el-option v-for="item in boards" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title" style="width:550px">
        <el-input v-model="rowAdd.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <!-- <el-form-item label="URL" style="width:550px">
        <el-input v-model="rowAdd.url" placeholder="格式:/?board=板块&title=标题"></el-input>
      </el-form-item> -->
      <el-form-item label="内容" prop="content">
        <tinymce v-model="rowAdd.content" :height="500" />
      </el-form-item>
      <!-- <el-form-item label="内容" prop="content">
        <markdown-editor v-model="rowAdd.content" />
      </el-form-item> -->

      <el-form-item style="float:right;margin-top:0 100px 0 0;">
        <el-button type="primary" @click="submit('dataForm', rowAdd)">提交</el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MarkdownEditor from '@/components/MarkdownEditor'
import { addRow, editRow, getBoardNames } from '@/api/management/help_doc'
import { mapGetters } from 'vuex'

export default {
  name: 'helpDocEdit',
  components: { Tinymce, MarkdownEditor },

  data() {
    return {

      boards: [],

      rowAdd: {
        id: '',
        board: '',
        title: '',
        url: '',
        content: '',
        change_user: this.name,
      },

      flag: undefined,

      rules: {
        board: [
          { required: true, message: '请选择板块', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'change'},
          { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' }
        ],
      },

    }
  },

  created() {
    getBoardNames().then(response => {
      this.boards = response
    })

    let flag = this.$route.params.flag
    let row = ''
    if(flag==='add') {
      localStorage.setItem('help_doc_edit_flag', flag)
    } else if(flag==='edit') {
      row = this.$route.params.row
      localStorage.setItem('help_doc_edit_flag', flag)
      localStorage.setItem('help_doc_edit_row_id', row.id)
      localStorage.setItem('help_doc_edit_row_board', row.board)
      localStorage.setItem('help_doc_edit_row_title', row.title)
      localStorage.setItem('help_doc_edit_row_url', row.url)
      localStorage.setItem('help_doc_edit_row_content', row.content)
    }
    flag = localStorage.getItem('help_doc_edit_flag')
    if(flag==='add') {
      this.flag = 'add'
      this.rowAdd = {
        id: '',
        board: '',
        title: '',
        url: '',
        content: '',
        change_user: this.name,
      }
    } else if(flag==='edit') {
      this.flag = 'edit'
      this.rowAdd.id = localStorage.getItem('help_doc_edit_row_id')
      this.rowAdd.board = Number(localStorage.getItem('help_doc_edit_row_board'))
      this.rowAdd.title = localStorage.getItem('help_doc_edit_row_title')
      this.rowAdd.url = localStorage.getItem('help_doc_edit_row_url')
      this.rowAdd.content = localStorage.getItem('help_doc_edit_row_content')
    }

    // if(this.$route.params.flag==='edit') {
    //   this.flag = 'edit'
    //   let row = this.$route.params.row
    //   this.rowAdd.id = row.id
    //   this.rowAdd.board = row.board
    //   this.rowAdd.title = row.title
    //   this.rowAdd.content = row.content
    // } else if(this.$route.params.flag==='add'){
    //   this.flag = 'add'
    // }

  },

  computed: {
    ...mapGetters(['roles', 'name'])
  },

  methods: {
    submit(formName, row) {
      if(this.flag==='add') {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let rowInsertAdd = {
              board: '',
              title: '',
              url: '',
              content: '',
              change_user: this.name
            }
            rowInsertAdd.board = this.rowAdd.board
            rowInsertAdd.title = this.rowAdd.title
            // rowInsertAdd.url = '/#/help_doc_preview?board=' + this.rowAdd.board + '&title=' + this.rowAdd.title
            rowInsertAdd.content = this.rowAdd.content
            addRow(rowInsertAdd).then(response => {
              this.$notify({
                title: '成功',
                message: '添加记录成功',
                type: 'success',
                duration: 3000
              })
              this.getRowsInf()
            }).catch(error => {
              if (error.response) {
                this.$notify({
                  title: '添加失败',
                  message: '添加失败',
                  type: 'error',
                  duration: 3000
                })
              }
            })
            this.$refs[formName].resetFields()
            this.$router.push({ name: 'help_doc' })
          }
        })
      } else if(this.flag==='edit') {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let rowEdit = {
              id: '',
              board: '',
              title: '',
              url: '',
              content: '',
              change_user: this.name
            }
            rowEdit.id = this.rowAdd.id
            rowEdit.board = this.rowAdd.board
            rowEdit.title = this.rowAdd.title
            // rowEdit.url = '/#/help_doc_preview?board=' + this.rowAdd.board + '&title=' + this.rowAdd.title
            rowEdit.content = this.rowAdd.content
            editRow(rowEdit.id, rowEdit).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.getRowsInf()
            }).catch(error => {
              if (error.response) {
                this.$notify({
                  title: '修改失败',
                  message: '该记录修改失败',
                  type: 'error',
                  duration: 3000
                })
              }
            })
            this.$refs[formName].resetFields()
            this.$router.push({ name: 'help_doc' })
          }
        })
      }
    },

  }

}
</script>