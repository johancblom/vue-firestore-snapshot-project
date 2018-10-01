<template>
  <div class="home">
    <Tenants/>
  </div>
</template>

<script>
// @ is an alias to /src
import Tenants from '@/components/Tenants.vue'

export default {
  name: 'home',
  components: {
    Tenants
  }
}
</script>
