import React from "react";
import "../index.css";

export default function InfoChat(props) {
    return (
        <div className="mt-2 text-gray-400 text-center">{props.message}</div>
    );
}