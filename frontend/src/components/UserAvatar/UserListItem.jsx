import React from "react";
import { FaPlus } from "react-icons/fa";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900 dark:hover:to-indigo-900 hover:text-blue-900 dark:hover:text-blue-100 w-full flex items-center text-gray-900 dark:text-white px-4 py-3 mb-2 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md group"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mr-4 flex items-center justify-center overflow-hidden ring-2 ring-blue-200 dark:ring-blue-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-500 transition-all duration-200">
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
      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors duration-200">
          {user.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
          <span className="font-medium">Email:</span> {user.email}
        </p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <FaPlus className="w-5 h-5 text-blue-500" />
      </div>
    </div>
  );
};

export default UserListItem;
