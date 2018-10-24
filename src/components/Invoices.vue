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
        <button class="btn" @click="decrementPage" :disabled="page==1"><i class="material-icons">chevron_left</i></button>
        <button class="btn" @click="incrementPage" :disabled="page==numPages"><i class="material-icons">chevron_right</i></button>
        <div class = "col s12" >
          <pdf ref="pdfComponent" :src="url" :page="page" @num-pages="showNumberOfPages($event)" class="invoice" ></pdf>
        </div>
        <button class="btn" @click="$refs.pdfComponent.print()"><i class="material-icons">print</i></button>
      </div>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";
import { storage } from "@/firebase/init";
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
      tenants: [],
      filteredTenants: [],
      tenantsRef: null,
      storageRef: null,
      invoicesRef: null,
      search: "",
      pdfList: [],
      url: "",
      numPages: 0,
      page: 1
    };
  },
  filters: {
    capitalize: item => item.toUpperCase()
  },
  created() {
    this.tenantsRef = db.collection("tenants");
    this.tenantsRef.get().then(snap => {
      snap.forEach(tenant => {
        this.tenants.push({id: tenant.id, lastName: tenant.data().lastName})
      })
    })
    this.storageRef = storage.ref();
    this.invoicesRef = this.storageRef.child('tenants/allTenants.pdf');
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
      if (this.search !== "") {
        const id = this.tenants.filter(tenant => tenant.lastName == this.search)[0].id
        this.invoicesRef = this.storageRef.child('tenants/'+id+'.pdf')
        this.page = 1
      } else {
        this.invoicesRef = this.storageRef.child('tenants/allTenants.pdf')
      }
      this.invoicesRef.getDownloadURL().then(url => {
        this.url = url
      }).catch(err => console.log(err));
    },
    showNumberOfPages: function(e) {
      this.numPages = e;
    },
    incrementPage: function() {
      if (this.page == this.numPages) {
        null;
      } else {
        this.page++;
      }
    },
    decrementPage: function() {
      if (this.page == 1) {
        null;
      } else {
        this.page--;
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
  display: inline-block;
  width: 100%;
}
</style>