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
      .pipe(
        tap(tenants => console.log('This is just an observable!'))
      )
      .subscribe(snapshot => {
          snapshot.forEach(doc => {
              console.log(doc);
              if ((this.tenants.filter(tenant => tenant.id === doc.id)).length == 0) {
                console.log('new tenant identified ', doc.type)
                let tenant = doc;
                tenant.id = doc.id;
                let plots = doc.plots;
                if (plots && plots.length > 0) {
                  let i = 0;
                  for (i = 0; i < plots.length; i++) {
                    plots[i].get().then(doc => {
                      console.log(doc.id, doc.data().size)
                    })
                    }
                }
                this.tenants.push(tenant);
              }
          })
      })
  }
}
</script>

<style>

</style>