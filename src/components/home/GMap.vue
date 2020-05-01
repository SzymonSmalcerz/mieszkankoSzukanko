<template>
  <div class="map">
    <div class="google-map" id="map"></div>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
  name: 'GMap',
  data() {
    return{
      lat: 0,
      lng: 0
    }
  },
  methods: {
    updateUserGeolocation() {
      let user = firebase.auth().currentUser;
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
          db.collection('users').where('user_id', '==', user.uid).get()
          .then(snapshot => {
            snapshot.forEach((doc) => {
              db.collection('users').doc(doc.id).update({
                geolocation: {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude
                }
              })
            })
          });
        })
      }
    },
    renderMap() {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: this.lat, lng: this.lng },
        zoom: 6,
        maxZoom: 15,
        minZoom: 3
      });

      db.collection('locations').get().then(locations => {
        locations.docs.forEach(doc => {
          let data = doc.data()
          if(data.lat && data.lng){
            let marker = new google.maps.Marker({
              position: {
                lat: data.lat,
                lng: data.lng
              },
              map,
              title: data.title
            })
            // add click event to marker
            marker.addListener('click', () => {
              this.$router.push({ name: 'ViewLocation', params: { id: doc.id }})
            })
          }
        })
      })
    }
  },
  mounted() {
    this.updateUserGeolocation();
    this.renderMap();
  }
}
</script>

<style>
  .google-map {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
</style>
