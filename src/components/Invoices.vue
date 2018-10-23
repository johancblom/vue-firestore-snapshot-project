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
      </div>
      <div class="row">
        <div class = "col s12" >
          <pdf v-for="doc in pdfList" :key=doc.id :src=doc.address class="invoice" ></pdf>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";
import { collectionData, collectionChanges } from "rxfire/firestore";
import { tap } from "rxjs/operators";
import firebase from "firebase";
import Vue from "vue";
import pdf from "vue-pdf";

export default {
  name: "tenants",
  components: {
    pdf
  },
  data() {
    return {
      storageRef: null,
      tenantsRef: null,
      search: "",
      pdfList: []
    };
  },
  filters: {
    capitalize: item => item.toUpperCase()
  },
  created() {
    const storage = firebase.storage();
    this.storageRef = storage.refFromURL(
      "gs://vue-firestore-snapshot-project.appspot.com"
    );
    this.tenantsRef = db.collection("tenants");
    this.tenantsRef.get().then(snap => {
      snap.forEach(doc => {
        if (doc.id != 'nobody') {
          this.pdfList.push({id: doc.id, address: 'https://firebasestorage.googleapis.com/v0/b/vue-firestore-snapshot-project.appspot.com/o/tenants%2F'+doc.id+'.pdf?alt=media'});
        }
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

.invoice {
  border: solid black; 
  border-width: 1px;
  margin: 20px;
}
</style>