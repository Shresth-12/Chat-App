import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { useEffect,useState} from "react";
import { Signin } from "./pages/Signin";
import { Home } from "./pages/Home";
import { Signup } from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import { SocketProvider } from "./context/SocketProvider";
function App() {
  return <div>
      <SocketProvider>
   <Toaster position="top-right" reverseOrder={false} />
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/signin" element={<Signin/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/profile" element={<Profile/>} />
    </Routes>
    </BrowserRouter>
    </SocketProvider>
  </div>

}

export default App
