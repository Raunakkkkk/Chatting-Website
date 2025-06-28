import React from "react";
import { FaTimes } from "react-icons/fa";

const UserBadgeItem = ({ user, handleFunction, showRemove = true }) => {
  return (
    <div
      className={`inline-flex items-center px-3 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-800 dark:text-blue-200 text-sm font-medium transition-all duration-200 shadow-sm border border-blue-200 dark:border-blue-700 ${
        showRemove
          ? "cursor-pointer hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800 dark:hover:to-indigo-800 group"
          : ""
      }`}
      onClick={showRemove ? handleFunction : undefined}
    >
      <span className="mr-2">{user.name}</span>
      {showRemove && (
        <FaTimes className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </div>
  );
};

export default UserBadgeItem;
