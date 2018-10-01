<template>
  <div class="tenants">
    <h1>This is the tenants page</h1>
    <ul>
        <li v-for="tenant in tenants" :key="tenant.id">
            <span>{{tenant.lastName}}</span>
        </li>
    </ul>
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  name: 'tenants',
  data() {
      return {
          tenants: []
      }
  },
  created() {
    db.collection('tenants').get().then( snapshot => {
          snapshot.forEach(doc => {
              let tenant = doc.data();
              tenant.id = doc.id;
              this.tenants.push(tenant);
      })
    })
  }
}
</script>

<style>

</style>