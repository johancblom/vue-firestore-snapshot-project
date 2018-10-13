<template>
  <div class="tenants container">
    <form v-on:submit.prevent="getfilteredData">
      <div class="row">
        <div class="col s8">
          <span class="title left">All tenants</span>
        </div>
        <div class="col s1">
          <button type="submit" class="btn btn-primary green"><i class="material-icons">search</i></button>
        </div>
        <div class="col s3">
          <input type="text" class="form-control" placeholder="Enter a name  ..." v-model="search">
        </div>
      </div>
    </form>
    <div class="row">
        <div class="col s6 m3" v-for="tenant in filteredTenants" :key="tenant.id">
          <div class="card" >
            <div class="card-content">
              <p id="first-name">{{tenant.firstName}}</p>
              <p id="last-name">{{tenant.lastName | capitalize}}</p>
            </div>
            <div class="card-action">
              <router-link class="btn-floating left halfway-fab waves-effect green" :to="{ name: 'EditTenant', params: {tenant_id: tenant.id}}"><i class="material-icons">edit</i></router-link>
              <a class="btn-floating halfway-fab waves-effect waves-light red" @click="remove(tenant.id)"><i class="material-icons">delete</i></a>
            </div>
          </div>
        </div>
    </div>
    
    <div class="fixed-action-btn">
      <router-link :to="{ name: 'NewTenant'}" class="btn-floating btn-large blue-darken-2">
        <i class="large material-icons">add</i>
      </router-link>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import { collectionData, collectionChanges } from "rxfire/firestore";
import { tap } from "rxjs/operators";
import Vue from "vue";
export default {
  name: "tenants",
  data() {
    return {
      tenants: [],
      filteredTenants: [],
      plots: [],
      tenantsRef: null,
      search: ""
    };
  },
  filters: {
    capitalize: item => item.toUpperCase()
  },
  created() {
    this.tenantsRef = db.collection("tenants");
    collectionChanges(this.tenantsRef).subscribe(snapshot => {
      snapshot.forEach(change => {
        if (change.type === "added") {
          let tenant = change.doc.data();
          tenant.id = change.doc.id;
          this.tenants.push(tenant);
        } else if (change.type === "modified") {
          for (var key in change.doc.data()) {
            Vue.set(this.tenants, change.newIndex, {
              ...this.tenants[change.newIndex],
              [key]: change.doc.data()[key]
            });
          }
        } else if (change.type === "removed") {
          console.log("removing change: " + change);
          this.tenants = this.tenants.filter(
            tenant => tenant.id != change.doc.id
          );
        }
        this.filteredTenants = [...this.tenants];
      });
    });
  },
  methods: {
    remove: function(id) {
      this.tenantsRef
        .doc(id)
        .delete()
        .then(() => {
          console.log("tenant successfully deleted!");
        })
        .catch(err => console.log(err));
    },
    getfilteredData: function() {
      if (this.search === "") {
        this.filteredTenants = [...this.tenants];
      } else {
        this.filteredTenants = this.tenants.filter(tenant =>
          tenant.lastName.toUpperCase().includes(this.search.toUpperCase())
        );
      }
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 2.4rem;
  font-weight: bold;
  color: #444;
  margin-left: 20px;
}
#first-name {
  font-style: italic;
}
#last-name {
  font-weight: bold;
}
h1 {
  color: #444;
}
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