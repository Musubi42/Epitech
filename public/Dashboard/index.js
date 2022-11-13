import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, FacebookAuthProvider} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getDatabase, get, ref, child, set, onValue, connectDatabaseEmulator, update, push, query, orderByChild, equalTo, off } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-functions.js";

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
const functions = getFunctions(app, "europe-west1");

const SVG = {
    Gear: "<svg id='gear' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 46 46' class='p-1'><path d='m19.4 44-1-6.3q-.95-.35-2-.95t-1.85-1.25l-5.9 2.7L4 30l5.4-3.95q-.1-.45-.125-1.025Q9.25 24.45 9.25 24q0-.45.025-1.025T9.4 21.95L4 18l4.65-8.2 5.9 2.7q.8-.65 1.85-1.25t2-.9l1-6.35h9.2l1 6.3q.95.35 2.025.925Q32.7 11.8 33.45 12.5l5.9-2.7L44 18l-5.4 3.85q.1.5.125 1.075.025.575.025 1.075t-.025 1.05q-.025.55-.125 1.05L44 30l-4.65 8.2-5.9-2.7q-.8.65-1.825 1.275-1.025.625-2.025.925l-1 6.3ZM24 30.5q2.7 0 4.6-1.9 1.9-1.9 1.9-4.6 0-2.7-1.9-4.6-1.9-1.9-4.6-1.9-2.7 0-4.6 1.9-1.9 1.9-1.9 4.6 0 2.7 1.9 4.6 1.9 1.9 4.6 1.9Zm0-3q-1.45 0-2.475-1.025Q20.5 25.45 20.5 24q0-1.45 1.025-2.475Q22.55 20.5 24 20.5q1.45 0 2.475 1.025Q27.5 22.55 27.5 24q0 1.45-1.025 2.475Q25.45 27.5 24 27.5Zm0-3.5Zm-2.2 17h4.4l.7-5.6q1.65-.4 3.125-1.25T32.7 32.1l5.3 2.3 2-3.6-4.7-3.45q.2-.85.325-1.675.125-.825.125-1.675 0-.85-.1-1.675-.1-.825-.35-1.675L40 17.2l-2-3.6-5.3 2.3q-1.15-1.3-2.6-2.175-1.45-.875-3.2-1.125L26.2 7h-4.4l-.7 5.6q-1.7.35-3.175 1.2-1.475.85-2.625 2.1L10 13.6l-2 3.6 4.7 3.45q-.2.85-.325 1.675-.125.825-.125 1.675 0 .85.125 1.675.125.825.325 1.675L8 30.8l2 3.6 5.3-2.3q1.2 1.2 2.675 2.05Q19.45 35 21.1 35.4Z' fill='white'/></svg>"
}

// Check connexion

onAuthStateChanged(auth, (user) => {
    if (user) {
        get(ref(database, user.uid)).then((snapshot) => {
            if (snapshot.exists()) {
                if (!snapshot.val().admin) {
                    if (!snapshot.val().confirmation) {
                        window.location = "../Register/Confirmation/";
                    } else {
                        getUserWidgets();
                    }
                } else {
                    window.location = "../Admin/";
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

// Get user widgets

function getUserWidgets() {
    onValue(ref(database, `${auth.currentUser.uid}/Widgets`), (snapshot) => {
        $("#DashboardWidgets").empty();
        $("#StocksDashboard").empty();
        $("#MapDashboard").empty();
        if (snapshot.exists()) {
            for (const [Type, Widgets] of Object.entries(snapshot.val())) {
                if (Type == "Jokes") {
                    for (const [key, value] of Object.entries(Widgets)) {
                        addJokes(key, value.Content, value.Refresh, value.Category);
                        // Refresh Joke
                        setTimeout(function() {
                            // getJokes(value.Category, value.Refresh, key);
                        }, 10000);
                    }
                } else if (Type == "News") {
                    for (const [key, value] of Object.entries(Widgets)) {
                        addNews(key, value.Title, value.Content, value.Author, value.Link, value.Refresh, value.Category, value.Country);
                        // Refresh News
                        setTimeout(function() {
                            // getNews(value.Category, value.Country, value.Refresh, key);
                        }, 9000);
                    }
                } else if (Type == "Satellites") {
                    for (const [key, value] of Object.entries(Widgets)) {
                        addSatellite(key, value.Latitude, value.Longitude, value.Refresh, value.ID, value.Name, value.Altitude);
                        // Refresh Satellite
                        setTimeout(function() {
                            // getSatellite(value.Satellite, value.Refresh, key);
                        }, 9000);
                    }
                } else if (Type == "Stocks") {
                    for (const [key, value] of Object.entries(Widgets)) {
                        addStocks(key, value.Symbol, value.Refresh, value.NewPrice, value.LastPrice, value.NewVolume, value.LastVolume, value.NewHigh, value.LastHigh, value.NewLow, value.LastLow);
                    }
                }
            }
        }
    })
}

// Navigation bar

$("#Jokes").click(function() {
    getJokes();
});

$("#News").click(function() {
    getNews();
});

$("#Stocks").click(function() {
    getStocks();
});

$("#Map").click(function() {
    getSatellite();
});

// API call

function getJokes(category = "", refresh = 10, key = "") {
    var URL = category == "" ? "http://localhost:9090/api/ChuckNorris" : `http://localhost:9090/api/ChuckNorris?category=${category}`;
    $.ajax({type: "GET", url: URL, data: "", dataType: "json", success: function(data) {
        const Updates = {};
        var Key = key == "" ? push(child(ref(database), `${auth.currentUser.uid}/Widgets/Jokes`)).key : key;
        Updates["Refresh"] = refresh;
        Updates["Content"] = data.value;
        Updates["Category"] = category;
        update(ref(database, `${auth.currentUser.uid}/Widgets/Jokes/${Key}`), Updates);
    }, error: function(data) {
    
    }});
}

function getNews(category = "health", country = "fr", refresh = 10, key = "") {
    var URL = category == "" ? "http://localhost:9090/api/News?" : `http://localhost:9090/api/News?category=${category}&`;
    URL = country == "" ? URL.replace("&", "") : URL+`country=${country}`;
    console.log(URL);
    $.ajax({type: "GET", url: URL, data: "", dataType: "json", success: function(data) {
        console.log(data);
        const Random = Math.floor(Math.random()*data.articles.length);
        const Updates = {};
        var Key = key == "" ? push(child(ref(database), `${auth.currentUser.uid}/Widgets/Jokes`)).key : key;
        Updates["Refresh"] = refresh;
        Updates["Title"] = data.articles[Random].title;
        console.log(data.articles[Random]);
        Updates["Content"] = data.articles[Random].content == null ? "" : data.articles[Random].content.split("…")[0]+" ...";
        Updates["Author"] = data.articles[Random].source.name;
        Updates["Link"] = data.articles[Random].url;
        Updates["Category"] = category;
        Updates["Country"] = country;
        update(ref(database, `${auth.currentUser.uid}/Widgets/News/${Key}`), Updates);
    }, error: function(data) {
    
    }});
}

function getSatellite(satellite = "25544", refresh = 10, key = "") {
    var URL = satellite == "" ? "http://localhost:9090/api/Satellites" : `http://localhost:9090/api/Satellites?satellite=${satellite}`;
    $.ajax({type: "GET", url: URL, data: "", dataType: "json", success: function(data) {
        const Updates = {};
        var Key = key == "" ? push(child(ref(database), `${auth.currentUser.uid}/Widgets/Jokes`)).key : key;
        Updates["Refresh"] = refresh;
        Updates["Latitude"] = data.positions[0].satlatitude;
        Updates["Longitude"] = data.positions[0].satlongitude;
        Updates["Name"] = data.info.satname;
        Updates["ID"] = satellite;
        Updates["Altitude"] = data.positions[0].sataltitude;
        update(ref(database, `${auth.currentUser.uid}/Widgets/Satellites/${Key}`), Updates);
    }, error: function(data) {
    
    }});
}

function getStocks(symbol = "IBM", refresh = 10, key = "") {
    var URL = symbol == "" ? "http://localhost:9090/api/Stocks" : `http://localhost:9090/api/Stocks?symbol=${symbol}`;
    $.ajax({type: "GET", url: URL, data: "", dataType: "json", success: function(data) {
        const Updates = {};
        var Key = key == "" ? push(child(ref(database), `${auth.currentUser.uid}/Widgets/Stocks`)).key : key;
        Updates["Refresh"] = refresh;
        Updates["Symbol"] = symbol;
        Updates["NewPrice"] = parseInt(Object.values(data["Time Series (Daily)"])[0]["1. open"]);
        Updates["LastPrice"] = parseInt(Object.values(data["Time Series (Daily)"])[1]["1. open"]);
        Updates["NewVolume"] = parseInt(Object.values(data["Time Series (Daily)"])[0]["6. volume"]);
        Updates["LastVolume"] = parseInt(Object.values(data["Time Series (Daily)"])[1]["6. volume"]);
        Updates["NewHigh"] = parseInt(Object.values(data["Time Series (Daily)"])[0]["2. high"]);
        Updates["LastHigh"] = parseInt(Object.values(data["Time Series (Daily)"])[1]["2. high"]);
        Updates["NewLow"] = parseInt(Object.values(data["Time Series (Daily)"])[0]["3. low"]);
        Updates["LastLow"] = parseInt(Object.values(data["Time Series (Daily)"])[1]["3. low"]);
        update(ref(database, `${auth.currentUser.uid}/Widgets/Stocks/${Key}`), Updates);
    }, error: function(data) {
    
    }});
}

// Add widgets

function addJokes(id, content, refresh, category = "") {
    // Container
    var Container = document.createElement("div");
    Container.className = "col-span-2 bg-dark_lighter flex flex-col p-5 rounded-xl";
    document.getElementById("DashboardWidgets").appendChild(Container);
    // Header
    var Header = document.createElement("div");
    Header.className = "relative flex flex-row";
    Container.appendChild(Header);
    // Type
    var Type = document.createElement("div");
    Type.className = "text-white font-medium";
    Type.innerHTML = "Jokes";
    Header.appendChild(Type);
    // Gear
    var GearContainer = document.createElement("div");
    GearContainer.className = "ml-auto h-6 w-6 rounded-full bg-gray-600 hover:bg-gray-700 cursor-pointer";
    GearContainer.innerHTML = SVG.Gear;
    Header.appendChild(GearContainer);
    // Parameters
    var Parameters = document.createElement("div");
    Parameters.className = "absolute bg-gray-600 rounded-lg pt-2 pb-2 pl-2 pr-2 right-0 flex flex-col top-7 hidden";
    Header.appendChild(Parameters);
    GearContainer.addEventListener("click", function() {
        if (Parameters.className.includes("hidden")) {
            Parameters.className = Parameters.className.replace("hidden","");
        } else {
            Parameters.className = Parameters.className + " hidden";
        }
    });
    // Category
    var Category = document.createElement("input");
    Category.type = "text";
    Category.className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3";
    Category.placeholder = "Category";
    Category.value = category;
    Parameters.appendChild(Category);
    // Refresh
    var RefreshContainer = document.createElement("div");
    RefreshContainer.className = "flex items-center";
    Parameters.appendChild(RefreshContainer);
    // Auto (10 min)
    var AutoRefreshInput = document.createElement("input");
    AutoRefreshInput.type = "radio";
    AutoRefreshInput.name = `Refresh${id}`
    AutoRefreshInput.id = "auto"
    AutoRefreshInput.value = "10";
    AutoRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(AutoRefreshInput);
    var AutoRefreshLabel = document.createElement("label");
    AutoRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    AutoRefreshLabel.innerHTML = "10";
    RefreshContainer.appendChild(AutoRefreshLabel);
    // 30 min
    var HalfHourRefreshInput = document.createElement("input");
    HalfHourRefreshInput.type = "radio";
    HalfHourRefreshInput.name = `Refresh${id}`
    HalfHourRefreshInput.id = "auto"
    HalfHourRefreshInput.value = "30";
    HalfHourRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(HalfHourRefreshInput);
    var HalfHourRefreshLabel = document.createElement("label");
    HalfHourRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    HalfHourRefreshLabel.innerHTML = "30";
    RefreshContainer.appendChild(HalfHourRefreshLabel);
    // 60 min
    var HourRefreshInput = document.createElement("input");
    HourRefreshInput.type = "radio";
    HourRefreshInput.name = `Refresh${id}`
    HourRefreshInput.id = "auto"
    HourRefreshInput.value = "60";
    HourRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(HourRefreshInput);
    var HourRefreshLabel = document.createElement("label");
    HourRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    HourRefreshLabel.innerHTML = "60";
    RefreshContainer.appendChild(HourRefreshLabel);
    if (refresh == 10) {
        AutoRefreshInput.checked = true
    } else if (refresh == 30) {
        HalfHourRefreshInput.checked = true
    } else {
        HourRefreshInput.checked = true
    }
    // Update & Delete
    var UpdateDeleteContainer = document.createElement("div");
    UpdateDeleteContainer.className = "flex flex-row-reverse";
    Parameters.appendChild(UpdateDeleteContainer);
    // Delete
    var Delete = document.createElement("div");
    Delete.className = "inline-block py-1 px-2 text-white bg-red-500 rounded-md text-sm cursor-pointer";
    Delete.innerHTML = "Delete"
    UpdateDeleteContainer.appendChild(Delete);
    Delete.addEventListener("click", function() {
        const Updates = {};
        Updates[id] = null;
        update(ref(database, `${auth.currentUser.uid}/Widgets/Jokes`), Updates);
    });
    // Update
    var Update = document.createElement("div");
    Update.className = "inline-block py-1 px-2 text-white bg-green-500 rounded-md text-sm cursor-pointer mr-2";
    Update.innerHTML = "Update"
    UpdateDeleteContainer.appendChild(Update);
    Update.addEventListener("click", function() {
        getJokes(Category.value, parseInt(document.querySelector(`input[name="Refresh${id}"]:checked`).value), id);
    });
    // Title
    var Title = document.createElement("div");
    Title.className = "text-2xl text-white font-semibold mt-3";
    Title.innerHTML = "Chuck Norris";
    Container.appendChild(Title);
    // Joke
    var Joke = document.createElement("div");
    Joke.className = "text-xs text-white font-semibold mt-1";
    Joke.innerHTML = content;
    Container.appendChild(Joke);
}

function addNews(id, title, content, author, link, refresh, category = "", country = "") {
    // Container
    var Container = document.createElement("div");
    Container.className = "col-span-2 bg-dark_lighter flex flex-col p-5 rounded-xl";
    document.getElementById("DashboardWidgets").appendChild(Container);
    // Header
    var Header = document.createElement("div");
    Header.className = "relative flex flex-row";
    Container.appendChild(Header);
    // Type
    var Type = document.createElement("div");
    Type.className = "text-white font-medium";
    Type.innerHTML = "News";
    Header.appendChild(Type);
    // Gear
    var GearContainer = document.createElement("div");
    GearContainer.className = "ml-auto h-6 w-6 rounded-full bg-gray-600 hover:bg-gray-700 cursor-pointer";
    GearContainer.innerHTML = SVG.Gear;
    Header.appendChild(GearContainer);
    // Parameters
    var Parameters = document.createElement("div");
    Parameters.className = "absolute bg-gray-600 rounded-lg pt-2 pb-2 pl-2 pr-2 right-0 flex flex-col top-7 hidden";
    Header.appendChild(Parameters);
    GearContainer.addEventListener("click", function() {
        if (Parameters.className.includes("hidden")) {
            Parameters.className = Parameters.className.replace("hidden","");
        } else {
            Parameters.className = Parameters.className + " hidden";
        }
    });
    // Category
    var Category = document.createElement("input");
    Category.type = "text";
    Category.className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3";
    Category.placeholder = "Category";
    Category.value = category;
    Parameters.appendChild(Category);
    // Country
    var Country = document.createElement("input");
    Country.type = "text";
    Country.className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3";
    Country.placeholder = "Country";
    Country.value = country;
    Parameters.appendChild(Country);
    // Refresh
    var RefreshContainer = document.createElement("div");
    RefreshContainer.className = "flex items-center";
    Parameters.appendChild(RefreshContainer);
    // Auto (10 min)
    var AutoRefreshInput = document.createElement("input");
    AutoRefreshInput.type = "radio";
    AutoRefreshInput.name = `Refresh${id}`
    AutoRefreshInput.id = "auto"
    AutoRefreshInput.value = "10";
    AutoRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(AutoRefreshInput);
    var AutoRefreshLabel = document.createElement("label");
    AutoRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    AutoRefreshLabel.innerHTML = "10";
    RefreshContainer.appendChild(AutoRefreshLabel);
    // 30 min
    var HalfHourRefreshInput = document.createElement("input");
    HalfHourRefreshInput.type = "radio";
    HalfHourRefreshInput.name = `Refresh${id}`;
    HalfHourRefreshInput.value = "30";
    HalfHourRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(HalfHourRefreshInput);
    var HalfHourRefreshLabel = document.createElement("label");
    HalfHourRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    HalfHourRefreshLabel.innerHTML = "30";
    RefreshContainer.appendChild(HalfHourRefreshLabel);
    // 60 min
    var HourRefreshInput = document.createElement("input");
    HourRefreshInput.type = "radio";
    HourRefreshInput.name = `Refresh${id}`;
    HourRefreshInput.id = "auto"
    HourRefreshInput.value = "60";
    HourRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(HourRefreshInput);
    var HourRefreshLabel = document.createElement("label");
    HourRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    HourRefreshLabel.innerHTML = "60";
    RefreshContainer.appendChild(HourRefreshLabel);
    if (refresh == 10) {
        AutoRefreshInput.checked = true
    } else if (refresh == 30) {
        HalfHourRefreshInput.checked = true
    } else {
        HourRefreshInput.checked = true
    }
    // Update & Delete
    var UpdateDeleteContainer = document.createElement("div");
    UpdateDeleteContainer.className = "flex flex-row-reverse";
    Parameters.appendChild(UpdateDeleteContainer);
    // Delete
    var Delete = document.createElement("div");
    Delete.className = "inline-block py-1 px-2 text-white bg-red-500 rounded-md text-sm cursor-pointer";
    Delete.innerHTML = "Delete"
    UpdateDeleteContainer.appendChild(Delete);
    Delete.addEventListener("click", function() {
        const Updates = {};
        Updates[id] = null;
        update(ref(database, `${auth.currentUser.uid}/Widgets/News`), Updates);
    });
    // Update
    var Update = document.createElement("div");
    Update.className = "inline-block py-1 px-2 text-white bg-green-500 rounded-md text-sm cursor-pointer mr-2";
    Update.innerHTML = "Update"
    UpdateDeleteContainer.appendChild(Update);
    Update.addEventListener("click", function() {
        getNews(Category.value, Country.value, parseInt(document.querySelector(`input[name="Refresh${id}"]:checked`).value), id);
    });
    // Title
    var Title = document.createElement("div");
    Title.className = "text-2xl text-white font-semibold mt-3";
    Title.innerHTML = title;
    Container.appendChild(Title);
    // News
    var News = document.createElement("div");
    News.className = "mb-5 text-xs text-white font-semibold mt-1";
    News.innerHTML = content;
    Container.appendChild(News);
    // Author
    var Author = document.createElement("a");
    Author.className = "mt-auto inline-block py-1 px-2 rounded-full bg-gray-600 hover:bg-blue-500 text-xs text-white ml-auto cursor-pointer";
    Author.href = link;
    Author.target = "_blank";
    Author.innerHTML = author;
    Container.appendChild(Author);
}

function addSatellite(id, latitude, longitude, refresh, satellite, name, altitude) {
    // Container
    var Container = document.createElement("div");
    Container.className = "relative col-span-3 bg-dark_lighter flex flex-col p-5 rounded-xl h-96";
    Container.id = id;
    document.getElementById("DashboardWidgets").appendChild(Container);
    // Map
    mapboxgl.accessToken = 'pk.eyJ1IjoibWlzdGVyaG0iLCJhIjoiY2tvc2k2NzdtMDFwYzJwcng4aDRraWczeiJ9.OlrnunjFsM20lBB73JTmig';
    var map = new mapboxgl.Map({
        container: id,
        style: "mapbox://styles/misterhm/cl9zevzwf00hi14p04xqrrb96",
        attributionControl: false,
        zoom: 1,
        dragPan: false,
        center: [longitude, latitude]
    });
    map.scrollZoom.disable();
    // Marker
    const marker = document.createElement('div');
    marker.className = "h-4 w-4 bg-blue-500 rounded-full"
    new mapboxgl.Marker(marker).setLngLat([longitude, latitude]).addTo(map);
    // Header
    var Header = document.createElement("div");
    Header.className = "relative flex flex-row";
    Container.appendChild(Header);
    // Gear
    var GearContainer = document.createElement("div");
    GearContainer.className = "ml-auto h-6 w-6 rounded-full bg-gray-600 hover:bg-gray-700 cursor-pointer";
    GearContainer.innerHTML = SVG.Gear;
    Header.appendChild(GearContainer);
    // Parameters
    var Parameters = document.createElement("div");
    Parameters.className = "absolute bg-gray-600 rounded-lg pt-2 pb-2 pl-2 pr-2 right-0 flex flex-col top-7 hidden";
    Header.appendChild(Parameters);
    GearContainer.addEventListener("click", function() {
        if (Parameters.className.includes("hidden")) {
            Parameters.className = Parameters.className.replace("hidden","");
        } else {
            Parameters.className = Parameters.className + " hidden";
        }
    });
    // Category
    var Satellite = document.createElement("input");
    Satellite.type = "text";
    Satellite.className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3";
    Satellite.placeholder = "Satellite";
    Satellite.value = satellite;
    Parameters.appendChild(Satellite);
    // Refresh
    var RefreshContainer = document.createElement("div");
    RefreshContainer.className = "flex items-center";
    Parameters.appendChild(RefreshContainer);
    // Auto (10 min)
    var AutoRefreshInput = document.createElement("input");
    AutoRefreshInput.type = "radio";
    AutoRefreshInput.name = `Refresh${id}`
    AutoRefreshInput.id = "auto"
    AutoRefreshInput.value = "10";
    AutoRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(AutoRefreshInput);
    var AutoRefreshLabel = document.createElement("label");
    AutoRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    AutoRefreshLabel.innerHTML = "10";
    RefreshContainer.appendChild(AutoRefreshLabel);
    // 30 min
    var HalfHourRefreshInput = document.createElement("input");
    HalfHourRefreshInput.type = "radio";
    HalfHourRefreshInput.name = `Refresh${id}`
    HalfHourRefreshInput.id = "auto"
    HalfHourRefreshInput.value = "30";
    HalfHourRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(HalfHourRefreshInput);
    var HalfHourRefreshLabel = document.createElement("label");
    HalfHourRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    HalfHourRefreshLabel.innerHTML = "30";
    RefreshContainer.appendChild(HalfHourRefreshLabel);
    // 60 min
    var HourRefreshInput = document.createElement("input");
    HourRefreshInput.type = "radio";
    HourRefreshInput.name = `Refresh${id}`
    HourRefreshInput.id = "auto"
    HourRefreshInput.value = "60";
    HourRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(HourRefreshInput);
    var HourRefreshLabel = document.createElement("label");
    HourRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    HourRefreshLabel.innerHTML = "60";
    RefreshContainer.appendChild(HourRefreshLabel);
    if (refresh == 10) {
        AutoRefreshInput.checked = true
    } else if (refresh == 30) {
        HalfHourRefreshInput.checked = true
    } else {
        HourRefreshInput.checked = true
    }
    // Update & Delete
    var UpdateDeleteContainer = document.createElement("div");
    UpdateDeleteContainer.className = "flex flex-row-reverse";
    Parameters.appendChild(UpdateDeleteContainer);
    // Delete
    var Delete = document.createElement("div");
    Delete.className = "inline-block py-1 px-2 text-white bg-red-500 rounded-md text-sm cursor-pointer";
    Delete.innerHTML = "Delete"
    UpdateDeleteContainer.appendChild(Delete);
    Delete.addEventListener("click", function() {
        const Updates = {};
        Updates[id] = null;
        update(ref(database, `${auth.currentUser.uid}/Widgets/Satellites`), Updates);
    });
    // Update
    var Update = document.createElement("div");
    Update.className = "inline-block py-1 px-2 text-white bg-green-500 rounded-md text-sm cursor-pointer mr-2";
    Update.innerHTML = "Update"
    UpdateDeleteContainer.appendChild(Update);
    Update.addEventListener("click", function() {
        getSatellite(Satellite.value, parseInt(document.querySelector(`input[name="Refresh${id}"]:checked`).value), id);
    });
    // Informations
    var Informations = document.createElement("div");
    Informations.className = "col-span-1 bg-dark_lighter flex flex-col p-5 rounded-xl h-96";
    document.getElementById("DashboardWidgets").appendChild(Informations);
    // Name
    var SatelliteName = document.createElement("div");
    SatelliteName.className = "text-white font-medium";
    SatelliteName.innerHTML = name;
    Informations.appendChild(SatelliteName);
    // ID
    var SatelliteID = document.createElement("div");
    SatelliteID.className = "text-white font-semibold mb-3";
    SatelliteID.innerHTML = satellite;
    Informations.appendChild(SatelliteID);
    // Longitude
    var SatelliteLongitude = document.createElement("div");
    SatelliteLongitude.className = "text-white";
    SatelliteLongitude.innerHTML = "Long : " + longitude.toString();
    Informations.appendChild(SatelliteLongitude);
    // Latitude
    var SatelliteLatitude = document.createElement("div");
    SatelliteLatitude.className = "text-white";
    SatelliteLatitude.innerHTML = "Lat : " + latitude.toString();
    Informations.appendChild(SatelliteLatitude);
}

function addStocks(id, symbol, refresh, newPrice, lastPrice, newVolume, lastVolume, newHigh, lastHigh, newLow, lastLow) {
    // Price

    // Container
    var PriceContainer = document.createElement("div");
    PriceContainer.className = "col-span-2 bg-dark_lighter flex flex-col p-5 rounded-xl";
    document.getElementById("DashboardWidgets").appendChild(PriceContainer);
    // Header
    var PriceHeader = document.createElement("div");
    PriceHeader.className = "relative flex flex-row";
    PriceContainer.appendChild(PriceHeader);
    // Type
    var PriceType = document.createElement("div");
    PriceType.className = "text-white font-medium";
    PriceType.innerHTML = "Price";
    PriceHeader.appendChild(PriceType);
    // Gear
    var GearContainer = document.createElement("div");
    GearContainer.className = "ml-auto h-6 w-6 rounded-full bg-gray-600 hover:bg-gray-700 cursor-pointer";
    GearContainer.innerHTML = SVG.Gear;
    PriceHeader.appendChild(GearContainer);
    // Parameters
    var Parameters = document.createElement("div");
    Parameters.className = "absolute bg-gray-600 rounded-lg pt-2 pb-2 pl-2 pr-2 right-0 flex flex-col top-7 hidden";
    PriceHeader.appendChild(Parameters);
    GearContainer.addEventListener("click", function() {
        if (Parameters.className.includes("hidden")) {
            Parameters.className = Parameters.className.replace("hidden","");
        } else {
            Parameters.className = Parameters.className + " hidden";
        }
    });
    // Symbol
    var Symbol = document.createElement("input");
    Symbol.type = "text";
    Symbol.className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3";
    Symbol.placeholder = "Symbol";
    Symbol.value = symbol;
    Parameters.appendChild(Symbol);
    // Refresh
    var RefreshContainer = document.createElement("div");
    RefreshContainer.className = "flex items-center";
    Parameters.appendChild(RefreshContainer);
    // Auto (10 min)
    var AutoRefreshInput = document.createElement("input");
    AutoRefreshInput.type = "radio";
    AutoRefreshInput.name = `Refresh${id}`
    AutoRefreshInput.id = "auto"
    AutoRefreshInput.value = "10";
    AutoRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(AutoRefreshInput);
    var AutoRefreshLabel = document.createElement("label");
    AutoRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    AutoRefreshLabel.innerHTML = "10";
    RefreshContainer.appendChild(AutoRefreshLabel);
    // 30 min
    var HalfHourRefreshInput = document.createElement("input");
    HalfHourRefreshInput.type = "radio";
    HalfHourRefreshInput.name = `Refresh${id}`;
    HalfHourRefreshInput.value = "30";
    HalfHourRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(HalfHourRefreshInput);
    var HalfHourRefreshLabel = document.createElement("label");
    HalfHourRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    HalfHourRefreshLabel.innerHTML = "30";
    RefreshContainer.appendChild(HalfHourRefreshLabel);
    // 60 min
    var HourRefreshInput = document.createElement("input");
    HourRefreshInput.type = "radio";
    HourRefreshInput.name = `Refresh${id}`;
    HourRefreshInput.id = "auto"
    HourRefreshInput.value = "60";
    HourRefreshInput.className = "w-4 h-4 ml-2 mb-3";
    RefreshContainer.appendChild(HourRefreshInput);
    var HourRefreshLabel = document.createElement("label");
    HourRefreshLabel.className = "text-white text-sm ml-2 mb-3";
    HourRefreshLabel.innerHTML = "60";
    RefreshContainer.appendChild(HourRefreshLabel);
    if (refresh == 10) {
        AutoRefreshInput.checked = true
    } else if (refresh == 30) {
        HalfHourRefreshInput.checked = true
    } else {
        HourRefreshInput.checked = true
    }
    // Update & Delete
    var UpdateDeleteContainer = document.createElement("div");
    UpdateDeleteContainer.className = "flex flex-row-reverse";
    Parameters.appendChild(UpdateDeleteContainer);
    // Delete
    var Delete = document.createElement("div");
    Delete.className = "inline-block py-1 px-2 text-white bg-red-500 rounded-md text-sm cursor-pointer";
    Delete.innerHTML = "Delete"
    UpdateDeleteContainer.appendChild(Delete);
    Delete.addEventListener("click", function() {
        const Updates = {};
        Updates[id] = null;
        update(ref(database, `${auth.currentUser.uid}/Widgets/Stocks`), Updates);
    });
    // Update
    var Update = document.createElement("div");
    Update.className = "inline-block py-1 px-2 text-white bg-green-500 rounded-md text-sm cursor-pointer mr-2";
    Update.innerHTML = "Update"
    UpdateDeleteContainer.appendChild(Update);
    Update.addEventListener("click", function() {
        getStocks(Symbol.value, parseInt(document.querySelector(`input[name="Refresh${id}"]:checked`).value), id);
    });
    // Price
    var PriceTitle = document.createElement("div");
    PriceTitle.className = "text-center text-2xl text-white font-semibold mt-3 mb-3";
    PriceTitle.innerHTML = "$"+newPrice.toString();
    PriceContainer.appendChild(PriceTitle);
    // Delta
    var DeltaFlexPrice = document.createElement("div");
    DeltaFlexPrice.className = "flex  items-center justify-center";
    PriceContainer.appendChild(DeltaFlexPrice);
    var PriceDelta = document.createElement("a");
    PriceDelta.className = "mt-auto inline-block py-1 px-2 rounded-full text-xs text-white center-items cursor-pointer";
    if (newPrice-lastPrice > 0) {
        PriceDelta.innerHTML = "+" + (newPrice-lastPrice).toString();
        PriceDelta.className = PriceDelta.className + " bg-green-500"
    } else {
        PriceDelta.innerHTML = (newPrice-lastPrice).toString();
        PriceDelta.className = PriceDelta.className + " bg-red-500"
    }
    DeltaFlexPrice.appendChild(PriceDelta);

    // Volume

    // Container
    var VolumeContainer = document.createElement("div");
    VolumeContainer.className = "col-span-2 bg-dark_lighter flex flex-col p-5 rounded-xl";
    document.getElementById("DashboardWidgets").appendChild(VolumeContainer);
    // Header
    var VolumeHeader = document.createElement("div");
    VolumeHeader.className = "relative flex flex-row";
    VolumeContainer.appendChild(VolumeHeader);
    // Type
    var VolumeType = document.createElement("div");
    VolumeType.className = "text-white font-medium";
    VolumeType.innerHTML = "Volume";
    VolumeHeader.appendChild(VolumeType);
    // Price
    var VolumeTitle = document.createElement("div");
    VolumeTitle.className = "text-center text-2xl text-white font-semibold mt-3 mb-3";
    VolumeTitle.innerHTML = newVolume.toString();
    VolumeContainer.appendChild(VolumeTitle);
    // Delta
    var DeltaFlexVolume = document.createElement("div");
    DeltaFlexVolume.className = "flex  items-center justify-center";
    VolumeContainer.appendChild(DeltaFlexVolume);
    var VolumeDelta = document.createElement("a");
    VolumeDelta.className = "mt-auto inline-block py-1 px-2 rounded-full text-xs text-white center-items cursor-pointer";
    if (newVolume-lastVolume > 0) {
        VolumeDelta.innerHTML = "+" + (newVolume-lastVolume).toString();
        VolumeDelta.className = VolumeDelta.className + " bg-green-500"
    } else {
        VolumeDelta.innerHTML = (newVolume-lastVolume).toString();
        VolumeDelta.className = VolumeDelta.className + " bg-red-500"
    }
    DeltaFlexVolume.appendChild(VolumeDelta);

    // High

    // Container
    var HighContainer = document.createElement("div");
    HighContainer.className = "col-span-2 bg-dark_lighter flex flex-col p-5 rounded-xl";
    document.getElementById("DashboardWidgets").appendChild(HighContainer);
    // Header
    var HighHeader = document.createElement("div");
    HighHeader.className = "relative flex flex-row";
    HighContainer.appendChild(HighHeader);
    // Type
    var HighType = document.createElement("div");
    HighType.className = "text-white font-medium";
    HighType.innerHTML = "High";
    HighHeader.appendChild(HighType);
    // Price
    var HighTitle = document.createElement("div");
    HighTitle.className = "text-center text-2xl text-white font-semibold mt-3 mb-3";
    HighTitle.innerHTML = "$" + newHigh.toString();
    HighContainer.appendChild(HighTitle);
    // Delta
    var DeltaFlexHigh = document.createElement("div");
    DeltaFlexHigh.className = "flex  items-center justify-center";
    HighContainer.appendChild(DeltaFlexHigh);
    var HighDelta = document.createElement("a");
    HighDelta.className = "mt-auto inline-block py-1 px-2 rounded-full text-xs text-white center-items cursor-pointer";
    if (newHigh-lastHigh > 0) {
        HighDelta.innerHTML = "+" + (newHigh-lastHigh).toString();
        HighDelta.className = HighDelta.className + " bg-green-500"
    } else {
        HighDelta.innerHTML = (newHigh-lastHigh).toString();
        HighDelta.className = HighDelta.className + " bg-red-500"
    }
    DeltaFlexHigh.appendChild(HighDelta);

    // Low

    // Container
    var LowContainer = document.createElement("div");
    LowContainer.className = "col-span-2 bg-dark_lighter flex flex-col p-5 rounded-xl";
    document.getElementById("DashboardWidgets").appendChild(LowContainer);
    // Header
    var LowHeader = document.createElement("div");
    LowHeader.className = "relative flex flex-row";
    LowContainer.appendChild(LowHeader);
    // Type
    var LowType = document.createElement("div");
    LowType.className = "text-white font-medium";
    LowType.innerHTML = "Low";
    LowHeader.appendChild(LowType);
    // Price
    var LowTitle = document.createElement("div");
    LowTitle.className = "text-center text-2xl text-white font-semibold mt-3 mb-3";
    LowTitle.innerHTML = "$" + newLow.toString();
    LowContainer.appendChild(LowTitle);
    // Delta
    var DeltaFlexLow = document.createElement("div");
    DeltaFlexLow.className = "flex  items-center justify-center";
    LowContainer.appendChild(DeltaFlexLow);
    var LowDelta = document.createElement("a");
    LowDelta.className = "mt-auto inline-block py-1 px-2 rounded-full text-xs text-white cursor-pointer";
    if (newLow-lastLow > 0) {
        LowDelta.innerHTML = "+" + (newLow-lastLow).toString();
        LowDelta.className = LowDelta.className + " bg-green-500"
    } else {
        LowDelta.innerHTML = (newLow-lastLow).toString();
        LowDelta.className = LowDelta.className + " bg-red-500"
    }
    DeltaFlexLow.appendChild(LowDelta);
}



signOut(auth).then(() => {

}).catch((error) => {

});





































// if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {








//     var url = "http://localhost:9090/api/ChuckNorris";
//     const result = await $.ajax({type:"GET", url:url, data:"", dataType: "json"});
//     console.log(result.value);





//     console.log("Local");
// } else {
//     const ChuckNorris = httpsCallable(functions, "ISS");
//     ChuckNorris().then((result) => {
//         console.log("result");
//     }).catch((error) => {
//         console.log(error);
//     });
// }