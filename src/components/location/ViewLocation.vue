<template>
  <div class="my-container container">
    <div class="card-panel">
      <div class="field center deep-purple-text">
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
      <div class="field">
        <h5>Contact data:</h5>
        <div class="field">
          <p v-if="contactData.name" class="card-element">Tenant name: {{contactData.name}}</p>
          <p v-if="contactData.email" class="card-element">Email: {{contactData.email}}</p>
          <p v-if="contactData.phoneNumer" class="card-element">Phone number: {{contactData.phoneNumer}}</p>
          <p v-if="contactData.otherCommunication" class="card-element">Additional information: {{contactData.otherCommunication}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import googleplaces from 'googleplaces';

export default {
  name: 'ViewLocation',
  data() {
    return {
      location : {},
      contactData : {}
    }
  },
  methods: {
  },
  mounted() {
    db.collection('locations').doc(this.$route.params.id)
    .get().then((doc) => {
      if(doc.exists) {
        this.location = doc.data();
        db.collection('users').where('user_id', '==', this.location.ownerId).get()
        .then(snapshot => {
          snapshot.forEach((doc) => {
            this.contactData = {
              phoneNumer : doc.data().phoneNumber,
              email : doc.data().email ? doc.data().email : doc.id,
              name : doc.data().name,
              otherCommunication : doc.data().otherCommunication
            };
          })
        });
      } else {
        this.$router.push({ name: 'GMap', params: { message: "Location does not exists" }});
      }
    });
    // var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&name=harbour&key=AIzaSyD3PvboTyHdrjFFm8ExoEyFruWZhu3wIo0';
    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', url);
    // xhr.send();
    // xhr.onload = function() {
    //   if (xhr.status != 200) { // analyze HTTP status of the response
    //     alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
    //   } else { // show the result
    //     alert(`Done, got ${xhr.response.length} bytes`); // response is the server
    //   }
    // };
    // this.placeSearch = new googleplaces("AIzaSyD3PvboTyHdrjFFm8ExoEyFruWZhu3wIo0", "json");
    // console.log(this.placeSearch);
    // var parameters = {
    //     location: [50.0496, 19.944544],
    //     keyword: "doctor"
    // };
    // this.placeSearch.nearBySearch(parameters, function(error, response) {
    //   console.log(error);
    //   console.log(response);
    // });
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
