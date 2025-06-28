import React from "react";
import { ChatState } from "./../../Context/chatProvider";
import SingleChat from "../SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`flex items-center flex-col px-0 py-0 bg-white dark:bg-gray-800 w-full md:w-[68%] rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden transition-all duration-300 ${
        selectedChat ? "block" : "hidden md:flex"
      }`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
