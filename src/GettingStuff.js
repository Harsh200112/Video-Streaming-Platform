import React, { useState, useEffect } from "react";
import HomePage from "./HomePage";

export default function GettingStuff() {
    const [videos, setVideos] = useState([]);
    const [flag, setFlag] = useState(false);

    const getVideos = async () => {
        try {
            let imageURLs = [];
            for (let i = 0; i < 10; i++) {
                const res = await fetch('https://random.imagecdn.app/500/150');
                const imageBlob = await res.blob();
                imageURLs[i] = URL.createObjectURL(imageBlob);
            }
            setVideos(imageURLs);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    useEffect(() => {
        // Use an IIFE (Immediately Invoked Function Expression) to call async function
        (async () => {
            await getVideos();
            setFlag(videos.length>=10);
        })();
    }, [videos]); // Empty dependency array means this effect runs once after the initial render

    useEffect(() => {
        console.log("Videos in state:", videos);
    }, [videos]);

    return (
        <div>
          <HomePage  />
        </div>
    );
}
