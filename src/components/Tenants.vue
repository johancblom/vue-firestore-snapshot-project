<template>
  <div class="tenants">
    <h1>This is the tenants page</h1>
    <ul>
        <li v-for="tenant in tenants" :key="tenant.id">
            <router-link :to="{ name: 'EditTenant', params: {tenant_id: tenant.id}}">{{tenant.lastName}}</router-link>
        </li>
    </ul>
  </div>
</template>

<script>
import db from '@/firebase/init'
import { collectionData } from 'rxfire/firestore'
import { tap } from 'rxjs/operators'
export default {
  name: 'tenants',
  data() {
      return {
          tenants: [],
          plots: []
      }
  },
  created() {
    const tenantsRef = db.collection('tenants');
    collectionData(tenantsRef, 'id')
      .subscribe(tenants => {
                this.tenants = tenants;
          })
  }
}
</script>

<style>

</style>