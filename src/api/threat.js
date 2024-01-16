import axios from "axios";

const api_call = async (Url, params)=>{
    const options = {
        method : 'GET',
        url : Url,
        params : params? params:{}
    }

    try {
       const response = await axios.request(options); 
       return response.data;
    } catch (error) {
        console.log('error: ', error);
        return {}
    }
}

export const fetchThreat = (search)=>{
    return api_call(`https://admiralskazar.pythonanywhere.com/prediction/${search}`)
}