import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  isFirstMessage,
  isSecondMessage,
} from "../config/Chatlogic";
import { ChatState } from "../Context/chatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            key={m._id}
            className={`flex flex-col mb-4 ${
              m.sender._id === user._id ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-start">
              {isFirstMessage(messages, m, i) && m.sender._id !== user._id && (
                <div className="group relative">
                  <div className="w-8 h-8 rounded-full mr-1 cursor-pointer overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    {m.sender.pic ? (
                      <img
                        src={m.sender.pic}
                        alt={m.sender.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {m.sender.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {m.sender.name}
                  </div>
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-sm lg:max-w-md shadow-sm ${
                  m.sender._id === user._id
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md"
                } ${isSameSenderMargin(messages, m, i, user._id)} ${
                  isFirstMessage(messages, m, i)
                    ? "mt-0"
                    : isSecondMessage(messages, m, i)
                    ? "ml-10"
                    : isSameUser(messages, m, i, user._id)
                    ? "mt-1 ml-10"
                    : "mt-3"
                }`}
              >
                {m.sender._id !== user._id &&
                  !isSameSender(messages, m, i, user._id) && (
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {m.sender.name}
                    </p>
                  )}
                <p className="text-sm break-words">{m.content}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {formatTime(m.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
