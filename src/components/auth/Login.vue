<template>
  <div class="auth container">
    <form class="card-panel" @submit.prevent="login">
      <h2 class="center deep-purple-text">Login</h2>
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
        <button class="btn deep-purple">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Login',
  data(){
    return{
      email: null,
      password: null,
      errorMessage: null
    }
  },
  methods: {
    login(){
      if(this.email && this.password){
        this.errorMessage = null
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(authDoc => {
          this.$router.push({ name: 'AllLocations' })
        }).catch(err => {
          this.errorMessage = err.message
        })
      } else {
        this.errorMessage = 'Please fill in both fields'
      }
    }
  }
}
</script>

<style>
</style>
