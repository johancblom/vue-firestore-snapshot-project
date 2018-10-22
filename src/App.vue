<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home </router-link>
      <router-link v-if="adminUser" to="/tenants">| Tenants </router-link>
      <router-link v-if="adminUser" to="/plots">| Plots </router-link>
      <router-link v-if="adminUser" to="/users">| Users </router-link>
      <router-link to="/invoices">| Invoices </router-link>
      <router-link v-if="loggedIn" to="/about">| About </router-link>
      <router-link v-if="!loggedIn" to="/signin">| Log in </router-link>
      <router-link v-if="!loggedIn" to="/signup">| Sign up </router-link>
      <router-link v-if="loggedIn" to="/logout">| Log out</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import {fireAuth} from "@/firebase/init";

export default {
  data() {
    return {
      loggedIn: false,
      adminUser: false
    }
  },
  methods: {
    login(user) {
      console.log('user: ' + user);
      if (user) {
        fireAuth.currentUser.getIdTokenResult()
        .then((idTokenResult) => {
          if(!!idTokenResult.claims.admin) {
            this.loggedIn = true;
            this.adminUser = true;
            console.log('This is an admin user');
          } else {
            console.log('This is a normal user');
            this.loggedIn = true;
            this.adminUser = false;
          }
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        //this must be a sign out
        this.loggedIn = false;
        this.adminUser = false;
      }
    }
  },
  created() {
    fireAuth.onAuthStateChanged(this.login);
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
}

#nav a {
  color: #444;
}

#nav a.router-link-active {
  color: #444;
}
#nav a.router-link-exact-active {
  color: green;
}
</style>
