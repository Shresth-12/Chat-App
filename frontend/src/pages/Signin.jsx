import { useState,useEffect } from "react";
import AuthImagePattern from "../components/AuthImage";
import { MessageSquare, User, Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { useSocket } from "../context/SocketProvider";

export function Signin() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ShowPassword, setShowPassword] = useState(false);
  const[loading,setLoading]=useState(false)
  const navigate = useNavigate();
  const { socket,connectSocket } = useSocket();

  useEffect(() => {
    if (socket && !socket.connected) {
      connectSocket();
    }
  }, [socket]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (Email.trim() === "") return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(Email)) return toast.error("Enter a valid email");
    try{
    setLoading(true)
    const response=await axios.post("http://localhost:3000/api/v1/user/signin",{
      email:Email,
      password:Password,
    })
    localStorage.setItem('token',response.data.token)
    localStorage.setItem('userid',response.data.userId)
    localStorage.setItem('color',"light")
    connectSocket(); 
    setLoading(false)
    toast.success("Login successful!");
    navigate("/")
  }
  catch(error)
  {
    return toast.error("Invalid Input")
    console.log(error)
  }
  }

  return (
    <div>
        <div>
            <NavBar/>
        </div>
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left side */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                  group-hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
              </div>
            </div>

            {/* Signup Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="you@example.com"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={ShowPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••••"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!ShowPassword)}
                  >
                    {!ShowPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              {/* Signup Button */}
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </form>

            {/* Sign-in Link */}
            <div className="text-center">
              <p className="text-base-content/60">
                Don't have an account?{" "}
                <Link to="/signup" className="link link-primary">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <AuthImagePattern
          title="Join our community"
          subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
        />
      </div>
    </div>
  );
}
