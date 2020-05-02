<template>
  <div class="my-container container" id="mainContainer">
    <form class="card-panel" @submit.prevent="saveUserData">
      <h2 class="center deep-purple-text">Your data</h2>
      <div class="field">
        <label for="name">Name</label>
        <input id="name" type="text" v-model="profile.name">
      </div>
      <div class="field">
        <label for="phoneNumber">Phone number</label>
        <input id="phoneNumber" type="text" v-model="profile.phoneNumber">
      </div>
      <div class="field">
        <label for="phoneNumber">Email*</label>
        <input id="phoneNumber" type="text" v-model="profile.email">
      </div>
      <div class="field">
        <label for="other">Other way of communication</label>
        <input id="other" type="text" v-model="profile.otherCommunication">
      </div>
      <p v-if="feedback" class="red-text center">{{ feedback }}</p>
      <div class="field center margin10">
        <button class="btn deep-purple">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
  name: 'ViewProfile',
  data() {
    return{
      profile: {},
      feedback: null
    }
  },
  methods: {
    saveUserData() {
      if(this.profile.email) {
        db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              db.collection("users").doc(doc.id).update({
                phoneNumber : this.profile.phoneNumber,
                otherCommunication : this.profile.otherCommunication,
                name : this.profile.name,
                email : this.profile.email
              });
            });
            this.$router.push({ name: 'GMap', params: { message: "Data saved succesfully!" }});
          });
      } else {
        this.feedback = 'Please fill in all mandatory fields'
      }
    }
  },
  created() {
    db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.profile = doc.data();
          this.profile.id = doc.id;
          this.profile.email = this.profile.email || doc.id;
        });
      });
  }
}
</script>

<style>
</style>
