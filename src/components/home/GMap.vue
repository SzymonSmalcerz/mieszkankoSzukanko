<template>
  <div>
    <div class="field right margin10" id="searchButton">
      <button class="btn btn-large deep-purple" @click.prevent="toggleSearchCriteria">Advance search <i class="fa fa-search"></i></button>
    </div>
    <div class="map">
      <div class="google-map" id="map"></div>
      <div class="my-container container my-container" id="searchCriteria">
        <div class="card-panel">
          <h2 class="center deep-purple-text">Search criteria</h2>
          <div class="field">
            <label for="priceMin">Minimum price (PLN)</label>
            <input id="priceMin" type="number" v-model="searchData.priceMin">
          </div>
          <div class="field">
            <label for="priceMax">Maximum price (PLN)</label>
            <input id="priceMax" type="number" v-model="searchData.priceMax">
          </div>
          <div class="field">
            <label for="maxDistance">Maximum distance from Yout current location (KM)</label>
            <input id="maxDistance" type="number" v-model="searchData.maxDistance">
          </div>
          <div class="field">
            <label for="minSurface">Minimum surface (square meters)</label>
            <input id="minSurface" type="number" v-model="searchData.minSurface">
          </div>
          <div class="field">
            <label>
                <input type="checkbox" v-model="searchData.smoking">
                <span>Smoking allowed</span>
            </label>
          </div>
          <div class="field">
            <label>
                <input type="checkbox" v-model="searchData.pets">
                <span>Pets allowed</span>
            </label>
          </div>
          <div class="field center">
            <button class="btn btn-large deep-purple" @click.prevent="search">Search <i class="fa fa-search"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import saveState from 'vue-save-state';

export default {
  name: 'GMap',
  mixins: [saveState],
  data() {
    return{
      lat: 0,
      lng: 0,
      // userMarker : null,
      userLat : 0,
      userLng : 0,
      searchData : {
        priceMin : null,
        priceMax : null,
        maxDistance : null,
        minSurface : null,
        smoking : false,
        pets : false
      },
      allLocations : [],
      locations : [],
      loaded : false
    }
  },
  methods: {
    search() {
      this.toggleSearchCriteria();
      this.filterLocations();
      this.renderMap();
      this.renderLocations();
    },
    toggleSearchCriteria() {
      let searchOn = document.getElementById('searchCriteria').style.display == "block";
      if(searchOn) {
        document.getElementById('searchCriteria').style.display = "none";
        document.getElementById('map').classList.remove("blured");
        document.getElementById('searchButton').style.display = "block";
      } else {
        document.getElementById('searchCriteria').style.display = "block";
        document.getElementById('map').classList.add("blured");
        document.getElementById('searchButton').style.display = "none";
      }
    },
    updateUserGeolocation() {
      let user = firebase.auth().currentUser;
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          if(!this.lat) {
            this.lat = pos.coords.latitude;
            this.lng = pos.coords.longitude;
          }
          this.getLocations();
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
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: this.lat, lng: this.lng },
        zoom: 6,
        maxZoom: 15,
        minZoom: 3
      });

      this.userMarker = new google.maps.Marker({
        position: {
          lat: this.lat,
          lng: this.lng
        },
        map : this.map,
        draggable: true,
        title: 'Your current position',
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
      });

      let that = this;
      google.maps.event.addListener(this.userMarker,'drag',() => {
        that.lat = that.userMarker.position.lat();
        that.lng = that.userMarker.position.lng();
      });

      if(!this.loaded) {
        var infowindow = new google.maps.InfoWindow({
          content:"Yout current position - you can drag this marker!"
        });
        infowindow.open(map,that.userMarker);
        this.loaded = true;
      }
    },
    renderLocations() {
      console.log("RENDERING LOCATIONS");
      console.log(this.locations);
      this.locations.forEach(data => {
        if(data.lat && data.lng){
          let marker = new google.maps.Marker({
            position: {
              lat: data.lat,
              lng: data.lng
            },
            map : this.map,
            title: data.title
          });
          marker.addListener('click', () => {
            this.$router.push({ name: 'ViewLocation', params: { id: data.id }})
          });
        }
      });
    },
    filterLocations() {
      let that = this;
      console.log("filter called");
      this.locations = this.allLocations.filter((loc) => {
        let isOk = true;
        if(this.searchData.priceMin) {
          isOk = isOk && parseInt(loc.price) > this.searchData.priceMin;
        }
        if(this.searchData.priceMax) {
          isOk = isOk && parseInt(loc.price) < this.searchData.priceMax;
        }
        if(this.searchData.smoking) {
          isOk = isOk && loc.smoking;
        }
        if(this.searchData.pets) {
          isOk = isOk && loc.pets;
        }
        if(this.searchData.maxDistance) {
          isOk = isOk && this.distance(this.userMarker.position.lat(), this.userMarker.position.lng(), loc.lat, loc.lng) < this.searchData.maxDistance;
        }
        console.log(isOk);
        return isOk;
      })
    },
    getLocations() {
      this.locations = [];
      db.collection('locations').get().then(locations => {
        locations.docs.forEach(doc => {
          this.locations.push({
            ...doc.data(),
            id : doc.id
          });
        });
        this.allLocations = [...this.locations];
        this.renderMap();
        this.filterLocations();
        this.renderLocations();
      });
    },
    distance(lat1, lon1, lat2, lon2) {
    	if ((lat1 == lat2) && (lon1 == lon2)) {
    		return 0;
    	}
    	else {
    		var radlat1 = Math.PI * lat1/180;
    		var radlat2 = Math.PI * lat2/180;
    		var theta = lon1-lon2;
    		var radtheta = Math.PI * theta/180;
    		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    		if (dist > 1) {
    			dist = 1;
    		}
    		dist = Math.acos(dist);
    		dist = dist * 180/Math.PI;
    		dist = dist * 60 * 1.1515;
    		dist = dist * 1.609344;
    		return dist;
    	}
    },
    getSaveStateConfig() {
      return {
          'cacheKey': 'GMap'
      };
    }
  },
  mounted() {
    this.updateUserGeolocation();
  }
}
</script>

<style>
  #searchCriteria {
    display: none;
    padding-top: 50px;
  }
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
