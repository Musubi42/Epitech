import React from "react";
import "../index.css";

export default function MessageIn(props) {
    return (
        <div className="flex mt-2">
            <div className="flex flex-col">
                <img className="rounded-full w-6 h-6 bg-gray-200 mt-auto" src={props.avatarURL}></img>
            </div>
            <div className="w-2/3 mr-auto">
                <div className="bg-gray-200 ml-2 p-3 rounded-2xl font-light w-fit">{props.message}</div>
            </div>
        </div>
    );
}