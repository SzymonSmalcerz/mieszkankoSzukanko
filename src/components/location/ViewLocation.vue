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
import axios from 'axios';

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
        if (xhr.status == 200) { // analyze HTTP status of the response
          console.log(JSON.parse(xhr.response).results.map(res => res.types));
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
        return "https://previews.dropbox.com/p/thumb/AAySq8n6AeqKHABjg_KmKKEBJSYvXROSczk7a6rg7ze-pJCjDAzwAp3_EAPvqcVLbxkAEy0dD_2zBLOVv0-jGIAaK-TKsabBjQOUc44uC6PlcTwh1pP0bFYps1vkYdGhSeotHRn7QKvpQnOQS2e4PyioIzd-pGRgU8ucmUN9kIT7oecguUAJ5Wh_Y0H9r10J1Ot-HiJf_DNymKafPW9rXMJlxCf7zSXKawxdHEDboSLZNYYbm-yUM8T1dIL8tr2-jqkiSBNM2sNuasXY_qrvwJ-FnKPnfqdPiWWy1g9mNnAufCFVUD1RodazgK-OwAaxR6NVCQQuCQPI6dOduWTVzHl5NfOCIFlOX6Cj6IgRwiaVqQ/p.png?fv_content=true&size_mode=5"
      } else if(types.indexOf("political") > -1 || types.indexOf("post_office") > -1){
        return "https://previews.dropbox.com/p/thumb/AAxxs9WCor7CmZt5tyYJBf4emg2ntC393l_iamtvgTZ7bKpQZ1uJToY3st3GKAfetOFj5KVXk1AMpKURcmuFyWVAcwrABUK9OYE3mhKx3ppJYo5I0PG4qRKIbMfrv8KO1eZuI_NUAfaGYDQFhcdzWl_DFPkw_ginbwlQfLCupri44Yto1AXHquy6qVqVVmT0RKhqIIDYadvhX-v3UaiHYuXcwJmnWTgptMlQzS8KBF0DkLX9AYDtHTX9pjn3stX4hPiFSsy0_VoiBlj_9FXzdcs2FO0xuFqQNH19g0hmuflzGE_mpD-cJHi52qBRMiX_ZwS1SI2hKnSk8KOJyf26GTejqnvNT-RZqhEEJk9dypQTBA/p.png?fv_content=true&size_mode=5"
      } else if(types.indexOf("school") > -1 || types.indexOf("education") > -1){
        return "https://previews.dropbox.com/p/thumb/AAz_4R74PYkNvG6mDXWgIYveG4bcL4JubD9QduFzfE42u5UCagA_OMzagYbR-Vw34qLa1stO8Vz2ZYaMw-pnE1H3K1Bs8z-epPuZ9zoCJwFpiHNQeSn_1Ap4AXLJqXXd31WoVm7rzRumBt9bmzbcrug6psB9r_HHfmc1GwBb-B1Mnk5k13Bv0f8VEZcj1Wm6TupmbxZfRu4ybLtxhumBufZpcyjAp2LaJYyDdbPfej5B1RRfAmplbN-gjFoo4v0OUQU4rx5dn8ZYyUg34ky7YEIpwygmkoaFmZfllyBDTSz4kQJJtBSy_zXH9SwTRNTK3noF5SSJNYg52162XODsORBQl1gR7rqOFdltk_riFWtm9w/p.png?size=2048x1536&size_mode=3"
      } else if(types.indexOf("store") > -1 || types.indexOf("food") > -1){
        return "https://previews.dropbox.com/p/thumb/AAwUon7bqRyZl8G_HvxpzdZ6IvEjGWZgKxMBHbG7yQ56ur-5uCVGGs2BwRC0FNvPKR-OfaCbrL-MO2JRwBnb1O1_FF-RCvjK0SM4UCNPtMIYdoYS_dStsXRrZ2W-ZJ1p5q_5EkN4anwWJafM0OKlKzlDpQuFcFGxcP0BKmlZVrRL8ozs__YxzdlyS_mJqghMh29c5xnKxPj-JcWxDbHM3XcgbMA4V6k4OTW1u9H7yHK5qmHCf31tOnA2pcb0wJbpXMq0E6yzf83XgD7N-Kva5eufC-ukq9fHkuI9Hwqkbaq-4Ea9qOzSHIP2S9mSJ_itADEkOyjLqTWpgyZtqZNAw8PdGMkIu5FhLPcCrkvuVTvQlA/p.png?size=2048x1536&size_mode=3"
      } else if(types.indexOf("church") > -1 || types.indexOf("worship") > -1){
        return "https://previews.dropbox.com/p/thumb/AAybGOSOT5tOLyo3en5P47EeNI5hK8KcsgPxyTAQbMsziZ3X0efCgZ05oRouW25lwz1U3a2V23js95jtMMCrAlJTPnCR-6sAHEKFNHkMlRRZJhnmXRiXR7cHjaw22hyLebPkiqXuABNRxuab-yHIZZ3kd2jFS7G7hPBpzOwDWx6lV24pndvCIKAG38nguSHqj8j2h0y_lbpVGufU9CrDOsk3VcshF1s30piYW5zN-_OxtcjqyQIsdnit_fZhBrNkw-qCbq2XthtpbOwubbu0KOHnCPVaN01qiWvXKB66RuSVtX_qfxYajeS8bmSDyZgE6vglfrsR76Ef04KtzPS8gszaCSptcgQk3sXHMSnCGzEDeQ/p.png?fv_content=true&size_mode=5"
      } else if(types.indexOf("sport") > -1 || types.indexOf("gym") > -1){
        return "https://previews.dropbox.com/p/thumb/AAxdAVZbVd5y0RgZObRGC8sCoxPazXhQ4kF0SSckO6tzbtB8-Xh4FFjZjTBA80WayyR0q5pMo9iMtHPsU3rvL-Krw1G3FkX78DxpoBLMp1hmInP6kak9d9VnuaKuG22h2xNNvb_z5K8OEmXpRSV9n8XoWw3AjTulMj2GZWnS_p8ZyqmK-9ufoBPZRki7Uploz1KfldmQNSmuRR9AHh3yafhSlGU9R9S0kNGFsrzHhFa6HmuLlot21hl4dhcyUIzK6zEtykxf2WyQUzwjD8hBMsVm6p-sh4DUboghDDsPPlQ8GDn1l6YudGKy7b9f7YKLCeBzfyPXNfoN8FTIpujJEtPvfd8IdsYiV0FTKx6GkYfHBQ/p.png?fv_content=true&size_mode=5"
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
  #map {
    position: relative;
    width: 100%;
    height: 300px;
    margin: 0 auto;
    background: #fff;
    z-index: 3;
  }
</style>
