import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Check connexion

onAuthStateChanged(auth, (user) => {
    if (user) {
        get(ref(database, user.uid)).then((snapshot) => {
            if (snapshot.exists()) {
                if (!snapshot.val().admin) {
                    if (!snapshot.val().confirmation) {
                        window.location = "./Confirmation/";
                    } else {
                        window.location = "../Dashboard/";
                    }
                } else {
                    window.location = "../Admin/";
                }
            } else {
                window.location = "./Confirmation/";
            }
        }).catch((error) => {
            window.location = "./Confirmation/";
        });
    }
});

// Create account

$("form").submit(function(event) {
    const Data = $("form").serializeArray();
    createUserWithEmailAndPassword(auth, Data[1].value, Data[2].value).then((userCredential) => {
        const Updates = {};
        Updates["displayName"] = Data[0].value;
        update(ref(database, userCredential.user.uid), Updates);
    });
    return false;
});

changeToSignIn();

// SignIn with Google

$("#Google").click(function() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
    });
});

// SignIn with Facebook

$("#Facebook").click(function() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
    });
});

// SignIn with email

function changeToSignIn() {
    $("#Change").find("a").click(function() {
        $("form").find("div").first().find("input").prop("required",false);
        $("form").find("div").first().hide();
        $("form").unbind("submit");
        $("form").submit(function(event) {
            const Data = $("form").serializeArray();
            signInWithEmailAndPassword(auth, Data[1].value, Data[2].value).then((userCredential) => {
                console.log(userCredential.user);
            });
            return false;
        });
        $("#Change").find("span").html("Don't have any account ?");
        $("#Change").find("a").html("Register");
        $("#Change").find("a").unbind("click");
        $("#CreateAccount").html("Connexion");
        changeToRegister();
    });
}

function changeToRegister() {
    $("#Change").find("a").click(function() {
        $("form").find("div").first().find("input").prop("required",true);
        $("form").find("div").first().show();
        $("form").unbind("submit");
        $("form").submit(function(event) {
            const Data = $("form").serializeArray();
            createUserWithEmailAndPassword(auth, Data[1].value, Data[2].value).then((userCredential) => {
                const Updates = {};
                Updates["displayName"] = Data[0].value;
                update(ref(database, userCredential.user.uid), Updates);
            });
            return false;
        });
        $("#Change").find("span").html("Already have an acoount ?");
        $("#Change").find("a").html("Sign In");
        $("#Change").find("a").unbind("click");
        $("#CreateAccount").html("Create account");
        changeToSignIn();
    })
}