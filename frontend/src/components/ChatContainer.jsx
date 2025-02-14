import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import piimage from "../assets/avatar.png";
import { useSocket } from "../context/SocketProvider";

const ChatContainer = ({ selectedUser, setSelectedUser, authId, authpic }) => {
  const [messages, setMessages] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const token = localStorage.getItem("token");
  const messageEndRef = useRef(null);
  const { socket } = useSocket(); // Get socket instance

  useEffect(() => {
    if (!selectedUser?._id) return;

    const getMessages = async () => {
      setIsMessageLoading(true);
      try {
        const response = await axios.get(
          `https://chat-app-backend-tlqu.onrender.com/api/v1/message/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsMessageLoading(false);
      }
    };

    getMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket || !selectedUser?._id) return;

    const handleNewMessage = (newMessage) => {
      if (
        newMessage.senderId === selectedUser._id || // Received message
        newMessage.senderId === authId // Sent message
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, authId]);

  // Scroll to the latest message when messages update
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white shadow-md rounded-lg">
      {/* Chat Header */}
      <ChatHeader selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isMessageLoading ? (
          <MessageSkeleton />
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authId ? "chat-end" : "chat-start"}`}
            >
              {/* Avatar */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authId
                        ? authpic || piimage
                        : selectedUser.profilePic || piimage
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              {/* Chat Bubble */}
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>

              {/* Timestamp */}
              <div className="chat-header text-xs text-gray-500">
                {message.createdAt
                  ? new Date(message.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    })
                  : "Loading..."}
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput selectedUser={selectedUser} setMessages={setMessages} />
    </div>
  );
};

export default ChatContainer;
