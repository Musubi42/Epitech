import React, { useState, useEffect } from "react";
import "../index.css";
import Image from "../Assets/Connexion.png"
import ErrorBanner from "../Components/ErrorBanner";

export default function Connexion(props) {
    return (
        <div className="flex-1 flex flex-col p-10 overflow-hidden">
            <div className="h-1/6 relative">

            </div>
            <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0695FF] via-[#A334FA] to-[#FF6968] mr-auto">Discuter sur</div>
            <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0695FF] via-[#A334FA] to-[#FF6968] mr-auto">Minichat</div>
            <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0695FF] via-[#A334FA] to-[#FF6968] mr-auto">partout et à tout</div>
            <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0695FF] via-[#A334FA] to-[#FF6968] mr-auto">moment</div>
            <div className="flex-auto mt-10">
                <form onSubmit={props.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-400">Identifiant</label>
                        <input type="text" className="bg-gray-100 border text-sm rounded-lg block w-1/3 p-2.5" placeholder="Nom d'utilisateur" />
                    </div>
                    <div className="mb-10">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-400">Mot de passe</label>
                        <input type="password" className="bg-gray-100 border text-sm rounded-lg block w-1/3 p-2.5" placeholder="••••••••••••••••" />
                    </div>
                    <div className="flex">
                        <button type="submit" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#0695FF]">{props.submitButton}</button>
                        <button type="button" className="text-[#0695FF] font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-white" onClick={props.handleAlternative}>{props.alternativeButton}</button>
                        <button type="button" className="text-[#0695FF] font-medium rounded-lg text-sm py-2.5 text-center bg-white" onClick={props.anonymous}>Anonyme</button>
                    </div>
                </form>
            </div>
            <div className="right-10 h-full absolute flex flex-col items-center justify-center">
                <img src={Image} className="h-5/6" />
            </div>
            {
                props.Banner != "" &&
                <ErrorBanner message={props.Banner} />
            }
        </div>
    );
}