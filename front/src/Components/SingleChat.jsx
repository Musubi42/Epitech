import React from "react";
import "../index.css";

export default function SingleChat(props) {
    return (
        <div className="mt-3 p-2 flex hover:bg-gray-100 rounded-lg cursor-pointer" onClick={props.handleClick}>
            <div className="relative">
                <img className="rounded-full w-12 h-12 bg-gray-200" src={props.avatar}></img>
                {
                    props.isConnected ? <div className="bg-green-500 h-3 w-3 absolute rounded-full border-2 border-white right-0 bottom-1"></div> : <div className="bg-red-500 h-3 w-3 absolute rounded-full border-2 border-white right-0 bottom-1"></div>
                }
            </div>
            <div className="ml-2 flex flex-col overflow-x-auto flex-auto">
                <div className="font-medium truncate whitespace-nowrap">{props.nickname}</div>
                <div className="font-light mt-auto text-gray-400 truncate whitespace-nowrap">{props.message}</div>
            </div>
        </div>
    );
}