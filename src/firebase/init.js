import firebase from 'firebase';
import firestore from 'firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD3PvboTyHdrjFFm8ExoEyFruWZhu3wIo0",
    authDomain: "mieszkankoszukanko-dadb0.firebaseapp.com",
    databaseURL: "https://mieszkankoszukanko-dadb0.firebaseio.com",
    projectId: "mieszkankoszukanko-dadb0",
    storageBucket: "mieszkankoszukanko-dadb0.appspot.com",
    messagingSenderId: "147638323664",
    appId: "1:147638323664:web:b43dc281f41938176511d5",
    measurementId: "G-B4K0YM7Q83"
};

// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.firestore().settinfs({timestampsInSnapshots : true})
firebase.analytics();

export default firebaseApp.firestore();
