import React from "react";

const ChatLoading = () => {
  return (
    <div className="space-y-3">
      {[...Array(12)].map((_, index) => (
        <div
          key={index}
          className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
};

export default ChatLoading;
