<template>
  <div class="">
    <div class="field right margin10" id="btnSave" @click="closeMap">
      <button class="btn btn-large deep-purple" @click.prevent="showMap">Save <i class="fa fa-floppy-o"></i></button>
    </div>
    <div class="my-container container" id="mainContainer">
      <form class="card-panel" @submit.prevent="addNewLocation">
        <h2 class="center deep-purple-text">Add new location</h2>
        <div class="field">
          <label for="addInfo">Location on map*</label>
          <div class="field center margin10">
            <button class="btn deep-purple" @click.prevent="showMap">Mark location on map</button>
          </div>
        </div>
        <div class="field">
          <label for="title">Title*</label>
          <input id="title" type="text" v-model="title">
        </div>
        <div class="field">
          <label for="city">City*</label>
          <input id="city" type="text" v-model="city">
        </div>
        <div class="field">
          <label for="street">Street*</label>
          <input id="street" type="text" v-model="street">
        </div>
        <div class="field">
          <label for="postalCode">Postal code</label>
          <input id="postalCode" type="text" v-model="postalCode">
        </div>
        <div class="field">
          <label for="price">Price (in PLN)*</label>
          <input id="price" type="number" v-model="price">
        </div>
        <div class="field">
          <label for="surface">Surface of apartment*</label>
          <input id="surface" type="number" v-model="surface">
        </div>
        <div class="field">
          <label for="addInfo">Additional info*</label>
          <input id="addInfo" type="text" v-model="addInfo">
        </div>
        <div class="field">
          <label>
              <input type="checkbox" v-model="smoking">
              <span>Smoking allowed</span>
          </label>
        </div>
        <div class="field">
          <label>
              <input type="checkbox" v-model="pets">
              <span>Pets allowed</span>
          </label>
        </div>
        <div class="field">
          <label for="photo">Apartment photos</label>
          <input id="photo" type="file" accept="image/*" @change="onFilePicked">
        </div>
        <img height=150 width=200 v-for="(imageData, index) in imagesData" :key="":src="imageData.url" @click="removeImg(imageData.url)">
        <p v-if="errorMessage" class="red-text center">{{ errorMessage }}</p>
        <div class="field center margin10">
          <button class="btn deep-purple">Add new location</button>
        </div>
      </form>
    </div>
    <div class="google-map-input" id="map"></div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
  name: 'NewLocation',
  data() {
    return {
      title : "",
      city : "",
      street : "",
      postalCode : "",
      addInfo : "",
      price : 0,
      errorMessage : "",
      imagesData : [],
      lat : null,
      lng : null,
      marker : null,
      pets : true,
      smoking : true,
      surface : 0
    }
  },
  methods: {
    showMap(){
      document.getElementById('map').style.display = "block";
      document.getElementById('btnSave').style.display = "block";
      document.getElementById('mainContainer').style.display = "none";
    },
    closeMap(){
      document.getElementById('map').style.display = "none";
      document.getElementById('btnSave').style.display = "none";
      document.getElementById('mainContainer').style.display = "block";
      this.lat = this.marker.position.lat();
      this.lng = this.marker.position.lng();
      this.fetchLocationDataBasedOnLatLng();
    },
    onFilePicked (event) {
      const files = event.target.files;
      let fileName = files[0].name;
      var fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        this.imagesData.push({
          url : fileReader.result,
          photo : files[0],
          key : firebase.auth().currentUser.uid + "_" + files[0].name
        });
      });
      fileReader.readAsDataURL(files[0]);
    },
    addNewLocation() {
      if(this.title && this.city && this.street && this.addInfo && this.lat && this.price && this.surface){
        this.errorMessage = null;
        db.collection('locations').add({
          title: this.title,
          ownerId: firebase.auth().currentUser.uid,
          additionalInfo: this.addInfo,
          creationTime: Date.now(),
          postalCode: this.postalCode,
          street: this.street,
          city: this.city,
          photoUrls: [],
          lat : this.lat,
          lng : this.lng,
          price : this.price,
          surface : this.surface,
          smoking : this.smoking,
          pets : this.pets
        }).then(doc => {
          this.title = "";
          this.addInfo = "";
          this.city = "";
          this.street = "";
          this.postalCode = "";
          this.errorMessage = "";
          this.price = 0;
          this.surface = 0;
          this.smoking = true;
          this.pets = true;
          let urls = [];
          this.imagesData.forEach((image, i) => {
            firebase.storage().ref(image.key).put(image.photo).then(fileData => {
              return fileData.ref.getDownloadURL();
            }).then(downloadURL => {
              urls.push(downloadURL);
              db.collection('locations').doc(doc.id).update({
                photoUrls : urls
              });
            });
          });
          this.$router.push({ name: 'AllLocations', params: { message: "Location added succesfully!" }});
        });
      } else {
        this.errorMessage = 'Please fill in all mandatory fields'
      }
    },
    removeImg(url) {
      this.imagesData = this.imagesData.filter(imgData => imgData.url != url);
    },
    renderMap(lat, lng) {
      this.lat = lat;
      this.lng = lng;
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng },
        zoom: 6,
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false
      });

      this.marker = new google.maps.Marker({
          position: { lat , lng },
          map: map,
          draggable: true,
          title: "Drag me!"
      });
    },
    fetchGeolocation() {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.renderMap(pos.coords.latitude, pos.coords.longitude);
        });
      } else {
        this.renderMap(50, 50);
      }
    },
    fetchLocationDataBasedOnLatLng() {
      var url = `https://maps.googleapis.com/maps/api/geocode/json?`
        + `latlng=${this.lat}%2C${this.lng}`
        +  `&language=en%27`
        + `&key=AIzaSyD3PvboTyHdrjFFm8ExoEyFruWZhu3wIo0`;
      let xhr = new XMLHttpRequest();
      xhr.open('GET', "https://warm-refuge-39243.herokuapp.com/" + url);
      xhr.send();
      let that = this;
      xhr.onload = function() {
        if (xhr.status == 200) {
          JSON.parse(xhr.response).results.forEach(result => {
            result.address_components.forEach(adrComponent => {
              if(adrComponent.types != null) {
                if(adrComponent.types.includes("route")) {
                  that.street = that.street || adrComponent.long_name;
                } else if(adrComponent.types.includes("administrative_area_level_2")) {
                  that.city = that.city || adrComponent.long_name;
                } else if(adrComponent.types.includes("postal_code")) {
                  that.postalCode = that.postalCode || adrComponent.long_name;
                }
              }
            });
          });
        }
      };
    },
  },
  mounted() {
    this.fetchGeolocation();
  }
}
</script>

<style>
  img:hover {
    opacity: 0.5;
    cursor: pointer;
  }
  #btnSave {
    display: none;
    z-index: 3;
    position: absolute;
    top: 0;
    right: 0;
  }
  .google-map-input {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    z-index: 1;
  }
</style>
