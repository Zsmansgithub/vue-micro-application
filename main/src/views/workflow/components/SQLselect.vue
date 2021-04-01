<template>
    <el-form>
        
    </el-form>
</template>
<script>
export default {
    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    group_name: null,
                    instance_name: null,
                    db_name: []
                }
            }
        },
        groupOptions: {
            type: Array,
            default: () => []
        },

    },
    computed: {
        val: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        }
    },
    data () {
        return {
            instanceOptions: [],
            dbOptions: []
        }
    },
    methods:{}
}
</script>
<style lang="scss" scoped>
</style>