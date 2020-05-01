<template>
  <div class="my-container container">
    <div class="card-panel">
      <div class="field center">
        <h3>{{location.title}}</h3>
      </div>
      <div class="field">
        <p class="card-element">Price: {{location.price}} (PLN)</p>
        <p class="card-element">Postal code: {{location.postalCode}}</p>
        <p class="card-element">City: {{location.city}}</p>
        <p class="card-element">Street: {{location.street}}</p>
      </div>
      <div class="field">
        <h5>Additional information:</h5>
        <p>{{location.additionalInfo}}</p>
      </div>
      <div class="field">
        <h5>Apartment gallery:</h5>
        <ExpandableImage v-for="(photoUrl, index) in location.photoUrls" :key="photoUrl" :src="photoUrl" class="card-element, image"></ExpandableImage>
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
  components: {
    ExpandableImage: () => import('../other/ExpandableImage.vue')
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
</style>
