import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/chatProvider";
import ChatHeader from "../components/miscellaneous/ChatHeader";
import MyChats from "../components/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      // User is not logged in, redirect to homepage
      navigate("/");
    }
  }, [navigate, user]);

  // Show loading or redirect if user is not available
  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative z-10">
      {user && <ChatHeader />}
      <div className="flex justify-between w-full h-[calc(100vh-60px)] p-2 md:p-4 gap-4">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
