import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import Connexion from "./Pages/Connexion";
import Chat from "./Pages/Chat";
import { socket } from "./Service/Socket";
import Channel from "./Pages/Channel";

function App() {
  const [isConnected, setConnected] = useState(false);
  const [Page, setPage] = useState("Chat");
  const [Submit, setSubmit] = useState("Connexion");
  const [Alternative, setAlternative] = useState("Inscription");
  const [Banner, setBanner] = useState("");
  const [User, setUser] = useState({});
  const [Conserv, setConserv] = useState({});
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(Submit == "Connexion" ? "http://localhost:5000/api/auth/signin" : "http://localhost:5000/api/auth/register", Submit == "Connexion" ? { nickname: event.target.getElementsByTagName("input")[0].value, password: event.target.getElementsByTagName("input")[1].value } : { nickname: event.target.getElementsByTagName("input")[0].value, password: event.target.getElementsByTagName("input")[1].value }).then((result) => {
      if (result.data.status == "success") {
        setConnected(true);
        setUser({ nickname: result.data.message.nickname, socket: socket.id, avatar: result.data.message.avatar, uid: result.data.message.uid });
        setConserv({ nickname: result.data.message.nickname, socket: socket.id, avatar: result.data.message.avatar, uid: result.data.message.uid, messages: result.data.message.lastMessages != undefined ? Object.entries(result.data.message.lastMessages).reduce((accumulator, currentValue) => Object.assign(accumulator, { [currentValue[1].nickname]: { avatar: currentValue[1].avatar, uid: currentValue[0], message: currentValue[1].message } }), {}) : {} });
        socket.emit("Database", { nickname: result.data.message.nickname, socket: socket.id, avatar: result.data.message.avatar, uid: result.data.message.uid, messages: result.data.message.lastMessages != undefined ? Object.entries(result.data.message.lastMessages).reduce((accumulator, currentValue) => Object.assign(accumulator, { [currentValue[1].nickname]: { avatar: currentValue[1].avatar, uid: currentValue[0], message: currentValue[1].message } }), {}) : {} });
        socket.emit("Users", { [result.data.message.nickname]: { socket: socket.id, avatar: result.data.message.avatar, uid: result.data.message.uid } });
      } else {
        setBanner(result.data.message);
      }
    });
  }
  const handleAlternative = (event) => {
    setSubmit(Submit == "Connexion" ? "Inscription" : "Connexion");
    setAlternative(Alternative == "Connexion" ? "Inscription" : "Connexion");
  }
  const handleChannels = (event) => {
    setPage("Channel");
    socket.emit("Channel", { socket: socket.id });
    socket.emit("User", { nickname: User.nickname, socket: socket.id, avatar: User.avatar, uid: User.uid });
  }
  const handleChat = (event) => {
    setPage("Chat");
    socket.emit("Database", Conserv);
    socket.emit("Users", { [User.nickname]: { socket: socket.id, avatar: User.avatar, uid: User.uid } });
  }
  const anonymous = (event) => {
    axios.post("http://localhost:5000/api/auth/registerAnonymous", {}).then((result) => {
      if (result.data.status == "success") {
        setConnected(true);
        setUser({ nickname: result.data.message.nickname, socket: socket.id, avatar: result.data.message.avatar, uid: result.data.message.uid });
        setConserv({ nickname: result.data.message.nickname, socket: socket.id, avatar: result.data.message.avatar, uid: result.data.message.uid, messages: result.data.message.lastMessages != undefined ? Object.entries(result.data.message.lastMessages).reduce((accumulator, currentValue) => Object.assign(accumulator, { [currentValue[1].nickname]: { avatar: currentValue[1].avatar, uid: currentValue[0], message: currentValue[1].message } }), {}) : {} });
        socket.emit("Database", { nickname: result.data.message.nickname, socket: socket.id, avatar: result.data.message.avatar, uid: result.data.message.uid, messages: result.data.message.lastMessages != undefined ? Object.entries(result.data.message.lastMessages).reduce((accumulator, currentValue) => Object.assign(accumulator, { [currentValue[1].nickname]: { avatar: currentValue[1].avatar, uid: currentValue[0], message: currentValue[1].message } }), {}) : {} });
        socket.emit("Users", { [result.data.message.nickname]: { socket: socket.id, avatar: result.data.message.avatar, uid: result.data.message.uid } });
      } else {
        setBanner(result.data.message);
      }
    });
  }
  return (
    <>
      {
        isConnected ? Page == "Chat" ? <Chat handleChannels={handleChannels} /> : <Channel privateMessage={handleChat}/> : <Connexion handleSubmit={handleSubmit} submitButton={Submit} alternativeButton={Alternative == "Inscription" ? "S'inscrire" : "Se connecter"} handleAlternative={handleAlternative} Banner={Banner} anonymous={anonymous} />
      }
    </>
  );
}

export default App;