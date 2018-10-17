<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/tenants">Tenants</router-link> |
      <router-link to="/plots">Plots</router-link> |
      <router-link to="/users">Users</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/signin">Log in</router-link> |
      <router-link to="/signup">Sign up</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import {fireAuth} from "@/firebase/init";

export default {
  data() {
    return {
      adminUser: false
    }
  },
  methods: {
    login(user) {
      fireAuth.currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        if(!!idTokenResult.claims.admin) {
          console.log('This is an admin user');
        }
      })
      .catch(err => {
        console.log(err);
      })
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
