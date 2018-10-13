<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/tenants">Tenants</router-link> |
      <router-link to="/plots">Plots</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/signin">Log in</router-link>
    </div>
    <router-view/>
  </div>
</template>

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
