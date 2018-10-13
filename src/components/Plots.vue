<template>
  <div class="plots container">
    <h1>All plots</h1>
    <div class="row">
        
        <div class="col s6 m3" v-for="plot in plots" :key="plot.id">
          <div class="card">
            <div class="card-content">
              <p >Plot no: {{plot.id}}</p>
              <p >size: {{plot.size}}</p>
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
      plotsRef: null
    };
  },
  created() {
    this.plotsRef = db.collection("plots");
    collectionChanges(this.plotsRef).subscribe(snapshot => {
      snapshot.forEach(change => {
        if (change.type === "added") {
          let plot = change.doc.data();
          plot.id = change.doc.id;
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
</style>