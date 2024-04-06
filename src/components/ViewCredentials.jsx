import React, { useState } from 'react'
import Navbar from './NavBar'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import {ABI,web3,contractAddress} from "../utils/web3"
import { useEffect } from 'react'
import axios from 'axios'

export default function ViewCredentials() {
  const [VID,setVID] = useState(0);
  const [u,setU] = useState("");
  const [cred,setCred] = useState(null)
  useEffect(() => {
    //Runs only on the first render
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded token user:', decodedToken);
      const VID = decodedToken.VaultID;
      const user = decodedToken.user;
      setU(user);
      setVID(VID);
      // Check expiration (decodedToken.exp) or other claims
    }
    else
    {
      const navigate = useNavigate();
      navigate('/')
    }
  }, []);
  const submit = async (e)=>{
    e.preventDefault();
    const contract = new web3.eth.Contract(ABI, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const Names = await contract.methods.getCredentialNames(VID).call();
    let CredArr = []
    for(let i=0;i<Names.length;i++)
    {
      const credUser = await contract.methods.getCredentialsUserName(VID,Names[i]).call();
      const credPass = await contract.methods.getCredentialsPassword(VID,Names[i]).call();
      
      CredArr.push({
        name:Names[i],
        username:credUser,
        password:credPass
      })
      
    }
    console.log(CredArr)
    const Password = await contract.methods.getMasterPassword(u).call();
    axios.post("http://localhost:3007/retrievecredentials",{Credarr:CredArr,masterPassword:Password}).then(result=>{
    console.log(result.data.decryptedPasswords)
    setCred(result.data.decryptedPasswords)
    }).catch(err=>console.log(err));
  }
  return (
    <div>
      <Navbar/>
      
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <button onClick={submit}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Load Credentials
                </button></div>
      </div>
      <div className="grid grid-rows-3 grid-cols-3 gap-4">
    {cred!=null && cred.map((item,index)=>(
        <div class=" max-w-sm p-6 m-10 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        
            <p class="mb-2 text-2xl  tracking-tight text-gray-900 dark:text-white">Name:{item['name']}</p>
            <p class="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">Username:{item['username']}</p>
            <p class="mb-2 text-2xl  tracking-tight text-gray-900 dark:text-white">Password:{item['password']}</p>
        
        
    </div>
))}</div>
     </div>
  )
}
