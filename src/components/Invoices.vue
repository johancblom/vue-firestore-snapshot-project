<template>
  <div class="invoices container">
    <form v-on:submit.prevent="getfilteredData">
      <div class="row">
        <div class="col s8">
          <span class="title left">All invoices</span>
        </div>
        <div class="col s1">
          <button type="submit" class="btn btn-primary green"><i class="material-icons">search</i></button>
        </div>
        <div class="col s3">
          <input type="text" class="form-control" placeholder="Enter a name  ..." v-model="search">
        </div>
        <div>
          <a id="invoices"></a>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";
import { collectionData, collectionChanges } from "rxfire/firestore";
import { tap } from "rxjs/operators";
import firebase from 'firebase';
import Vue from "vue";
export default {
  name: "tenants",
  data() {
    return {
      storageRef: null,
      tenantsRef: null,
      search: ""
    };
  },
  filters: {
    capitalize: item => item.toUpperCase()
  },
  created() {
    const storage = firebase.storage();
    this.storageRef = storage.refFromURL('gs://vue-firestore-snapshot-project.appspot.com')
    this.tenantsRef = db.collection("tenants");
    this.tenantsRef.get().then(snap => {
      snap.forEach(doc => {
        this.storageRef.child(`tenants\/${doc.id}.pdf`).getDownloadURL().then(url => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = event => {
            const blob = xhr.response;
            console.log(blob);
            const link = document.getElementById('invoices')
            link.href= window.URL.createObjectURL(blob)
            link.download='test.pdf'
            link.click()
          };
          xhr.open('GET', url);
          xhr.send();
        })
      })
    })
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
  font-size: 4.2rem;
  font-weight: 400;
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