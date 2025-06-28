import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import { FaPlus, FaSearch } from "react-icons/fa";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderFull } from "../config/Chatlogic";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { user, setselectedChat, selectedChat, chats, setChats, notification } =
    ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, notification.length]);

  // Sort chats to show newest messages first
  const sortedChats = chats
    ? [...chats].sort((a, b) => {
        if (!a.latestMessage && !b.latestMessage) return 0;
        if (!a.latestMessage) return 1;
        if (!b.latestMessage) return -1;
        return (
          new Date(b.latestMessage.createdAt) -
          new Date(a.latestMessage.createdAt)
        );
      })
    : [];

  const filteredChats = sortedChats.filter((chat) =>
    chat.isGroupChat
      ? chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
      : getSender(loggedUser, chat.users)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
  );

  // Helper function to get the profile picture of the other user in a non-group chat
  const getChatUserPic = (chat) => {
    if (chat.isGroupChat) {
      return null; // Group chats use default avatar
    }
    // Find the other user in the chat
    const otherUser = chat.users.find((u) => u._id !== loggedUser?._id);
    return otherUser?.pic;
  };

  return (
    <div
      className={`flex flex-col items-center p-3 bg-white dark:bg-gray-800 w-full md:w-[31%] rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg ${
        selectedChat ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="flex pb-3 px-2 w-full items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Chats
        </h2>
        <GroupChatModal>
          <button className="btn btn-primary btn-sm rounded-full">
            <FaPlus className="w-4 h-4 mr-1" />
            New Group
          </button>
        </GroupChatModal>
      </div>

      <div className="relative w-full mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col p-2 bg-gray-50 dark:bg-gray-700 w-full h-full rounded-lg overflow-hidden">
        {chats ? (
          <div className="overflow-y-auto space-y-2">
            {filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setselectedChat(chat)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border ${
                  selectedChat === chat
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="w-10 h-10 rounded-full mr-3 overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  {getChatUserPic(chat) ? (
                    <img
                      src={getChatUserPic(chat)}
                      alt={
                        !chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                            .charAt(0)
                            .toUpperCase()
                        : chat.chatName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </h3>
                    {chat.latestMessage && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(
                          chat.latestMessage.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  {chat.latestMessage && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      <span className="font-semibold">
                        {chat.latestMessage.sender.name === loggedUser?.name
                          ? "You: "
                          : ""}
                      </span>
                      {chat.latestMessage.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
