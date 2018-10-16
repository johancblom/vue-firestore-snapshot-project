<template>
  <div class="signup container">
    <form @submit.prevent="signin">
      <div class="field">
          <label for="email">Email</label>
          <input type="text" name="email" v-model="email">
      </div>
      <div class="field">
          <label for="password">Password</label>
          <input type="password" name="password" v-model="password">
      </div>
      <div class="field">
          <label for="email">First Name</label>
          <input type="text" name="email" v-model="firstName">
      </div>
      <div class="field">
          <label for="email">Last Name</label>
          <input type="text" name="email" v-model="lastName">
      </div>
      <div v-if="feedback" class="feedback">{{feedback}}</div>
      <input class="btn" type="submit" value="Submit"/>
    </form>
  </div>
</template>
<script>
import db, {fireAuth} from "@/firebase/init";

export default {
  name: "signin",
  data() {
    return {
      email: null,
      password: null,
      firstName: null,
      lastName: null,
      feedback: null
    }
  },
  methods: {
    signin: function() {
      console.log('submitting')
      fireAuth.createUserWithEmailAndPassword(this.email, this.password)
        .then((creds) => {
          console.log(creds.user);
          this.feedback = null;
          db.collection('users').doc(creds.user.uid).set({
            firstName: this.firstName,
            lastName: this.lastName
          }, {merge: true});
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