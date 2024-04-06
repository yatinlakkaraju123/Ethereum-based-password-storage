import React, { useState,useEffect } from 'react'
import NavBar from './NavBar'
import bcrypt from 'bcryptjs'
import axios from 'axios'
import CryptoJS from "crypto-js";
import {ABI,web3,contractAddress} from "../utils/web3"
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
export default function AddCredentials(props) {
  useEffect(() => {
    //Runs only on the first render
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
    
      // Check expiration (decodedToken.exp) or other claims
    }
    else
    {
      const navigate = useNavigate();
      navigate('/')
    }
  }, []);
  const USER = props.USER;
    const [name,setName] = useState("")
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [MasterPassword1,setMasterPassword] = useState("")
    const [encrptedData, setEncrptedData] = useState("");
    const [decrptedData, setDecrptedData] = useState("");
    const [encCredentialPass,setEncCredentialPass] = useState("")
    //const [text, setText] = useState("");
    //const secretPass = "XkhZG4fW2t2W";

  const encryptData = (text) => {
    const data = CryptoJS.AES.encrypt(
      JSON.stringify(text),
      username
    ).toString();

    return data;
  };
  const decryptData = (encrptedData) => {
    const bytes = CryptoJS.AES.decrypt(encrptedData, username);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    setDecrptedData(data);
  };
    const salt = bcrypt.genSaltSync(10)
    const submit = async(event)=>{
        event.preventDefault();
        console.log("name:",name);
        console.log("username:",username);
        console.log("password:",password);
        //setText(password)
        console.log("password encrypted:")
        const a = encryptData(password)
        console.log("A:",a)
        setEncrptedData(a)
        const contract = new web3.eth.Contract(ABI, contractAddress);
        const accounts = await web3.eth.getAccounts();
        
        //const MasterPassword = ""
        try
        { const token = localStorage.getItem('jwtToken');
        const decodedToken = jwtDecode(token);
          const user = decodedToken.user
          setUsername(user)
          const isUserCorrect = await contract.methods.isUserName(user).call();
          console.log(isUserCorrect)
          if(isUserCorrect)
          {
            const MasterPassword = await contract.methods.getMasterPassword(user).call();
            setMasterPassword(MasterPassword)
            console.log("credentialPassword:",a)
            console.log("secretKey:",username)
            console.log("masterpassword:",MasterPassword)
            
           axios.post("http://localhost:3007/addcredentials",{credentialPassword:a,secretKey:username,masterpassword:MasterPassword}).then(async (result)=>{
              const EncPassword = result.data.encryptedCredentialPassword;
             
              setEncCredentialPass(EncPassword)
              const VID = decodedToken.VaultID;
            console.log("VID:"+VID+"name:"+name+"username:"+username+"enc pass:"+EncPassword)
            await contract.methods.addCredentials(VID,name,username,EncPassword).send({from:accounts[0]});
              //const VID = await contract.methods.getVaultID(USER,MasterPassword1).call();
              //await contract.methods.
            }).catch(err=>console.log(err));
            
          }
          else
          {
            alert("incorrect username")
          }
        }catch(error)
        {
          console.log(error);
        }      
      
        
        


    }
  return (
    <div>
       <NavBar/>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Add credentials
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={submit} >
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                 Name
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    onChange={(e)=>setName(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                 User name
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    onChange={(e)=>setUsername(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                 
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add
                </button>
              </div>
            </form>
  
            
          </div>
        </div>
    </div>
  )
}
