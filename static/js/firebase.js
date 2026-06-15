const firebaseConfig = {
  apiKey: "AIzaSyBctZMYmohzHYLHD5nCKMvy2vKJKe8fpxY",
  authDomain: "data-governance-940cf.firebaseapp.com",
  databaseURL: "https://data-governance-940cf-default-rtdb.firebaseio.com",
  projectId: "data-governance-940cf",
  storageBucket: "data-governance-940cf.firebasestorage.app",
  messagingSenderId: "385925345328",
  appId: "1:385925345328:web:c1f1d48c3dac12ce097df5"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const db = firebase.firestore();