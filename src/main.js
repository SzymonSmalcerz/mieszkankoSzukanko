// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueImg from 'v-img';
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false
Vue.use(VueImg);
let app = null;

// wait for firebase auth to init before creating the app
firebase.auth().onAuthStateChanged(() => {

  // init app if not already created
  if(!app){
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }

});
