<template>
  <div class="navbar" id ="navbar">
    <nav class="deep-purple darken-1">
      <div class="container">
        <router-link :to="{ name: 'AllLocations' }" class="left">
          <span class="brand-logo">
            <i class="fa fa-home" aria-hidden="true" style="margin: 20px 0 0 0;"></i>
            <span id="logo">MieszkankoSzukanko</span>
          </span>
        </router-link>
        <ul class="right" id="myLinks">
          <li v-if="!user"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
          <li v-if="!user"><router-link :to="{ name: 'Login' }">Login</router-link></li>
          <li v-if="user"><router-link :to="{ name: 'NewLocation' }">Add new location</router-link></li>
          <li v-if="user"><router-link :to="{ name: 'ViewProfile' }">Your profile</router-link></li>
          <li v-if="user"><router-link :to="{ name: 'UserLocations' }">Your locations</router-link></li>
          <li v-if="user"><a @click="logout">Logout</a></li>
        </ul>
        <div id="hamburger" class="right" @click="toggleBurger">
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
    </nav>
    <div class="deep-purple darken-1 none" id="myLinksHumburger" @click="toggleBurger">
        <router-link :to="{ name: 'Signup' }"><div class="center field" v-if="!user">Signup</div></router-link>
        <router-link :to="{ name: 'Login' }"><div class="center field" v-if="!user">Login</div></router-link>
        <router-link :to="{ name: 'NewLocation' }"><div class="center field" v-if="user">Add new location</div></router-link>
        <router-link :to="{ name: 'ViewProfile' }"><div class="center field" v-if="user">Your profile</div></router-link>
        <router-link :to="{ name: 'UserLocations' }"><div class="center field" v-if="user">Your locations</div></router-link>
        <a @click="logout"><div class="center field" v-if="user">Logout</div></a>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Navbar',
  data(){
    return{
      user: null
    }
  },
  created(){
    firebase.auth().onAuthStateChanged(fetchedUser => {
      this.user = fetchedUser;
    });
  },
  methods: {
    toggleBurger() {
      document.getElementById('hamburger').classList.toggle("change");
      document.getElementById("myLinksHumburger").classList.toggle("block");
    },
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' })
      })
    }
  }
}
</script>

<style scoped="scoped_Navbar">

  .none {
    display: none;
  }

  @media only screen and (max-width: 1100px) {

    .block {
        display: block;
    }

    .field {
      width: 100%;
      padding: 10px;
      color: white;
      font-size: 1.5em;
    }

    .field:hover {
      background-color: rgba(255,255,255, 0.1);
      cursor: pointer;
    }

    #myLinks {
      display: none;
    }

    #hamburger {
      display: inline-block;
      cursor: pointer;
      padding: 10px 0;
    }

    .bar1, .bar2, .bar3 {
      width: 35px;
      height: 5px;
      background-color: #FFF;
      margin: 6px 0;
      transition: 0.4s;
    }

    .change .bar1 {
      -webkit-transform: rotate(-45deg) translate(-9px, 6px) ;
      transform: rotate(-45deg) translate(-9px, 6px) ;
    }

    .change .bar2 {
      opacity: 0;
    }

    .change .bar3 {
      -webkit-transform: rotate(45deg) translate(-8px, -8px) ;
      transform: rotate(45deg) translate(-8px, -8px) ;
    }
  }

  @media only screen and (max-width: 615px) {
    #logo {
      font-size: 15px;
    }
  }

  @media only screen and (max-width: 400px) {
    #logo {
      display: none;
    }
  }
</style>
