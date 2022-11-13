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
const auth = getAuth(app);
const database = getDatabase(app);

// Check connexion

onAuthStateChanged(auth, (user) => {
    if (user) {
        get(ref(database, user.uid)).then((snapshot) => {
            if (snapshot.exists()) {
                if (!snapshot.val().admin) {
                    if (!snapshot.val().confirmation) {
                        window.location = "../Register/Confirmation/";
                    } else {
                        window.location = "../Dashboard/";
                    }
                }
            } else {
                window.location = "../Register/Confirmation/";
            }
        }).catch((error) => {
            window.location = "../Register/Confirmation/";
        });
    } else {
        window.location = "../Register/";
    }
});

const SVG = {
    Upgrade: '<svg width="20" height="20" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path xmlns="http://www.w3.org/2000/svg" d="M21.77,8.948a1.238,1.238,0,0,1-.7-1.7,3.239,3.239,0,0,0-4.315-4.316,1.239,1.239,0,0,1-1.7-.7,3.239,3.239,0,0,0-6.1,0,1.238,1.238,0,0,1-1.7.7A3.239,3.239,0,0,0,2.934,7.249a1.237,1.237,0,0,1-.7,1.7,3.24,3.24,0,0,0,0,6.1,1.238,1.238,0,0,1,.705,1.7A3.238,3.238,0,0,0,7.25,21.066a1.238,1.238,0,0,1,1.7.7,3.239,3.239,0,0,0,6.1,0,1.238,1.238,0,0,1,1.7-.7,3.239,3.239,0,0,0,4.316-4.315,1.239,1.239,0,0,1,.7-1.7,3.239,3.239,0,0,0,0-6.1Zm-.67,4.219a3.239,3.239,0,0,0-1.84,4.442,1.239,1.239,0,0,1-1.652,1.651,3.238,3.238,0,0,0-4.441,1.84,1.238,1.238,0,0,1-2.334,0,3.24,3.24,0,0,0-4.442-1.84,1.239,1.239,0,0,1-1.65-1.652A3.238,3.238,0,0,0,2.9,13.167a1.239,1.239,0,0,1,0-2.334A3.237,3.237,0,0,0,4.74,6.391,1.239,1.239,0,0,1,6.391,4.74,3.239,3.239,0,0,0,10.833,2.9a1.238,1.238,0,0,1,2.334,0,3.239,3.239,0,0,0,4.442,1.84A1.239,1.239,0,0,1,19.26,6.392a3.238,3.238,0,0,0,1.84,4.441,1.238,1.238,0,0,1,0,2.334Z" fill="#4083F8"/></svg>',
    Enable: '<svg width="18" height="20" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m17 24a7 7 0 1 1 7-7 7.008 7.008 0 0 1 -7 7zm0-12a5 5 0 1 0 5 5 5.006 5.006 0 0 0 -5-5zm1.707 6.707a1 1 0 0 0 0-1.414l-.707-.707v-1.586a1 1 0 0 0 -2 0v2a1 1 0 0 0 .293.707l1 1a1 1 0 0 0 1.414 0zm-16.707 4.293a8.3 8.3 0 0 1 6.221-8.024 1 1 0 0 0 -.442-1.952 10.213 10.213 0 0 0 -7.779 9.976 1 1 0 0 0 2 0zm6.474-12a5.5 5.5 0 1 1 5.5-5.5 5.506 5.506 0 0 1 -5.5 5.5zm0-9a3.5 3.5 0 1 0 3.5 3.5 3.5 3.5 0 0 0 -3.5-3.5z" fill="#0D9F6E"></path></svg>',
    Disable: '<svg width="18" height="20" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m17 24a7 7 0 1 1 7-7 7.008 7.008 0 0 1 -7 7zm0-12a5 5 0 1 0 5 5 5.006 5.006 0 0 0 -5-5zm1.707 6.707a1 1 0 0 0 0-1.414l-.707-.707v-1.586a1 1 0 0 0 -2 0v2a1 1 0 0 0 .293.707l1 1a1 1 0 0 0 1.414 0zm-16.707 4.293a8.3 8.3 0 0 1 6.221-8.024 1 1 0 0 0 -.442-1.952 10.213 10.213 0 0 0 -7.779 9.976 1 1 0 0 0 2 0zm6.474-12a5.5 5.5 0 1 1 5.5-5.5 5.506 5.506 0 0 1 -5.5 5.5zm0-9a3.5 3.5 0 1 0 3.5 3.5 3.5 3.5 0 0 0 -3.5-3.5z" fill="#D84A49"></path></svg>',
    Delete: '<svg width="18" height="20" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m9 12a6 6 0 1 0 -6-6 6.006 6.006 0 0 0 6 6zm0-10a4 4 0 1 1 -4 4 4 4 0 0 1 4-4zm9 21a1 1 0 0 1 -2 0 7 7 0 0 0 -14 0 1 1 0 0 1 -2 0 9 9 0 0 1 18 0zm5.707-8.707a1 1 0 1 1 -1.414 1.414l-1.793-1.793-1.793 1.793a1 1 0 0 1 -1.414-1.414l1.793-1.793-1.793-1.793a1 1 0 0 1 1.414-1.414l1.793 1.793 1.793-1.793a1 1 0 0 1 1.414 1.414l-1.793 1.793z" fill="#D84A49"></path></svg>',
    Admin: '<svg width="18" height="20" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.77,8.948a1.238,1.238,0,0,1-.7-1.7,3.239,3.239,0,0,0-4.315-4.316,1.239,1.239,0,0,1-1.7-.7,3.239,3.239,0,0,0-6.1,0,1.238,1.238,0,0,1-1.7.7A3.239,3.239,0,0,0,2.934,7.249a1.237,1.237,0,0,1-.7,1.7,3.24,3.24,0,0,0,0,6.1,1.238,1.238,0,0,1,.705,1.7A3.238,3.238,0,0,0,7.25,21.066a1.238,1.238,0,0,1,1.7.7,3.239,3.239,0,0,0,6.1,0,1.238,1.238,0,0,1,1.7-.7,3.239,3.239,0,0,0,4.316-4.315,1.239,1.239,0,0,1,.7-1.7,3.239,3.239,0,0,0,0-6.1Z" fill="#4083F8"></path></svg>'
}

// Retrieve users data

onValue(ref(database), (snapshot) => {
    $("#TableBody").empty();
    if (snapshot.exists()) {
        for (const [key, value] of Object.entries(snapshot.val())) {
            createRow(key, value.displayName, value.email, "01/09/1999", value.disabled, value.confirmation, value.admin);
            const Seperator = document.createElement("tr");
            Seperator.className = "h-1";
            document.getElementById("TableBody").appendChild(Seperator);
        }
    }
});

// Create row

function createRow(uid, displayName, email, date, disabled, confirmation, admin) {
    const Row = document.createElement("tr");
    Row.className = "text-xs bg-dark_lighter";
    const ID = document.createElement("td");
    ID.className = "py-5 px-6 font-medium rounded-tl-lg rounded-bl-lg";
    ID.innerHTML = uid;
    Row.appendChild(ID);
    const nameEmailContainer = document.createElement("td");
    nameEmailContainer.className = "flex px-4 py-3";
    Row.appendChild(nameEmailContainer);
    const nameEmail = document.createElement("div");
    nameEmailContainer.appendChild(nameEmail);
    const Name = document.createElement("p");
    Name.className = "font-medium";
    Name.innerHTML = displayName;
    nameEmail.appendChild(Name);
    const Email = document.createElement("p");
    Email.innerHTML = email;
    nameEmail.appendChild(Email);
    const joinDate = document.createElement("td");
    joinDate.className = "font-medium";
    joinDate.innerHTML = date;
    Row.appendChild(joinDate);
    const StatusContainer = document.createElement("td");
    Row.appendChild(StatusContainer);
    const Status = document.createElement("span");
    if (disabled) {
        Status.className = "inline-block py-1 px-2 text-white bg-red-500 rounded-full";
        Status.innerHTML = "Disable";
    } else {
        Status.className = "inline-block py-1 px-2 text-white bg-green-500 rounded-full";
        Status.innerHTML = "Enable";
    }
    StatusContainer.appendChild(Status);
    const confirmationContainer = document.createElement("td");
    Row.appendChild(confirmationContainer);
    const Confirmation = document.createElement("span");
    Confirmation.className = "inline-block py-1 px-2 text-white bg-blue-500 rounded-full";
    if (confirmation) {
        Confirmation.innerHTML = "Confirmed";
    } else {
        Confirmation.innerHTML = "Not confirmed";
    }
    confirmationContainer.appendChild(Confirmation);
    const actionContainer = document.createElement("td");
    actionContainer.className = "rounded-tr-lg rounded-br-lg";
    Row.appendChild(actionContainer);
    // Upgrade
    const upgradeUser = document.createElement("a");
    upgradeUser.className = "inline-block mr-2 cursor-pointer";
    if (admin) {
        upgradeUser.innerHTML = SVG.Admin;
        upgradeUser.addEventListener("click", userDowngrade);
        upgradeUser.param = {uid: uid};
    } else {
        upgradeUser.innerHTML = SVG.Upgrade;
        upgradeUser.addEventListener("click", userUpgrade);
        upgradeUser.param = {uid: uid};
    }
    actionContainer.appendChild(upgradeUser);
    document.getElementById("TableBody").appendChild(Row);
    // Disable
    const disableUser = document.createElement("a");
    disableUser.className = "inline-block mr-2 cursor-pointer";
    if (disabled) {
        disableUser.innerHTML = SVG.Enable;
        disableUser.addEventListener("click", userEnable);
        disableUser.param = {uid: uid};
    } else {
        disableUser.innerHTML = SVG.Disable;
        disableUser.addEventListener("click", userDisable);
        disableUser.param = {uid: uid};
    }
    actionContainer.appendChild(disableUser);
    document.getElementById("TableBody").appendChild(Row);
    // Delete
    const deleteUser = document.createElement("a");
    deleteUser.className = "inline-block mr-2 cursor-pointer";
    deleteUser.innerHTML = SVG.Delete;
    deleteUser.addEventListener("click", userDelete);
    deleteUser.param = {uid: uid};
    actionContainer.appendChild(deleteUser);
    document.getElementById("TableBody").appendChild(Row);
}

function userDowngrade(data) {
    console.log("Downgrade");
    update(ref(database, data.currentTarget.param.uid), {admin: false});
}

function userUpgrade(data) {
    console.log("Upgrade");
    update(ref(database, data.currentTarget.param.uid), {admin: true});
}

function userEnable(data) {
    console.log("Enable");
    update(ref(database, data.currentTarget.param.uid), {disabled: false});
}

function userDisable(data) {
    console.log("Disable");
    update(ref(database, data.currentTarget.param.uid), {disabled: true});
}

function userDelete(data) {
    const Delete = {};
    Delete[data.currentTarget.param.uid] = null;
    update(ref(database), Delete);
}