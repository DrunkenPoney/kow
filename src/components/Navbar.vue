<template>
  <Menubar :model="items" class="navbar">
    <template #start>
      <img alt="Logo"
           src="@/assets/logo.png"
           class="p-mr-2"
           :height="40"/>
    </template>
  </Menubar>
</template>

<script>
import Menubar from 'primevue/menubar'
import '@/assets/logo.png'

export default {
  name: "Navbar",
  components: { Menubar },
  data() {
    return {
      items: [{
        label: 'Trust',
        icon: 'pi pi-chart-line',
        to: '/'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  border-radius: 0;
}
</style>