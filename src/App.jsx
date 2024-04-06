
import { Routes, Route } from "react-router-dom"
import VaultSignIn from "./components/VaultSignIn"
import VaultRegister from "./components/VaultRegister"
import MenuPage from "./components/MenuPage"
import AddCredentials from "./components/AddCredentials"
import ViewCredentials from "./components/ViewCredentials"
import R from "./components/r"
function App() {

  
 

  return (
    <>
    <Routes>
      <Route path="/" element={<VaultSignIn/>}/>
      <Route path="/register" element={<VaultRegister/>}/>
      <Route path="/LoginHome" element={<MenuPage/>}/>
      <Route path="/LoginHome/AddCredentials" element={<AddCredentials/>}/>
      <Route path="/LoginHome/ViewCredentials" element={<ViewCredentials/>}/>
      <Route path="/r" element={<R/>}/>
    </Routes>
   
    </>
  )
}

export default App
