import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import {
  FaPaperPlane,
  FaArrowLeft,
  FaInfo,
  FaUsers,
  FaCog,
  FaComments,
} from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import ProfileModal from "./miscellaneous/ProfileModel";
import { getSender, getSenderFull } from "../config/Chatlogic";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

// const ENDPOINT =
//   window.location.hostname === "localhost"
//     ? "http://localhost:5000"
//     : window.location.origin;
const ENDPOINT='https://convohub-8dos.onrender.com';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setselectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      if (socket && socketConnected) {
        socket.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      toast.error("Failed to Load the Messages");
    }
  };

  useEffect(() => {
    if (user) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setsocketConnected(true));
      socket.on("typing", (data) => {
        if (data.userId !== user._id) {
          setTypingUsers((prev) => new Set(prev).add(data.userId));
          setIsTyping(true);
        }
      });
      socket.on("stop typing", (data) => {
        if (data.userId !== user._id) {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
          // Only hide typing indicator if no one is typing
          if (typingUsers.size <= 1) {
            setIsTyping(false);
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage.trim()) {
      if (socket && socketConnected) {
        socket.emit("stop typing", selectedChat._id);
      }
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messageToSend = newMessage.trim();
        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: messageToSend,
            chatId: selectedChat._id,
          },
          config
        );

        if (socket && socketConnected) {
          socket.emit("new message", data);
        }
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Failed to send the Message");
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // Clear typing users when chat changes
    setTypingUsers(new Set());
    setIsTyping(false);
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message recieved", (newMessageRecieved) => {
      // Check if the message is from the currently selected chat
      const isFromSelectedChat =
        selectedChatCompare &&
        selectedChatCompare._id === newMessageRecieved.chat._id;

      if (isFromSelectedChat) {
        // Message is from current chat - add to messages
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
        // Clear typing indicators when message is received
        setTypingUsers(new Set());
        setIsTyping(false);
      } else {
        // Message is from a different chat - add to notifications
        setNotification((prevNotifications) => {
          // Check if notification already exists for this message
          const existingNotification = prevNotifications.find(
            (n) => n._id === newMessageRecieved._id
          );
          if (existingNotification) {
            return prevNotifications; // Don't add duplicate
          }

          // Add new notification at the beginning
          return [newMessageRecieved, ...prevNotifications];
        });
      }

      // ALWAYS trigger chat list refresh for ANY message received
      setFetchAgain((prev) => !prev);
    });

    // Listen for new chat creation
    socket.on("new chat", () => {
      // Trigger chat list refresh when a new chat is created
      setFetchAgain((prev) => !prev);
    });

    // Cleanup socket listeners on unmount
    return () => {
      socket.off("message recieved");
      socket.off("new chat");
    };
  }, [selectedChatCompare, setNotification, setFetchAgain, socket]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !socket) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Helper function to get typing user names
  const getTypingUserNames = () => {
    if (!selectedChat || !selectedChat.users) return [];

    return Array.from(typingUsers).map((userId) => {
      const typingUser = selectedChat.users.find((u) => u._id === userId);
      return typingUser ? typingUser.name : "Someone";
    });
  };

  // Helper function to format typing message
  const getTypingMessage = () => {
    const typingNames = getTypingUserNames();
    if (typingNames.length === 0) return "";

    if (typingNames.length === 1) {
      return `${typingNames[0]} is typing...`;
    } else if (typingNames.length === 2) {
      return `${typingNames[0]} and ${typingNames[1]} are typing...`;
    } else {
      return `${typingNames[0]} and ${
        typingNames.length - 1
      } others are typing...`;
    }
  };

  const getSenderInfo = (selectedChat, user) => {
    const senderFull = getSenderFull(user, selectedChat.users);
    return senderFull;
  };

  const renderAvatar = (user, isGroup = false) => {
    if (isGroup) {
      return (
        <div className="avatar flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-blue-300 dark:ring-blue-600 flex items-center justify-center shadow-lg">
            <MdGroups
              className="w-8 h-8 text-white mx-auto my-auto"
              style={{ display: "block" }}
            />
          </div>
        </div>
      );
    }

    const senderInfo = getSenderInfo(selectedChat, user);
    return (
      <div className="avatar">
        <div className="w-12 h-12 rounded-full ring-2 ring-blue-300 dark:ring-blue-600 overflow-hidden shadow-lg flex items-center justify-center">
          {senderInfo.pic ? (
            <img
              src={senderInfo.pic}
              alt={getSender(user, selectedChat.users)}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg ${
              senderInfo.pic ? "hidden" : "flex"
            }`}
          >
            {getSender(user, selectedChat.users).charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-full w-full rounded-xl overflow-hidden shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center px-6 py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 w-full border-b border-gray-200 dark:border-gray-600 shadow-sm">
            <button
              className="btn btn-circle btn-sm btn-ghost md:hidden mr-4 hover:bg-blue-100 dark:hover:bg-gray-600 transition-all duration-200 text-gray-700 dark:text-gray-300"
              onClick={() => setselectedChat("")}
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>

            {!selectedChat.isGroupChat ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  {selectedChat.users &&
                    selectedChat.users.length > 0 &&
                    renderAvatar(user, false)}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {getSender(user, selectedChat.users)}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip="View Profile"
                  >
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                    >
                      <button className="btn btn-circle btn-sm btn-ghost hover:bg-blue-100 dark:hover:bg-gray-600 transition-all duration-200 text-gray-700 dark:text-gray-300">
                        <FaInfo className="w-5 h-5" />
                      </button>
                    </ProfileModal>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  {renderAvatar(user, true)}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedChat.chatName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <FaUsers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedChat.users.length} members
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip="Group Settings"
                  >
                    <UpdateGroupChatModel
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={fetchMessages}
                    >
                      <button className="btn btn-circle btn-md btn-ghost hover:bg-blue-100 dark:hover:bg-gray-600 transition-all duration-200 text-gray-700 dark:text-gray-300">
                        <FaCog className="w-6 h-6" />
                      </button>
                    </UpdateGroupChatModel>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex flex-col justify-end p-4 bg-gradient-to-b from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 w-full h-full rounded-b-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Loading messages...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto px-2 messages">
                  <ScrollableChat messages={messages} />
                </div>

                <div className="mt-4 relative">
                  {isTyping && (
                    <div className="absolute bottom-full left-0 mb-3">
                      <div className="flex items-center space-x-2 bg-white/95 dark:bg-gray-700/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-2">
                          {getTypingMessage()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="form-control">
                    <div className="input-group relative">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl pr-14 py-4 text-base shadow-sm"
                        onChange={typingHandler}
                        value={newMessage}
                        onKeyDown={sendMessage}
                        aria-label="Type a message"
                        autoComplete="off"
                      />
                      <div
                        className="tooltip tooltip-left absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
                        data-tip="Send message"
                      >
                        <button
                          className="btn btn-circle btn-primary hover:bg-blue-600 rounded-full shadow-lg"
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          type="button"
                          aria-label="Send message"
                        >
                          <FaPaperPlane className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center w-full h-full p-0 text-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-none shadow-none border-none relative overflow-hidden"
        >
          {/* Animated Background Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 left-10 w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full opacity-60"
          />
          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-20 right-16 w-6 h-6 bg-purple-200 dark:bg-purple-800 rounded-full opacity-60"
          />
          <motion.div
            animate={{
              y: [0, -10, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-20 left-20 w-4 h-4 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-60"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-32 right-10 w-5 h-5 bg-pink-200 dark:bg-pink-800 rounded-full opacity-60"
          />

          {/* Main Icon with Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0.4)",
                  "0 0 0 20px rgba(59, 130, 246, 0)",
                  "0 0 0 0 rgba(59, 130, 246, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="w-28 h-28 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaComments className="w-14 h-14 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Welcome Text with Stagger Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Hey {user.name}!
            </h2>
          </motion.div>

          {/* Description with Fade In */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mb-10 leading-relaxed">
              Pick a chat from the sidebar or start a new one to connect with
              your college buddies, work colleagues, or anyone else! Time to get
              the conversation flowing 🚀
            </p>
          </motion.div>

          {/* Floating Message Bubbles */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-1/4 right-8 w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl shadow-lg flex items-center justify-center opacity-30"
          >
            <span className="text-xs text-gray-600 dark:text-gray-300">👋</span>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 25, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/4 left-8 w-12 h-12 bg-white dark:bg-gray-700 rounded-2xl shadow-lg flex items-center justify-center opacity-30"
          >
            <span className="text-xs text-gray-600 dark:text-gray-300">💬</span>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default SingleChat;
