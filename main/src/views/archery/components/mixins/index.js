import {
    getGroupInstance,
    getSqlRollBackDb,
    instanceFuzzy,
    searchByInstance
} from '@/api/archery/sql_workflow'
export default {
    data() {
        return {
            instanceOptions: [], // 实例名
            dbOptions: [], // DB/schema名称
            loading: false
        }
    },
    methods: {
        // sql美化
        range() {
            const select_sqlContent = this.editor.session.getTextRange(
                this.editor.getSelectionRange()
            )
            let sqlContent = select_sqlContent || this.editor.session.getValue()
            sqlContent = sqlFormatter.format(sqlContent)
            this.editor.setValue(sqlContent)
            this.editor.clearSelection()
        },
        // 获取实例名
        getSelInstances() {
            if (!this.group_name) {
                this.instanceOptions = []
                return
            }
            const data = {
                group_name: this.group_name,
                tag_code: 'can_write',
                query_all: 1
            }
            // 获取实例名
            getGroupInstance(data)
                .then(res => {
                    this.newAppForm.instance_name = ''
                    this.dbOptions = []
                    this.newAppForm.db_name = ''
                    if (Object.keys(this.newAppForm).includes('tb_name')) {
                        this.tbOptions = []
                        this.newAppForm.tb_name = ''
                    }
                    if (!res || res.status === 1) {
                        this.$message.error(res.msg || '出错了')
                        return
                    }
                    if (res.options) {
                        this.instanceOptions = res.options
                    }
                })
                .catch(e => {
                    console.error(e)
                })
        },
        // 获取数据库
        handleDb() {
            if (!this.newAppForm.instance_name) return
            getSqlRollBackDb({
                instance_name: this.newAppForm.instance_name,
                resource_type: 'database',
                query_all: 1
            }).then(res => {
                this.dbOptions = []
                this.newAppForm.db_name = ''
                if (Object.keys(this.newAppForm).includes('tb_name')) {
                    this.tbOptions = []
                    this.newAppForm.tb_name = ''
                }
                if (!res || res.status === 1) {
                    this.$message.error(res.msg || '出错了')
                    return
                }
                this.dbOptions = res.data || []
            })
            // 选择实例反选项目分组
            searchByInstance({ instance_name: this.newAppForm.instance_name })
                .then(res => {
                    for (const item of res.data) {
                        if (item.value) {
                            this.group_name = item.value
                            break
                        }
                    }
                })
                .catch(e => {
                    console.error(e)
                })
        },
        // 模糊搜索实例
        searchFuzzy(query) {
            const data = {
                instance_name: query,
                tag_code: 'can_write'
            }
            this.loading = true
            instanceFuzzy(data)
                .then(res => {
                    this.instanceOptions = res.options || []
                    this.dbOptions = []
                    this.newAppForm.db_name = undefined
                    if (Object.keys(this.newAppForm).includes('tb_name')) {
                        this.tbOptions = []
                        this.newAppForm.tb_name = undefined
                    }
                    this.group_name = undefined
                    this.loading = false
                })
                .catch(e => {
                    console.error(e)
                })
        }
    }
}
