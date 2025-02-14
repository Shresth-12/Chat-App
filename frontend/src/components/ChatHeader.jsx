import { X } from "lucide-react";
import { useSocket } from "../context/SocketProvider";

const ChatHeader = ({ selectedUser, setSelectedUser }) => {
  if (!selectedUser) return null;

  const { onlineUsers } = useSocket();

  console.log("Online Users:", onlineUsers);
  console.log("Selected User ID:", selectedUser._id);


  const isOnline = onlineUsers.some(user => user === selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName || "Unknown"}</h3>
            <p className={`text-sm ${isOnline ? "text-green-500" : "text-gray-500"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-gray-200"
          title="Close chat"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
