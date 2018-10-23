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
          <pdf :src="url" :page="1" @num-pages="showNumberOfPages($event)" class="invoice" ></pdf>
        </div>
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
      search: "",
      pdfList: [],
      url: ""
    };
  },
  filters: {
    capitalize: item => item.toUpperCase()
  },
  mounted() {
    const storageRef = storage.ref();
    const invoicesRef = storageRef.child('tenants/out.pdf');
    const path = invoicesRef.fullPath;
    invoicesRef.getDownloadURL().then(url => {
      this.url = url
    }).catch(err => console.log(err));

    
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
    },
    showNumberOfPages: function(e) {
      console.log(e);
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