var firebaseConfig = {
    apiKey: "AIzaSyAZkoH0U632d15FXYVtxjU7PAw0YVQd2mA",
    authDomain: "goldady-techzonelabs.firebaseapp.com",
    databaseURL: "https://goldady-techzonelabs.firebaseio.com",
    projectId: "goldady-techzonelabs",
    storageBucket: "goldady-techzonelabs.appspot.com",
    messagingSenderId: "147168306128",
    appId: "1:147168306128:web:9f303f3239449ae1f1cfd5",
    measurementId: "G-MBCEFCWX0G",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.database();