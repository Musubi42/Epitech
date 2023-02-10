import React, { useState, useEffect } from "react";
import "../index.css";
import SingleChat from "../Components/SingleChat";
import MessageIn from "../Components/MessageIn";
import MessageOut from "../Components/MessageOut";
import { socket } from "../Service/Socket";
import axios from "axios";
import { Socket } from "socket.io-client";
import GroupChat from "../Components/GroupChat";
import InfoChat from "../Components/InfoChat";

export default function Channel(props) {
    const [Channels, setChannels] = useState({});
    const [Current, setCurrent] = useState({});
    const [User, setUser] = useState({});
    const [New, setNew] = useState(false);
    socket.on("Channel", (data) => {
        setChannels(data.reduce((accumulator, value) => Object.assign(accumulator, { [value._id]: { avatar: value.avatar, message: value.message, name: value.name } }), {}));
    });
    socket.on("User", (data) => {
        setUser(data);
    });
    socket.on("ChannelMessage", (data) => {
        if (Current._id == data.id) {
            var Update = { ...Current };
            Update.messages = Update.messages.concat([data.message]);
            if (data.message.type == "notification") {
                Update.users = { ...Update.users, ...{ [data.uid]: { nickname: data.nickname, avatar: data.avatar } } }
            } else {
                console.log(data);
            }
            setCurrent(Update);
        }
    });
    const handleClick = (data) => {
        axios.post("http://localhost:5000/api/channel/allMessages", { id: data }).then((result) => {
            setCurrent(result.data);
            socket.emit("ChannelMessage", { id: data, uid: User.uid, nickname: User.nickname, avatar: User.avatar, type: "join" });
        });
    }
    const addNew = (data) => {
        if (New) {
            setNew(false);
        } else {
            setNew(true);
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (Current != {}) {
            socket.emit("ChannelMessage", { id: Current._id, uid: User.uid, type: "message", message: event.target.getElementsByTagName("input")[0].value });
        }
    }
    const createSubmit = (event) => {
        event.preventDefault();
        setNew(false);
        socket.emit("ChannelCreate", { name: event.target.getElementsByTagName("input")[0].value, uid: User.uid, avatar: User.avatar, nickname: User.nickname });
    }
    socket.on("ChannelCreate", (data) => {
        var Update = {...Channels, ...{[data.data.data._id]: {avatar: data.data.data.avatar, name: data.data.data.name, message: data.data.data.messages[0]}}};
        setChannels(Update);
    });
    return (
        <div className="bg-white overflow-hidden flex-1 flex text-black">
            <div className="h-full w-16 bg-white flex flex-col border-r p-2">
                <div className="justify-center flex aspect-square rounded-md items-center hover:bg-gray-100 cursor-pointer" onClick={props.privateMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-7 text-gray-400" fill="currentColor"><path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z" /></svg>
                </div>
                <div className="justify-center flex aspect-square rounded-md items-center bg-gray-100 mt-2 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-7 text-black" fill="currentColor"><path d="M352 128c0 70.7-57.3 128-128 128s-128-57.3-128-128S153.3 0 224 0s128 57.3 128 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" /></svg>
                </div>
            </div>
            <div className="h-full w-1/4 bg-white flex flex-col border-r p-4 relative">
                <div className="text-2xl font-semibold flex">Groups
                    <div className="h-full aspect-square bg-gray-100 ml-auto rounded-full flex justify-center items-center cursor-pointer" onClick={addNew}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-3 text-black" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
                    </div>
                    {
                        New &&
                        <div className="absolute w-44 p-2 bg-gray-100 right-3 top-14 rounded-lg z-40">
                            <form className="flex flex-col" onSubmit={createSubmit}>
                                <input className="bg-gray-50 border text-xs rounded-lg block flex-auto p-2.5" placeholder="Nom" required />
                            </form>
                        </div>
                    }
                </div>
                {
                    Object.entries(Channels).map((value) => {
                        return (
                            <GroupChat name={value[1].name} avatar={value[1].avatar} handleClick={() => handleClick(value[0])} />
                        )
                    })
                }
            </div>
            <div className="h-full bg-white flex flex-col border-r flex-auto p-4">
                <div className="text-2xl font-normal"></div>
                <div className="flex-auto mt-4 flex flex-col-reverse overflow-auto scrollbar-hide">
                    {
                        Current.messages != undefined &&
                        Current.messages.slice(0).reverse().map((value) => {
                            return (
                                value.type == "message" ? value.uid == User.uid ? <MessageOut avatarURL={User.avatar} message={value.message} /> : <MessageIn avatarURL={Current.users[value.uid].avatar} message={value.message} /> : <InfoChat message={value.message} />
                            )
                        })
                    }
                </div>
                <form className="flex mt-4" onSubmit={handleSubmit}>
                    <input className="bg-gray-100 border text-sm rounded-lg block flex-auto p-2.5" placeholder="Entrez votre message ..." required />
                    <button type="submit" className="text-gray-400 font-medium rounded-lg text-sm text-center bg-gray-100 p-2.5 ml-2">Envoyer</button>
                </form>
            </div>
        </div>
    );
}