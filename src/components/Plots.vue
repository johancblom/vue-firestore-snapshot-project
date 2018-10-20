<template>
  <div class="plots container">
    <div class="row">
      <span class="title left">All plots</span>

      <a v-if="!filtering" v-on:click="filterPlots" class="btn btn-primary green right">Show Only Unoccupied Plots<i class="large material-icons">filter_list</i></a>
      <a v-if="filtering" v-on:click="filterPlots" class="btn btn-primary green right">Show All Plots<i class="large material-icons">filter_list</i></a>
    </div>
    <div class="row">
        <div class="col s6 m3" v-for="plot in filteredPlots" :key="plot.id">
          <div class="card">
            <div class="card-content">
              <p >Plot no: {{plot.id}}</p>
              <p >size: {{plot.size}}</p>
              <p>tenant: {{plot.tenant}}</p>
            </div>
            <div class="card-action">
              <router-link class="btn-floating left halfway-fab waves-effect green" :to="{ name: 'EditPlot', params: {plot_id: plot.id}}"><i class="material-icons">edit</i></router-link>
              <a class="btn-floating halfway-fab waves-effect waves-light red" @click="remove(plot.id)"><i class="material-icons">delete</i></a>
            </div>

          </div>
        </div>
    </div>
    
    <div class="fixed-action-btn">
      <router-link :to="{ name: 'NewPlot'}" class="btn-floating btn-large blue-darken-2">
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
  name: "plots",
  data() {
    return {
      plots: [],
      filteredPlots: [],
      plotsRef: null,
      tenantsRef: null,
      filtering: false
    };
  },
  created() {
    this.plotsRef = db.collection("plots");
    this.tenantsRef = db.collection("tenants");
    collectionChanges(this.plotsRef).subscribe(snapshot => {
      snapshot.forEach(change => {
        if (change.type === "added") {
          let plot = change.doc.data();
          this.tenantsRef.doc(plot.tenant).get().then(tenant => {
            console.log(tenant.data());
            plot.id = change.doc.id;
            plot.tenant = tenant.data().lastName;
          });
          console.log(plot);
          this.plots.push(plot);
        } else if (change.type === "modified") {
          for (var key in change.doc.data()) {
            Vue.set(this.plots, change.newIndex, {
              ...this.plots[change.newIndex],
              [key]: change.doc.data()[key]
            });
          }
        } else if (change.type === "removed") {
          console.log("removing change: " + change);
          this.plots = this.plots.filter(plot => plot.id != change.doc.id);
        }
        this.filteredPlots = [...this.plots];
      });
    });
  },
  methods: {
    remove: function(id) {
      this.plotsRef
        .doc(id)
        .delete()
        .then(() => {
          console.log("plot successfully deleted!");
        })
        .catch(err => console.log(err));
    },
    filterPlots: function() {
      this.filtering = !this.filtering;
      if (this.filtering) {
        this.filteredPlots = this.plots.filter(plot => plot.tenant == "Nobody")
      }
      else {
        this.filteredPlots = [...this.plots];
      }
    }
  }
};
</script>

<style scoped>
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

.btn.right {
  width: auto;
  max-width: none
}
</style>