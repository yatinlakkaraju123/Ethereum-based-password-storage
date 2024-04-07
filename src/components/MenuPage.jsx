import React, { useEffect } from 'react'
import Navbar from './NavBar';
//import jwtDecode from 'jwt-decode';
import WalletConnect from './WalletConnect';
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
export default function MenuPage() {
  useEffect(() => {
    //Runs only on the first render
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded token user:', decodedToken);
      // Check expiration (decodedToken.exp) or other claims
    }
  }, []);
    
    const logout = async(event)=>{
      event.preventDefault();
      localStorage.removeItem('jwtToken');
      const navigate = useNavigate();
      navigate('/')
    }
  return (
    <div>
      <Navbar/>
        <WalletConnect/>
        
    </div>
  )
}
