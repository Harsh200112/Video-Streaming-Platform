import React, {useEffect} from "react";
import {useState} from "react";
import CardSuggestions from "./CardSuggestions";
import { fetchVideoIds } from "./api/search";
import { fetchVideoDetails } from "./api/VideoDetails";
import { fetchRecommendedVideos } from "./api/Recommend";
import  History  from "./History"
import {fetchHistory} from "./api/fetchHistory"
import { fetchComments } from "./api/fetchComments";
import { fetchThreat } from "./api/threat";


export default function HomePage(username) {
    const [inputText, setInputText] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [text, setText] = useState("Search Results");
    const [historyvideoIds, setHistoryVideoIds] = useState('');
    const [videoDetails, setVideoDetails] = useState([]);
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);
    const [channelTitle, setChannelTitle] = useState("");   
    const [historyCLicked, setHistoryClicked] = useState(false);
    const [history, setHistory] = useState([]);
    const [comment, setComment] = useState('');
    const [currentData, setCurrentData] = useState({});
    const [comments, setComments] = useState({});

    const handleChange = (event) => {
        var inputValue = event.target.value;
        setInputText(inputValue);
    };

    const sendInput = async () => {
        setHistoryClicked(false);

        const threat = await fetchThreat(inputText);
        console.log(threat);

        let count = 0;

        for (const char of threat) {
            if (char === '1') {
                count++;
            }
        }
        console.log(count)

        if (count>=1){
            setVideoDetails([]);
            alert("Safe Search is Enabled!!");
        }
        else{
            const data = await fetchVideoIds(inputText);
            // console.log(inputText);
            // console.log(data);
            setVideoDetails(data);
            setText("Search Results");
            // console.log(videoIds);
            // console.log(videoDetails);
            console.log(inputText, "text received");
        }
        
        
    };

    const post = async (video_id) =>{
        const name = username.data;
        try {
            const response = await fetch('http://localhost:3060/insert-url', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username:name, url:video_id }),
            });

            console.log(video_id);

            const data = await response.json();

            console.log(data)
      
            if (response.ok) {
              console.log('data inserted:', data);
            } else {
              console.error('Insertion failed:', data);
            }
          } catch (error) {
            console.error('Error during insertion:', error);
          }
    }

    const viewHistory = async () =>{
        setHistoryClicked(true);
        const data = await fetchHistory(username.data);
        const details = await fetchVideoDetails(data);
        setHistory(details);
    }

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
      

    const handleClick = async (data)=>{
        console.log("Current Video", data.videoInfo.id);
        setVideoUrl(`https://www.youtube.com/embed/${data.videoInfo.id}`);
        setVideoTitle(data.videoInfo.snippet.title);
        setVideoDescription(data.videoInfo.snippet.description);
        setDislikes(parseInt(data.videoInfo.statistics.dislikeCount))
        setLikes(parseInt(data.videoInfo.statistics.likeCount));
        setChannelTitle(data.videoInfo.snippet.channelTitle);

        setCurrentData(data);

        const c = await fetchComments(data.videoInfo.id);
        setComments(c);
        console.log("comments", c);
        
        setHistoryVideoIds(data.videoInfo.id);
        // console.log(historyvideoIds);
        post(historyvideoIds);

        const Recommendations = await fetchRecommendedVideos(data.videoInfo.snippet.categoryId)
        shuffle(Recommendations);
        console.log("recommended", Recommendations);
        const videodata = await fetchVideoDetails(Recommendations);

        setVideoDetails(videodata);
        setText("Recommendations");
    };

    const viewMainPage = () =>{
        setHistoryClicked(false);
    }

    const viewUser = () =>{
        alert(`Current User : ${username.data}`)
    }

    const handleCommentChange = (event)=>{
        setComment(event.target.value);
    }

    const postComment = async (e)=>{
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3070/add-comment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ videoId:currentData.videoInfo.id, username:username.data, comment:comment }),
            });

            console.log(JSON.stringify({ videoId:currentData.videoInfo.id, username:username.data, comment:comment }));

            const data = await response.json();

            console.log(data)
      
            if (response.ok) {
              console.log('data inserted:', data);
              const c = await fetchComments(currentData.videoInfo.id);
              setComments(c);
            } else {
              console.error('Insertion failed:', data);
            }
          } catch (error) {
            console.error('Error during insertion:', error);
          }
    }

    const Liked = () => {
        setLikes(Likes + 1);  
    }

    const Disliked = () =>{
        setDislikes(Dislikes + 1);
    }

        return (
            <div className={"h-screen w-screen justify-evenly flex-col overflow-auto"}>
                <div className={"h-auto w-full flex flex-row bg-gray-800 justify-center items-center p-6"}>
                    <button className="font-extrabold text-white text-3xl" onClick={viewMainPage}>ViewVault</button>
                    <div className="w-full flex flex-1  justify-center">
                        <input onChange={handleChange} id={"523"} value={inputText} placeholder="Type to Search..." className={"h-12 border-none w-4/12 rounded-s-3xl p-4"  }></input>
                        <button onClick={sendInput} className={"h-12 border-4 border-none w-1/12 rounded-e-3xl text-center text-white bg-black  font-bold shadow-md shadow-slate-700"}>Search</button>
                    </div>
                    <button className="mx-4" onClick={viewHistory}>
                        <img width="45" height="45" src="https://img.icons8.com/ios-filled/50/FFFFFF/time-machine.png" alt="time-machine"/> 
                    </button>
                    <button className="mx-2" onClick={viewUser}>
                        <img width="55" height="55" src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/64/FFFFFF/external-user-interface-kiranshastry-solid-kiranshastry.png" alt="external-user-interface-kiranshastry-solid-kiranshastry"/>
                    </button>
                </div>
                {
                historyCLicked ? (
                    <History data = {history}/>
                ):(
                    <div className={"h-full flex bg-gray-700 justify-evenly p-12"}>
                    <div className={"h-full w-8/12 flex flex-col"}>
                        <iframe className={"h-full w-full rounded-2xl shadow-2xl shadow-slate-400"} src={videoUrl}
                                allowFullScreen></iframe>
                        <br/>
                        <text className={"font-bold w-full text-white text-2xl  my-4 px-2 overflow-visible"}>{videoTitle}</text>
                        <div className="w-full flex flex-row items-stretch mx-2">
                            <text className="basis-2/3 font-bold text-white text-2xl self-start">{channelTitle}</text>
                            <button  className="basis-1/6 h-9 w-auto rounded-xl bg-slate-300 font-bold mx-2 p-2 self-end" onClick={Liked}>Like {Likes}</button>
                            <button  className="basis-1/6 h-9 w-auto rounded-xl bg-slate-300 font-bold p-2 self-end" onClick={Disliked}>Dislike {Dislikes}</button>
                        </div>
                        <text className="font-bold w-full text-white text-xl py-1 px-2 my-2">Description</text>
                        <text className="font-bold w-full text-white text-l  px-2 ">{videoDescription}</text>
                        
                    </div>
                    <div className={"h-3/4 w-3/12 bg-gray-800 rounded-2xl flex-col justify-start overflow-auto p-2"} value="Search Results">
                        <text className="font-bold text-xl text-white p-4">{text}</text>
                        {
                            videoDetails.length>0?(
                            videoDetails.map((item, index)=>{
                                return(
                                    <CardSuggestions key={index} data={item} onClick={handleClick}/>
                                )
                            })
                            ):(
                                <div/>
                            )
                        }
                    </div>
                </div>
                )}
                <div className="bg-slate-700 ">
                    <div className="bg-slate-700 w-3/4 mx-24">
                    <text className="font-bold  text-white text-xl  px-2 my-4">Comments</text>
                    <form>
                        <input type="text" value={comment} onChange={handleCommentChange} className="w-4/5 h-20 my-2 mx-2 rounded-2xl"></input>
                        <button className="bg-white h-10 w-20 mx-2 rounded-2xl" onClick={postComment}>Post</button>
                    </form>
                    <div>
                        {
                            Object.keys(comments).length>0?(
                                comments.map((item, index)=>{
                                    return (
                                        <div className="bg-white rounded-xl p-1 my-1 w-1/4 mx-2 flex flex-col" key={index}>
                                            <text className="font-bold">{item.username}</text>
                                            <text>{item.comment}</text>
                                        </div>
                                    )
                                })
                            ):(
                                <div />
                            )
                        }
                    </div>
                    </div>
                </div>
            </div>
        );

}