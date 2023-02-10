import React from "react";
import "../index.css";

export default function GroupChat(props) {
    return (
        <div className="mt-3 p-2 flex hover:bg-gray-100 rounded-lg cursor-pointer" onClick={props.handleClick}>
            <div className="relative flex">
                <img className="rounded-full w-12 h-12 bg-gray-200" src={props.avatar}></img>
                <div className="rounded-full w-12 h-12 bg-gray-200 -translate-x-1/3 flex items-center justify-center text-gray-500"></div>
            </div>
            <div className="flex-auto flex flex-col">
                <div className="font-medium">{props.name}</div>
                <div className="font-light mt-auto text-gray-400"></div>
            </div>
        </div>
    );
}