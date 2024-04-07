import { useState } from "react"
import NavBar from "./NavBar"
import { Link } from "react-router-dom"
import MenuPage from "./MenuPage"
import bcrypt from 'bcryptjs'
import axios from "axios"
import WalletConnect from './WalletConnect';
import { useNavigate } from "react-router-dom";
import {ABI,web3,contractAddress} from "../utils/web3"
export default function VaultSignIn() {
  let navigate = useNavigate();
  const salt = bcrypt.genSaltSync(10)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [mode,setMode] = useState(0)
  const submit = async (event)=>{
    event.preventDefault();
    const contract = new web3.eth.Contract(ABI, contractAddress);
                   // const accounts = await web3.eth.getAccounts();
                   const gotPassword= await contract.methods.getMasterPassword(email).call();
                    const isCorrectEmail = await contract.methods.isUserName(email).call();
                    if(isCorrectEmail)
                    {
                      const vid = await contract.methods.getVaultID(email,gotPassword).call();
                      axios.post("https://ethereum-based-password-storage.onrender.com/checkpassword",{
                        retrievedpassword:gotPassword,formpassword:password,email:email,vaultID:vid
                      }).then(result=>
                        {
                          console.log(result.data.isAuthenticated)
                          
                          if(result.data.isAuthenticated==true)
                          {const token = result.data.token;
                            localStorage.setItem('jwtToken', token);
                           
                            navigate('/LoginHome')
                            navigate(0)
                          }
                          else
                          {
                            alert("wrong credentials")
                          }
                         
                        }).catch(err=>console.log(err))
                    }
                    else
                    {
                      alert("wrong username");
                    }
                  
  }

    return (
     
      <>
        <WalletConnect />
        {mode===0 &&  <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
           
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your Vault
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={submit} >
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={(e)=>setEmail(e.target.value)}
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
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
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
                  Sign in
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <Link to="/register"><a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Register
              </a></Link>
            </p>
          </div>
        </div>}
       
      </>
    )
  }
  
