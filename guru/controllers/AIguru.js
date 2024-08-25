import { ip } from "../datastore/data";

export const aiguru=(question)=>{
    return new Promise(async(r,rj)=>{
       let response= await fetch(`http://${ip}:3000/api/aiguru/chat`,{
        method:"POST",
        body:JSON.stringify({question}),
        headers:{
            'content-type':'application/json'
        }
       });
       response=await response.json();
       console.log(response);
       r(response.response);
    })
}