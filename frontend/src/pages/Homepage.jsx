import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaUser } from "react-icons/fa";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import ThemeToggle from "../components/common/ThemeToggle";

const Homepage = () => {
  const [tab, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkUserAuth = () => {
      try {
        const userInfo = localStorage.getItem("userInfo");

        if (userInfo) {
          // Try to parse the user info
          const user = JSON.parse(userInfo);

          // Check if user object has required fields and token
          if (user && user.token && user._id) {
            // User is logged in, redirect to chat page
            navigate("/chats", { replace: true });
            return;
          } else {
            // Invalid user data, clear it
            localStorage.removeItem("userInfo");
          }
        }
      } catch (error) {
        // If JSON parsing fails, clear invalid data
        console.error("Error parsing user info:", error);
        localStorage.removeItem("userInfo");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuth();
  }, [navigate]);

  const handleAboutClick = () => {
    window.open(
      "https://drive.google.com/file/d/1Oo0YFwvREpHYtWBDrDpY1uWQlT6-gVcg/view?usp=sharing",
      "_blank"
    );
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Theme Toggle and About Button - Top Right */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-3">
        <button
          onClick={handleAboutClick}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm"
        >
          <FaUser className="w-3 h-3" />
          <span>About</span>
        </button>
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center w-full px-4">
        {/* Hero Section */}
        <div className="mb-10 mt-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-lg mb-4">
            ConvoHub
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-xl mx-auto">
            Connect, chat, and collaborate instantly with friends and
            colleagues.
          </p>
        </div>
        {/* Glassy Card */}
        <div className="w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          {/* Custom Rounded Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-2xl p-1 mb-6">
            <button
              type="button"
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                tab === 0
                  ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md transform scale-105"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
              onClick={() => setTab(0)}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaSignInAlt className="w-4 h-4" />
                <span>Login</span>
              </div>
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                tab === 1
                  ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-md transform scale-105"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
              onClick={() => setTab(1)}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaUserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </div>
            </button>
          </div>
          <div className="w-full mt-2">
            {tab === 0 ? <Login /> : <Signup />}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full flex justify-center items-center mt-2 mb-4">
          <span className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span role="img" aria-label="sparkle">
              ✨
            </span>
            Made by Raunak Agarwal
            <span role="img" aria-label="chat">
              ❤️‍🔥
            </span>
          </span>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;
