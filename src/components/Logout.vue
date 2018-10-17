<template>
  <div class="logout container">
    <form @submit.prevent="logout">
      <input class="btn" type="submit" value="Logout"/>
    </form>
  </div>
</template>
<script>
import {fireAuth} from "@/firebase/init";

export default {
  name: "logout",
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    }
  },
  methods: {
    logout: function() {
      console.log('submitting')
      fireAuth.signOut()
        .then(() => {
          this.feedback = null;
          this.$router.push({name: 'home'})
        })
        .catch(error => {
        // Handle Errors here.
          var errorCode = error.code;
          this.feedback = error.message;
      });
    }
  }
}
</script>
<style>
.feedback {
  color: red;
}
</style>