import React from "react";
import { useTheme } from "../../Context/themeProvider";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`tooltip tooltip-bottom`}
      data-tip={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <button
        onClick={toggleTheme}
        className={`btn btn-ghost btn-circle hover:bg-blue-100/80 dark:hover:bg-gray-600/80 transition-all duration-300 backdrop-blur-sm rounded-2xl ${className}`}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <FaSun className="w-5 h-5 text-yellow-400 hover:text-yellow-500 transition-colors duration-300" />
        ) : (
          <FaMoon className="w-5 h-5 text-gray-300 hover:text-yellow-400 transition-colors duration-300" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
