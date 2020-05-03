import Vue from 'vue'
import Router from 'vue-router'
import AllLocations from '@/components/location/AllLocations'
import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import ViewProfile from '@/components/profile/ViewProfile'
import NewLocation from '@/components/location/NewLocation'
import ViewLocation from '@/components/location/ViewLocation'
import UserLocations from '@/components/location/UserLocations'
import EditLocation from '@/components/location/EditLocation'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'AllLocations',
      component: AllLocations,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    // {
    //   path: '/profile/:id',
    //   name: 'ViewProfile',
    //   component: ViewProfile,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    {
      path: '/profile',
      name: 'ViewProfile',
      component: ViewProfile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/location',
      name: 'NewLocation',
      component: NewLocation,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/userLocations',
      name: 'UserLocations',
      component: UserLocations,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/location/:id',
      name: 'ViewLocation',
      component: ViewLocation,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/editLocation/:id',
      name: 'EditLocation',
      component: EditLocation,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    let user = firebase.auth().currentUser;
    if (user) {
      next();
    } else {
      next({
        name: 'Login'
      });
    }
  } else {
    next();
  }
})

export default router
