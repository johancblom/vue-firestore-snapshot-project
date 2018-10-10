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
import { collectionData, collectionChanges } from 'rxfire/firestore'
import { tap } from 'rxjs/operators'
import Vue from 'vue'
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
    collectionChanges(tenantsRef)
      .subscribe(snapshot => {
                snapshot.forEach(doc => {
                  if (doc.type === 'added') {
                    console.log(doc.doc.id)
                    let tenant = doc.doc.data();
                    tenant.id = doc.doc.id;
                    this.tenants.push(tenant)
                  }
                  else if(doc.type === 'modified') {
                    for (var key in doc.doc.data()) {
                      Vue.set(this.tenants, doc.newIndex, {...this.tenants[doc.newIndex], [key]: doc.doc.data()[key]})
                    }
                  }
                  else if (doc.type === 'removed') {
                    this.tenants.splice(doc.oldIndex, 1)
                  }
                })
          })
  }
}
</script>

<style>

</style>