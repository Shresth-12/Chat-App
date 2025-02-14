import { useEffect, useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import { NavBar } from "../components/NavBar";
import axios from "axios";
import pimage from "../assets/avatar.png";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [created, setCreated] = useState("");
  const [userImage, setUserImage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid");
  const token=localStorage.getItem('token')

  useEffect(()=>{
    if(!token)
    {navigate('/signin')}
  },[])

  // Function to compress image before upload
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Resize image to max 300px width
          canvas.width = 300;
          canvas.height = (img.height / img.width) * 300;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7)); // 70% quality
        };
      };
    });
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const compressedImage = await compressImage(file);
    setSelectedImg(compressedImage);

    try {
      const response = await axios.put(
        "https://chat-app-backend-tlqu.onrender.com/api/v1/user/update-profile",
        { profilepic: compressedImage },
        { headers: { "Authorization": `Bearer ${token}`,"Content-Type": "application/json" } }
      );

      setUserImage(response.data.profilePic); // Update profile picture
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Fetch user info
  const getUserInfo = async () => {
    try {
      const response = await axios.post("https://chat-app-backend-tlqu.onrender.com/api/v1/user/getuserinfo", { userId });
      setEmail(response.data.email);
      setName(response.data.name);
      setCreated(new Date(response.data.time).toLocaleDateString());
      setUserImage(response.data.image);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [userId]);

  return (
    <div className="h-screen pt-20">
      <NavBar />
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || userImage || pimage}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">Click the camera icon to update your photo</p>
          </div>

          {/* User Details */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{name}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{email}</p>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{created}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
