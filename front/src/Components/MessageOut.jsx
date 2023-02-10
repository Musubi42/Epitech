import React from "react";
import "../index.css";

export default function MessageOut(props) {
    return (
        <div className="flex mt-2">
            <div className="w-2/3 ml-auto">
                <div className="bg-[#0695FF] p-3 rounded-2xl text-white mr-2 font-light text-right w-fit ml-auto">{props.message}</div>
            </div>
            <div className="flex flex-col">
                <img className="rounded-full w-6 h-6 bg-gray-200 mt-auto" src={props.avatarURL}></img>
            </div>
        </div>
    );
}