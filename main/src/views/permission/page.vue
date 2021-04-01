<template>
  <div class="app-container">
    <div>fsfsfsf</div>
    <switch-roles @change="handleRolesChange" />

  </div>
</template>

<script>
import SwitchRoles from './components/SwitchRoles'

export default {
  name: 'PagePermission',
  components: { SwitchRoles },
  methods: {
    handleRolesChange() {
      this.$router.push({ path: '/manager/permission/index?' + +new Date() })
    }
  }
}
</script>
