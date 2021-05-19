import * as fb from "firebase"
var firebaseConfig = {
    apiKey: "AIzaSyAWKTvm6h-saC3837h8yTif-XO_wJlO-9Y",
    authDomain: "whiteaxis.firebaseapp.com",
    databaseURL: "https://whiteaxis-default-rtdb.firebaseio.com",
    projectId: "whiteaxis",
    storageBucket: "whiteaxis.appspot.com",
    messagingSenderId: "619115521529",
    appId: "1:619115521529:web:01fdcf04955967383bc928",
    measurementId: "G-39MZDRL8G6"
  };
export const firebase = !fb.apps.length ? fb.initializeApp(firebaseConfig) : fb.app()
