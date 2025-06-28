import { Route, Routes, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ParticleBackground from "./ParticleBackground.jsx";
import React from "react";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./Context/themeProvider.jsx";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <ThemeProvider>
      <div
        className={`min-h-screen w-full ${
          isHomePage
            ? "bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800"
            : "bg-white dark:bg-gray-900"
        } flex flex-col relative transition-colors duration-300 overflow-hidden`}
      >
        <ParticleBackground />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "#10B981",
              },
            },
            error: {
              duration: 5000,
              style: {
                background: "#EF4444",
              },
            },
          }}
        />
        <Routes>
          <Route path="/" Component={Homepage} />
          <Route path="/chats" Component={ChatPage} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
