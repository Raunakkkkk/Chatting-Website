import React, { useState, useEffect } from "react";
import { ChatState } from "../../Context/chatProvider";
import ProfileModal from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/Chatlogic";
import { AiOutlineBell } from "react-icons/ai";
import {
  FaSearch,
  FaTrash,
  FaUser,
  FaSignOutAlt,
  FaUserFriends,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import ThemeToggle from "../common/ThemeToggle";

const ChatHeader = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    user,
    setselectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    setFetchAgain,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim()) {
        handleSearch();
      } else {
        setSearchResult([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user?search=${search.trim()}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to load search results");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      // Check if this is a new chat
      const isNewChat = !chats.find((c) => c._id === data._id);

      if (isNewChat) {
        // Add new chat to the beginning of the list
        setChats([data, ...chats]);
        // Trigger re-render to ensure chat list updates properly
        setFetchAgain((prev) => !prev);
      }

      setselectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
      setSearch("");
      setSearchResult([]);
    } catch (error) {
      setLoadingChat(false);
      toast.error("Error fetching the chat");
    }
  };

  return (
    <div className="relative z-50">
      <div className="flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-600/50 shadow-lg w-full p-3 md:p-5">
        <div className="tooltip tooltip-bottom" data-tip="Search users">
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-ghost btn-circle md:btn-wide gap-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100/80 dark:hover:bg-gray-600/80 transition-all duration-300 backdrop-blur-sm rounded-2xl"
          >
            <FaSearch className="w-5 h-5" />
            <span className="hidden md:block font-medium">Search Users</span>
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-lg">
          ConvoHub
        </h1>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications Dropdown */}
          <div className="dropdown dropdown-end">
            <div className="tooltip tooltip-bottom" data-tip="Notifications">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle relative hover:bg-blue-100/80 dark:hover:bg-gray-600/80 transition-all duration-300 backdrop-blur-sm rounded-2xl"
              >
                {notification.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse font-bold shadow-lg">
                    {notification.length}
                  </div>
                )}
                <AiOutlineBell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl w-80 border border-gray-200/50 dark:border-gray-600/50 z-50"
            >
              {!notification.length && (
                <li className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center">
                  No new messages
                </li>
              )}
              {notification.length > 0 && (
                <li className="border-b border-gray-200/50 dark:border-gray-600/50 mb-2">
                  <button
                    onClick={() => setNotification([])}
                    className="flex items-center w-full p-2 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 rounded-xl hover:bg-red-50/50 dark:hover:bg-red-900/20"
                  >
                    <FaTrash className="w-3 h-3 mr-2" />
                    Clear all notifications
                  </button>
                </li>
              )}
              {notification.map((notif) => (
                <li key={notif._id}>
                  <button
                    onClick={() => {
                      setselectedChat(notif.chat);
                      setNotification(
                        notification.filter((n) => n._id !== notif._id)
                      );
                    }}
                    className="flex items-center p-3 hover:bg-blue-50/80 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-300 w-full backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 rounded-full mr-3 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-blue-200/50 dark:ring-blue-700/50 shadow-lg">
                      <span className="text-sm font-semibold text-white">
                        {getSender(user, notif.chat.users)
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {getSender(user, notif.chat.users)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {notif.content}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* User Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle hover:bg-blue-100/80 dark:hover:bg-gray-600/80 transition-all duration-300 backdrop-blur-sm rounded-2xl"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-blue-200/50 dark:ring-blue-700/50 overflow-hidden shadow-lg">
                {user.pic ? (
                  <img
                    src={user.pic}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <span
                  className={`text-sm font-semibold text-white ${
                    user.pic ? "hidden" : "flex"
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl w-56 border border-gray-200/50 dark:border-gray-600/50 z-50"
            >
              <li>
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="flex items-center w-full p-3 hover:bg-blue-50/80 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-300 backdrop-blur-sm text-gray-700 dark:text-gray-300"
                >
                  <FaUser className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">Profile</span>
                </button>
              </li>
              <div className="divider my-1 opacity-50"></div>
              <li>
                <button
                  onClick={logoutHandler}
                  className="flex items-center w-full p-3 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 text-red-600 dark:text-red-400 backdrop-blur-sm"
                >
                  <FaSignOutAlt className="w-4 h-4 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <ProfileModal
          user={user}
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          isCurrentUser={true}
        />
      )}

      {/* Search Drawer */}
      <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-600/50 shadow-2xl rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-2xl text-gray-900 dark:text-white">
              Search Users
            </h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setSearch("");
                setSearchResult([]);
              }}
              className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-300 backdrop-blur-sm rounded-2xl text-gray-700 dark:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-lg backdrop-blur-sm shadow-lg"
                autoFocus
              />
            </div>

            {loading && (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
              </div>
            )}

            {!loading && search && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResult.length > 0 ? (
                  searchResult.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FaUserFriends className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">
                      Try searching with a different name or email address
                    </p>
                  </div>
                )}
              </div>
            )}

            {loadingChat && (
              <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-md text-blue-500"></span>
                <span className="ml-3 text-lg text-gray-500 dark:text-gray-400">
                  Creating chat...
                </span>
              </div>
            )}

            {!search && !loading && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FaSearch className="w-20 h-20 mx-auto mb-6 text-gray-300 dark:text-gray-600" />
                <h4 className="text-xl font-semibold mb-2">Search for Users</h4>
                <p className="text-lg">
                  Start typing to search for users and start new conversations
                </p>
              </div>
            )}
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button
            onClick={() => {
              setIsOpen(false);
              setSearch("");
              setSearchResult([]);
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default ChatHeader;
