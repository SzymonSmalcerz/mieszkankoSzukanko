<template>
  <div class="">
    <div class="field right margin10" id="btnSave" @click="closeMap">
      <button class="btn btn-large deep-purple" @click.prevent="showMap">Save <i class="fa fa-floppy-o"></i></button>
    </div>
    <div class="my-container container" id="mainContainer">
      <form class="card-panel" @submit.prevent="editData">
        <h2 class="center deep-purple-text">EditLocation</h2>
        <div class="field">
          <label for="additionalInfo">Location on map*</label>
          <div class="field center margin10">
            <button class="btn deep-purple" @click.prevent="showMap">Change location on map</button>
          </div>
        </div>
        <div class="field">
          <label for="title">Title*</label>
          <input id="title" type="text" v-model="location.title">
        </div>
        <div class="field">
          <label for="city">City*</label>
          <input id="city" type="text" v-model="location.city">
        </div>
        <div class="field">
          <label for="street">Street*</label>
          <input id="street" type="text" v-model="location.street">
        </div>
        <div class="field">
          <label for="postalCode">Postal code</label>
          <input id="postalCode" type="text" v-model="location.postalCode">
        </div>
        <div class="field">
          <label for="price">Price (in PLN)*</label>
          <input id="price" type="number" v-model="location.price">
        </div>
        <div class="field">
          <label for="surface">Surface of apartment*</label>
          <input id="surface" type="number" v-model="location.surface">
        </div>
        <div class="field">
          <label for="additionalInfo">Additional info*</label>
          <input id="additionalInfo" type="text" v-model="location.additionalInfo">
        </div>
        <div class="field">
          <label>
              <input type="checkbox" v-model="location.smoking">
              <span>Smoking allowed</span>
          </label>
        </div>
        <div class="field">
          <label>
              <input type="checkbox" v-model="location.pets">
              <span>Pets allowed</span>
          </label>
        </div>
        <div class="field">
          <label for="photo">Apartment photos</label>
          <input id="photo" type="file" accept="image/*" @change="onFilePicked">
        </div>
        <img height=150 width=200 v-for="(imageData, index) in imagesData" :key="index" :src="imageData.url" @click="removeImg(imageData.url)">
        <p v-if="errorMessage" class="red-text center">{{ errorMessage }}</p>
        <div class="field center margin10">
          <button class="btn deep-purple">Save</button>
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
  name: 'EditLocation',
  data() {
    return {
      location : {},
      imagesData : [],
      errorMessage : null
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
      this.location.lat = this.marker.position.lat();
      this.location.lng = this.marker.position.lng();
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
    editData() {
      if(this.location.title && this.location.city && this.location.street && this.location.additionalInfo && this.location.lat && this.location.price && this.location.surface){
        this.errorMessage = null;
        let urls = this.imagesData.filter(data => data.photo == null).map(data => data.url);
        let locId = this.location.id;
        db.collection("locations").doc(locId).update({
          title: this.location.title,
          ownerId: firebase.auth().currentUser.uid,
          additionalInfo: this.location.additionalInfo,
          creationTime: Date.now(),
          postalCode: this.location.postalCode,
          street: this.location.street,
          city: this.location.city,
          photoUrls: urls,
          lat : this.location.lat,
          lng : this.location.lng,
          price : this.location.price,
          surface : this.location.surface,
          smoking : this.location.smoking,
          pets : this.location.pets
        }).then(() => {
            this.imagesData.forEach((image, i) => {
              if(image.photo) {
                firebase.storage().ref(image.key).put(image.photo).then(fileData => {
                  return fileData.ref.getDownloadURL();
                }).then(downloadURL => {
                  urls.push(downloadURL);
                  db.collection('locations').doc(locId).update({
                    photoUrls : urls
                  });
                });
              }
            });
            this.$router.push({ name: 'AllLocations', params: { message: "Location edited succesfully!" }});
        });
      } else {
        this.errorMessage = 'Please fill in all mandatory fields'
      }
    },
    removeImg(url) {
      this.imagesData = this.imagesData.filter(imgData => imgData.url != url);
    },
    renderMap(lat, lng) {
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
    fetchData() {
      db.collection('locations').doc(this.$route.params.id)
      .get().then((doc) => {
        if(doc.exists) {
          this.location = doc.data();
          this.location.id = doc.id;
          this.imagesData = doc.data().photoUrls.map(photoUrl => {
            return {
              url : photoUrl
            };
          });
          this.renderMap(this.location.lat, this.location.lng);
        } else {
          this.$router.push({ name: 'AllLocations', params: { message: "Location does not exists" }});
        }
      });
    },
    fetchLocationDataBasedOnLatLng() {
      var url = `https://maps.googleapis.com/maps/api/geocode/json?`
        + `latlng=${this.location.lat}%2C${this.location.lng}`
        +  `&language=en%27`
        + `&key=AIzaSyD3PvboTyHdrjFFm8ExoEyFruWZhu3wIo0`;
      let xhr = new XMLHttpRequest();
      xhr.open('GET', "https://warm-refuge-39243.herokuapp.com/" + url);
      xhr.send();
      let that = this.location;
      this.location.city = null;
      this.location.postalCode = null;
      this.location.street = null;
      xhr.onload = function() {
        if (xhr.status == 200) {
          JSON.parse(xhr.response).results.forEach(result => {
            result.address_components.forEach(adrComponent => {
              if(adrComponent.types != null) {
                if(adrComponent.types.includes("route") && !adrComponent.long_name.startsWith("Unnamed")) {
                  that.street = that.street || adrComponent.long_name;
                } else if(adrComponent.types.includes("administrative_area_level_2") && !adrComponent.long_name.startsWith("Unnamed")) {
                  that.city = that.city || adrComponent.long_name;
                } else if(adrComponent.types.includes("postal_code") && !adrComponent.long_name.startsWith("Unnamed")) {
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
    this.fetchData();
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
