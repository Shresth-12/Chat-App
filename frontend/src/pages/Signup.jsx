import { useState, useEffect } from "react";
import AuthImagePattern from "../components/AuthImage";
import { MessageSquare, User, Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { useSocket } from "../context/SocketProvider";

export function Signup() {
  const [fullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ShowPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { socket, connectSocket } = useSocket();

  useEffect(() => {
    // Ensure socket connects only if it's not already connected
    if (!socket) {
      connectSocket();
    }
  }, [socket, connectSocket]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (fullName.trim() === "") return toast.error("Full Name is required");
    if (Email.trim() === "") return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(Email)) return toast.error("Enter a valid email");
    if (Password.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      setLoading(true);
      const response = await axios.post("https://chat-app-backend-tlqu.onrender.com/api/v1/user/signup", {
        email: Email,
        password: Password,
        fullName: fullName,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userid", response.data.userId);
      localStorage.setItem("color", "light");

      // Ensure socket is connected only once
      if (!socket) {
        connectSocket();
      }

      setLoading(false);
      toast.success("Signup successful!");
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Signup failed. Please try again.");
    }
  }

  return (
    <div>
      <div>
        <NavBar />
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
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">
                  Get started with your free account
                </p>
              </div>
            </div>

            {/* Signup Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

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
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Sign-in Link */}
            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/signin" className="link link-primary">
                  Sign in
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
