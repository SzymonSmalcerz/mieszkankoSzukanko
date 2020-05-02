<template>
  <div class="my-container container">
    <div class="card-panel">
      <span v-if="locations.length > 0">
        <div class="field center deep-purple-text">
          <h3>Your locations:</h3>
        </div>
          <ul>
            <li v-for="(location, index) in locations" :key="index">
              {{location.title}}
              <span @click.prevent="remove(location.id)">
                <i class="fa fa-times right remove icon"  aria-hidden="false"></i>
              </span>
              <span @click.prevent="edit(location.id)">
                <i class="fa fa-pencil-square-o right edit icon"  aria-hidden="false"></i>
              </span>
            </li>
          </ul>
      </span>
      <span v-else>
        <div class="field center deep-purple-text">
          <h4>No current locations, click below to add one <i class="fa fa-arrow-circle-down" aria-hidden="true"></i></h4>
        </div>
      </span>
      <div class="field center margin20">
        <button class="btn deep-purple" @click="goToNewLocation">Add new location</button>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
  name: 'UserLocations',
  data() {
    return {
      locations : []
    }
  },
  methods: {
    goToNewLocation() {
      this.$router.push({ name: 'NewLocation' });
    },
    remove(locationId) {
      if(confirm("Do you really want to delete this location?")) {
        db.collection('locations').doc(locationId).delete();
        this.locations = this.locations.filter(loc => loc.id != locationId);
      }
    },
    edit(locationId) {
      this.$router.push({ name: 'EditLocation', params: { id: locationId }});
    }
  },
  mounted() {
    this.locations = [];
    db.collection('locations')
    .get().then((snapshot) => {
      snapshot.forEach(doc => {
        let locData = doc.data();
        locData.id = doc.id;
        if(locData.ownerId == firebase.auth().currentUser.uid) {
          this.locations.push(locData);
        }
      });
    });
  }
}
</script>

<style scoped="scoped_UserLocations">
  .remove {
    color: red;
  }

  .edit {
    color: orange;
  }

  .icon {
      font-size: 20px;
  }
  .icon:hover {
    font-size: 25px;
    cursor: pointer;
  }
</style>
