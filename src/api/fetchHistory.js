import axios from "axios";

const api_call = async (Url, params)=>{
    const options = {
        method : 'GET',
        url : Url,
        params : params? params:{}
    }

    try {
       const response = await axios.request(options); 
       return response.data.results;
    } catch (error) {
        console.log('error: ', error);
        return {}
    }
}

export const fetchHistory = (username)=>{
    return api_call(`http://localhost:3060/history?username=${username}`)
}