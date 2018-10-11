<template>
  <div class="tenants container">
    <h1>This is the tenants page</h1>
    <div class="row">
        <div class="col s6 m3 card" v-for="tenant in tenants" :key="tenant.id">
          <div class="card-content">
            <span class="card-title">First Name: {{tenant.firstName}}</span>
            <span class="card-title">Last Name: {{tenant.lastName}}</span>
          </div>
          <div class="card-action">
            <div class="btn" id="edit"><router-link :to="{ name: 'EditTenant', params: {tenant_id: tenant.id}}"><i class="material-icons">edit</i></router-link></div>
            <div class="btn" v-on:click.prevent="remove(tenant.id)"><i class="material-icons">delete</i></div>
          </div>
        </div>
    </div>
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
          plots: [],
          tenantsRef: null
      }
  },
  created() {
    this.tenantsRef = db.collection('tenants');
    collectionChanges(this.tenantsRef)
      .subscribe(snapshot => {
                snapshot.forEach(change => {
                  if (change.type === 'added') {
                    let tenant = change.doc.data();
                    tenant.id = change.doc.id;
                    this.tenants.push(tenant)
                  }
                  else if(change.type === 'modified') {
                    for (var key in change.doc.data()) {
                      Vue.set(this.tenants, change.newIndex, {...this.tenants[change.newIndex], [key]: change.doc.data()[key]})
                    }
                  }
                  else if (change.type === 'removed') {
                    console.log("removing change: " + change);
                    this.tenants = this.tenants.filter(tenant => tenant.id != change.doc.id)
                  }
                })
          })
  },
  methods: {
    remove: function(id) {
      this.tenantsRef.doc(id).delete().then(() => {
        console.log("tenant successfully deleted!")
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style scoped>
.card {
  margin: 20px;
}
#edit a {
  color: white;
}
.btn {
  margin: 0 5px;
  background-color: #42b983;
  max-width: 50px;
}

</style>