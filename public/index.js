import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, FacebookAuthProvider} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getDatabase, get, ref, set, onValue, connectDatabaseEmulator, update, push, query, orderByChild, equalTo, off } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBcYKq1S_3ICRarZJoqvYaS08r18vV7W7k",
  authDomain: "dashboard-81b3f.firebaseapp.com",
  projectId: "dashboard-81b3f",
  storageBucket: "dashboard-81b3f.appspot.com",
  messagingSenderId: "179278508951",
  appId: "1:179278508951:web:74a2e76d5a1bf0bec48ad2",
  measurementId: "G-QEGPVWXVY1",
  databaseURL: "https://dashboard-81b3f-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        get(ref(database, user.uid)).then((snapshot) => {
            if (snapshot.exists()) {
                if (!snapshot.val().confirmation) {
                    window.location = "./Register/Confirmation/";
                }
            } else {
                window.location = "./Register/Confirmation/";
            }
        })
    } else {
        window.location = "./Register/";
    }
});

// signOut(auth);