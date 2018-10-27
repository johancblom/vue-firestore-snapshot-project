<template>
  <div class="users container">
    <form v-on:submit.prevent="getfilteredData">
      <div class="row">
        <div class="col s8">
          <span class="title left">All users</span>
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
        <div class="col s6 m3" v-for="user in filteredUsers" :key="user.id">
          <div class="card" >
            <div class="card-content">
              <p id="first-name">{{user.firstName}}</p>
              <p id="last-name">{{user.lastName | capitalize}}</p>
              <p id="disabled">Status: {{user.status}}</p>
              <p id="level">Level: {{user.level}}</p>
            </div>
            <div class="card-action">
              <a v-if="user.status=='disabled'" class="btn-floating halfway-fab waves-effect waves-light green left" @click="enable(user.id)"><i class="material-icons">check</i></a>
              <a v-if="user.level=='user'" class="btn-floating halfway-fab waves-effect waves-light red" @click="elevate(user.id)"><i class="material-icons">mode_edit</i></a>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import functions from "firebase/functions";

import { collectionData, collectionChanges } from "rxfire/firestore";
import { tap } from "rxjs/operators";
import Vue from "vue";
export default {
  name: "users",
  data() {
    return {
      users: [],
      filteredUsers: [],
      usersRef: null,
      search: ""
    };
  },
  filters: {
    capitalize: item => item.toUpperCase()
  },
  created() {
    this.usersRef = db.collection("users");
    collectionChanges(this.usersRef).subscribe(snapshot => {
      snapshot.forEach(change => {
        if (change.type === "added") {
          let user = change.doc.data();
          user.id = change.doc.id;
          this.users.push(user);
        } else if (change.type === "modified") {
          for (var key in change.doc.data()) {
            Vue.set(this.users, change.newIndex, {
              ...this.users[change.newIndex],
              [key]: change.doc.data()[key]
            });
          }
        } else if (change.type === "removed") {
          console.log("removing change: " + change);
          this.users = this.users.filter(user => user.id != change.doc.id);
        }
        this.filteredUsers = [...this.users];
      });
    });
  },
  methods: {
    getfilteredData: function() {
      if (this.search === "") {
        this.filteredUsers = [...this.users];
      } else {
        this.filteredUsers = this.users.filter(user =>
          user.lastName.toUpperCase().includes(this.search.toUpperCase())
        );
      }
    },
    enable: function(uid) {
      let enableUser = firebase.functions().httpsCallable("enableUser");
      enableUser({ uid: uid })
        .then(result => {
          this.usersRef.doc(uid).update({ status: "enabled" });
        })
        .catch(err => console.log(err));
    },
    elevate: function(uid) {
      let elevateUser = firebase.functions().httpsCallable("elevateUser");
      elevateUser({ uid: uid })
        .then(result => {
          this.usersRef.doc(uid).update({ level: "admin" });
        })
        .catch(err => console.log(err));
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