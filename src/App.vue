<template>
  <Navbar/>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from '@/components/Navbar.vue'
import cookies from 'js-cookie'

export default defineComponent({
  components: { Navbar },
  created() {
    if (cookies.get('username')) {
      cookies.set('username', <string> cookies.get('username'), {
        expires: 14
      })
    }
  }
})
</script>

<style lang="scss">
* {
  ::-webkit-scrollbar {
    width: 5px;
    background-color: var(--surface-d)
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--primary-color)
  }
}
</style>