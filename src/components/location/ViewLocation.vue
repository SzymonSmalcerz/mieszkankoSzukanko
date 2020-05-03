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
      <div class="field">
        <div class="google-map" id="map"></div>
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
      location : {},
      contactData : {}
    }
  },
  methods: {
    getNearbyPlaces() {
      this.renderMap()
      var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`
        + `location=${this.location.lat},${this.location.lng}`
        + `&radius=2000`
        + `&key=AIzaSyD3PvboTyHdrjFFm8ExoEyFruWZhu3wIo0`;
      let xhr = new XMLHttpRequest();
      xhr.open('GET', "https://warm-refuge-39243.herokuapp.com/" + url);
      xhr.send();
      let that = this;
      xhr.onload = function() {
        if (xhr.status == 200) {
          JSON.parse(xhr.response).results.forEach(result => {
            let locationMarker = new google.maps.Marker({
              position: {
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng
              },
              map : that.map,
              title: result.name,
              icon: {
                url : that.getIconUrl(result.types)
              }
            });
          });
        }
      };

    },
    getIconUrl(types) {
      // Icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
      // ass well as
      // Maps Icons Collection https://mapicons.mapsmarker.com
      types = types.join("");
      if(types.indexOf("hospital") > -1 || types.indexOf("health") > -1) {
        return "https://fv9-1.failiem.lv/thumb_show.php?i=rx8j5u6d&view&download_checksum=fc01072040e918378119624b66c2187f98be5fcb&download_timestamp=1588326863"
      } else if(types.indexOf("political") > -1 || types.indexOf("post_office") > -1){
        return "https://fv9-2.failiem.lv/thumb_show.php?i=f8fmts6w&view&download_checksum=a19d64ebe45775ab4c32d46e27c9e37850f0e985&download_timestamp=1588326865"
      } else if(types.indexOf("school") > -1 || types.indexOf("education") > -1){
        return "https://fv9-2.failiem.lv/thumb_show.php?i=gkvqm5m9&view&download_checksum=daba200bc124d041902411e6a4f84c3875dba85e&download_timestamp=1588326862"
      } else if(types.indexOf("store") > -1 || types.indexOf("food") > -1){
        return "https://fv9-2.failiem.lv/thumb_show.php?i=v4jp666a&view&download_checksum=4018dbd476c3b2e280dc3f1a6f492741a0a949b4&download_timestamp=1588326858"
      } else if(types.indexOf("church") > -1 || types.indexOf("worship") > -1){
        return "https://fv9-1.failiem.lv/thumb_show.php?i=emw3pd2p&view&download_checksum=6d1c53b296eb9991840a7bdddeab56007b04998a&download_timestamp=1588326860"
      } else if(types.indexOf("sport") > -1 || types.indexOf("gym") > -1){
        return "https://fv9-2.failiem.lv/thumb_show.php?i=99nuuc6x&view&download_checksum=aede89127215d9c4ea072572e3442a839a4b851f&download_timestamp=1588326867"
      } else {
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      }

    },
    renderMap() {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: this.location.lat, lng: this.location.lng },
        zoom: 14,
        maxZoom: 16,
        minZoom: 14
      });


      let locationMarker = new google.maps.Marker({
        position: {
          lat: this.location.lat,
          lng: this.location.lng
        },
        map : this.map,
        title: this.location.title
      });
    }
  },
  mounted() {
    db.collection('locations').doc(this.$route.params.id)
    .get().then((doc) => {
      if(doc.exists) {
        this.location = doc.data();
        this.getNearbyPlaces();
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
        this.$router.push({ name: 'AllLocations', params: { message: "Location does not exists" }});
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
  #map {
    position: relative;
    width: 100%;
    height: 300px;
    margin: 0 auto;
    background: #fff;
    z-index: 3;
  }
</style>
