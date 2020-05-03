<template>
  <div class="signup container">
    <form class="card-panel" @submit.prevent="signup">
      <h2 class="center deep-purple-text">Signup</h2>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email">
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password">
      </div>
      <p v-if="errorMessage" class="red-text center">{{ errorMessage }}</p>
      <div class="field center">
        <button class="btn deep-purple">Signup</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
  name: 'Signup',
  data(){
    return{
      email: null,
      password: null,
      errorMessage: null,
      slug: null
    }
  },
  methods: {
    signup(){
      if(this.email && this.password){
        this.errorMessage = null;
        let ref = db.collection('users').doc(this.email);
        ref.get().then(doc => {
          if(doc.exists){
            this.errorMessage = 'This email is already taken';
          } else {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(authDoc => {
              ref.set({
                geolocation: null,
                user_id: authDoc.user.uid
              })
            }).then(() => {
              this.$router.push({ name: 'AllLocations' })
            })
            .catch(err => {
              this.errorMessage = err.message
            })
          }
        })
      } else {
        this.errorMessage = 'Please fill in all fields'
      }
    }
  }
}
</script>

<style>
.signup{
  max-width: 400px;
  margin-top: 60px;
}
.signup h2{
  font-size: 2.4em;
}
.signup .field{
  margin-bottom: 16px;
}
</style>
