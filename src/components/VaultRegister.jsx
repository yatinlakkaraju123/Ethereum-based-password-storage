import { useState } from "react"
import bcrypt from 'bcryptjs'
import axios from "axios"
import NavBar from "./NavBar"
import {ABI,web3,contractAddress} from "../utils/web3"
import WalletConnect from "./WalletConnect"
import { Link } from "react-router-dom"
export default function VaultRegister() {
    const salt = bcrypt.genSaltSync(10)
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmpassword,setConfirmPassword] = useState("")
    const [encPass,setEncPass] = useState("")
    const submit = (event)=>{
        event.preventDefault();
        if(password!=confirmpassword)
        {
            alert("password and confirm password not matched");
        }
        else
        {
            
            const hashedPassword = bcrypt.hashSync(password, salt);
            //console.log(hashedPassword);
            axios.post("https://ethereum-based-password-storage.onrender.com/password",{
                hashedPassword:hashedPassword,email:email})
            .then(async result=>
                {   const encpass = result.data.encryptedPassword
                    const contract = new web3.eth.Contract(ABI, contractAddress);
                    const accounts = await web3.eth.getAccounts();
                    const usernames = await contract.methods.getAllVaultUsernames().call();
                    if(usernames.includes(email))
                    {
                        alert("email already exists");
                    }
                    else
                    {
                       
                        await contract.methods.createNewUser(email,encpass).send({from:accounts[0]});
                    }
                    
                    

                })
            .catch(err=>console.log(err))
          
        }
    }

    return (
        <>
            <WalletConnect/>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Register
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={submit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={(e)=>setEmail(e.target.value)}
                                    autoComplete="email"
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
                                    onChange={(e)=>setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                  Confirm  Password
                                </label>
                                
                            </div>
                            <div className="mt-2">
                                <input
                                    id="confirmpassword"
                                    name="confirmpassword"
                                    type="password"
                                    onChange={(e)=>setConfirmPassword(e.target.value)}
                                    autoComplete="current-password"
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
                                Register
                            </button>
                        </div>
                    </form>
                    <p className="mt-10 text-center text-sm text-gray-500">
              Already a member?{' '}
              <Link to="/"><a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Sign In
              </a></Link>
            </p>
                  
                </div>
            </div>
        </>
    )
}