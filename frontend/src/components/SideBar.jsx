import { Users } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import pimage from "../assets/avatar.png";
import { useSocket } from "../context/SocketProvider";

const Sidebar = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]); // Ensuring users is always an array
  const [loading, setLoading] = useState(true);
  const { onlineUsers } = useSocket(); // Get online users from socket context

  useEffect(() => {
    async function getUsers() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found!");
          setUsers([]);
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/api/v1/message/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    getUsers();
  }, []);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {loading ? (
          <div className="text-center text-zinc-500 py-4">Loading users...</div>
        ) : users.length > 0 ? (
          users.map((user) => {
            const isOnline = onlineUsers.includes(user._id); // Check if user is online
            return (
              <button
                key={user?._id}
                className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
                onClick={() => onSelectUser?.(user)}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user?.profilePic || pimage}
                    alt={user?.fullName || "User"}
                    className="size-12 object-cover rounded-full"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user?.fullName || "Unknown User"}</div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
