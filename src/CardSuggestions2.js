import React from "react";

export default function CardSuggestions(props) {
    return (
        <div className=" h-2/5 w-2/5 my-10 flex flex-row justify-start items-center" >
            <div className={"h-8/12 w-2/5 flex justify-center items-center"}>
                <img className={"h-full w-full rounded-2xl"} src={props.data.videoInfo.snippet.thumbnails.default.url}></img>
            </div>
            <div className={"h-4/12 w-3/5 flex-col justify-start items-start p-1"}>
                <div>
                    <text className={"font-bold text-xl text-white overflow-hidden"}> {props.data.videoInfo.snippet.title} </text>
                </div>
            </div>
        </div>

    );
}