<template>
  <div class="signin container">
    <form @submit.prevent="signin">
      <div class="field">
          <label for="email">Email</label>
          <input type="text" name="email" v-model="email">
      </div>
      <div class="field">
          <label for="password">Password</label>
          <input type="password" name="password" v-model="password">
      </div>
      <div v-if="feedback" class="feedback">{{feedback}}</div>
      <input class="btn" type="submit" value="Submit"/>
    </form>
  </div>
</template>
<script>
import {fireAuth} from "@/firebase/init";

export default {
  name: "signin",
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    }
  },
  methods: {
    signin: function() {
      console.log('submitting')
      fireAuth.signInWithEmailAndPassword(this.email, this.password)
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