<template>
  <div class="my-container container">
    <div class="card-panel">
      <div class="field center">
        <h3>{{location.title}}</h3>
      </div>
      <div class="field">
        <p class="card-element">Price: {{location.price}} [PLN]</p>
        <p class="card-element">Postal code: {{location.postalCode}}</p>
        <p class="card-element">City: {{location.city}}</p>
        <p class="card-element">Street: {{location.street}}</p>
        <p class="card-element">Surface: {{location.surface}} [m^2]</p>
        <p class="card-element">Pets allowed: {{location.pets}}</p>
        <p class="card-element">Smoking allowed: {{location.smoking}}</p>
      </div>
      <div class="field">
        <h5>Additional information:</h5>
        <p>{{location.additionalInfo}}</p>
      </div>
      <div class="field">
        <h5>Apartment gallery:</h5>
        <img v-img v-for="(photoUrl, index) in location.photoUrls" :key="photoUrl" :src="photoUrl" class="card-element"></img>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
  name: 'ViewLocation',
  data() {
    return {
      location : {}
    }
  },
  methods: {
  },
  mounted() {
    db.collection('locations').doc(this.$route.params.id)
    .get().then((doc) => {
      if(doc.exists) {
        this.location = doc.data();
      } else {
        this.$router.push({ name: 'GMap', params: { message: "Location does not exists" }});
      }
    });
  }
}
</script>

<style scoped="scope_ViewLocation">
  .field {
    border-bottom: 1px solid #eee;
    padding: 5%;
  }
  img {
    object-fit: cover;
    max-width: 50%;
    max-height: 150px;
  }
  img:hover {
    opacity: 0.5;
  }
  .fullscreen-v-img img:hover {
    opacity: 1;
  }
</style>
