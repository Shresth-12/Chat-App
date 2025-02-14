import { useState, useEffect } from "react";
import { NavBar } from "../components/NavBar";
import Sidebar from "../components/SideBar";
import NoChatSelected from "../components/NoChatContainer";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function Home() {
  const [selectedUser, setSelectedUser] = useState(null);
 const[authId,setAuthId]=useState("")
 const[authpic,setAuthpic]=useState("")
  const userId = localStorage.getItem("userid");
  const token=localStorage.getItem('token')
  const navigate = useNavigate();
  if (selectedUser) {
    console.log(selectedUser.fullName);
  }

  const getUserInfo = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/getuserinfo", { userId });
      setAuthId(response.data.id)
      setAuthpic(response.data.image)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [userId]);
  

  useEffect(()=>{
    if(!token)
    {navigate('/signin')}
  },[])


  return (
    <div>
      <NavBar />
      <div className="text-black">
      </div>
      <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar onSelectUser={setSelectedUser} />
              {!selectedUser ? (
                <NoChatSelected />
              ) : (
                <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} authId={authId} authpic={authpic} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
