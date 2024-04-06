import React, { useEffect } from 'react'
import Navbar from './NavBar';
//import jwtDecode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
export default function MenuPage(props) {
  useEffect(() => {
    //Runs only on the first render
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded token user:', decodedToken);
      // Check expiration (decodedToken.exp) or other claims
    }
  }, []);
    const USER = props.USER;
    const logout = async(event)=>{
      event.preventDefault();
      localStorage.removeItem('jwtToken');
      const navigate = useNavigate();
      navigate('/')
    }
  return (
    <div>
      <Navbar/>
        Menu Page
        
    </div>
  )
}
