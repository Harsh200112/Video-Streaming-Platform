import axios from "axios";

const api_call = async (Url, params)=>{
    const options = {
        method : 'GET',
        url : Url,
        params : params? params:{}
    }

    try {
       const response = await axios.request(options); 
       return response.data.comments;
    } catch (error) {
        console.log('error: ', error);
        return {}
    }
}

export const fetchComments = (videoid)=>{
    return api_call(`http://localhost:3070/get-comments?q=${videoid}`)
}