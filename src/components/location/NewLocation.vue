<template>
  <div class="">
    <div class="field right margin10" id="btnSave" @click="closeMap">
      <button class="btn btn-large deep-purple" @click.prevent="showMap">Save <i class="fa fa-floppy-o"></i></button>
    </div>
    <div class="my-container container">
      <form class="card-panel" @submit.prevent="addNewLocation">
        <h2 class="center deep-purple-text">Add new location</h2>
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
          <label for="addInfo">Additional info*</label>
          <input id="addInfo" type="text" v-model="addInfo">
        </div>
        <div class="field">
          <label for="addInfo">Location on map*</label>
          <div class="google-map-input" id="map"></div>
          <div class="field center margin10">
            <button class="btn deep-purple" @click.prevent="showMap">Mark location on map</button>
          </div>
        </div>
        <div class="field">
          <label for="photo">Apartment photos</label>
          <input id="photo" type="file" accept="image/*" @change="onFilePicked">
        </div>
        <img height=150 width=200 v-for="(imageData, index) in imagesData" :key="":src="imageData.url" @click="removeImg(imageData.url)">
        <p v-if="feedback" class="red-text center">{{ feedback }}</p>
        <div class="field center margin10">
          <button class="btn deep-purple">Add new location</button>
        </div>
      </form>
    </div>
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
      feedback : "",
      imagesData : [],
      lat : null,
      lng : null,
      marker : null
    }
  },
  methods: {
    showMap(){
      document.getElementById('map').style.display = "block";
      document.getElementById('btnSave').style.display = "block";
    },
    closeMap(){
      document.getElementById('map').style.display = "none";
      document.getElementById('btnSave').style.display = "none";
      this.lat = this.marker.position.lat();
      this.lng = this.marker.position.lng();
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
      // if(this.title && this.city && this.street && this.addInfo && this.lat && this.price){
        if(true){
        this.feedback = null;
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
          price : this.price
        }).then(doc => {
          this.title = "";
          this.addInfo = "";
          this.city = "";
          this.street = "";
          this.postalCode = "";
          this.feedback = "";
          this.price = 0;
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
        });
      } else {
        this.feedback = 'Please fill in all mandatory fields'
      }
    },
    removeImg(url) {
      this.imagesData = this.imagesData.filter(imgData => imgData.url != url);
    },
    renderMap() {
      let lat = 50;
      let lng = 50;
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        });
      };
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: lat, lng: lng },
        zoom: 6,
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false
      });

      this.marker = new google.maps.Marker({
          position: { lat: this.lat || 50, lng: this.lng || 50 },
          map: map,
          draggable: true,
          title: "Drag me!"
      });
    }
  },
  mounted() {
    this.renderMap();
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
  }
</style>
