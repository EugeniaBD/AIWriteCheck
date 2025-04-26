import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiMenu,
  FiX,
  FiHome,
  FiFileText,
  FiTrendingUp,
  FiSettings,
  FiHelpCircle,
  FiShield,
  FiLogOut,
} from "react-icons/fi";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-blue-600 font-bold"
      : "text-gray-700 hover:text-blue-500";
  };

  // Mobile navigation active style
  const isMobileActive = (path) => {
    return location.pathname === path
      ? "bg-blue-600 text-white font-bold shadow-lg"
      : "text-white bg-blue-800 bg-opacity-70 hover:bg-blue-700";
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to={currentUser ? "/dashboard" : "/login"}
              className="flex items-center"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                AIWriteCheck
              </span>
            </Link>
          </div>

          {currentUser && (
            <>
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className={`${isActive(
                      "/dashboard"
                    )} px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                  >
                    <FiHome className="mr-1" /> Dashboard
                  </Link>
                  <Link
                    to="/analysis"
                    className={`${isActive(
                      "/analysis"
                    )} px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                  >
                    <FiFileText className="mr-1" /> Text Analysis
                  </Link>
                  <Link
                    to="/progress"
                    className={`${isActive(
                      "/progress"
                    )} px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                  >
                    <FiTrendingUp className="mr-1" /> Progress
                  </Link>
                  <Link
                    to="/settings"
                    className={`${isActive(
                      "/settings"
                    )} px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                  >
                    <FiSettings className="mr-1" /> Settings
                  </Link>
                  <Link
                    to="/help"
                    className={`${isActive(
                      "/help"
                    )} px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                  >
                    <FiHelpCircle className="mr-1" /> Help
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`${isActive(
                        "/admin"
                      )} px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-500 flex items-center`}
                    >
                      <FiShield className="mr-1" /> Admin
                    </Link>
                  )}
                </div>
              </div>

              <div className="hidden md:block">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-md flex items-center"
                >
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </div>
            </>
          )}

          <div className="md:hidden flex items-center">
            {currentUser && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 shadow-md"
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <FiMenu className="text-xl" />
                ) : (
                  <FiX className="text-xl" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen Mobile menu with animation */}
      {isMenuOpen && currentUser && (
        <div className="md:hidden fixed inset-0 z-50 bg-gradient-to-br from-blue-900 to-blue-700">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex items-center justify-center p-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
              aria-label="Close navigation menu"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center h-full -mt-20">
            <div className="w-4/5 max-w-sm space-y-4">
              <Link
                to="/dashboard"
                className={`${isMobileActive(
                  "/dashboard"
                )}  px-6 py-4 rounded-xl text-center text-lg font-medium transition duration-150 ease-in-out flex items-center justify-center`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiHome className="mr-2 text-xl" /> Dashboard
              </Link>
              <Link
                to="/analysis"
                className={`${isMobileActive(
                  "/analysis"
                )} px-6 py-4 rounded-xl text-center text-lg font-medium transition duration-150 ease-in-out flex items-center justify-center`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiFileText className="mr-2 text-xl" /> Text Analysis
              </Link>
              <Link
                to="/progress"
                className={`${isMobileActive(
                  "/progress"
                )}  px-6 py-4 rounded-xl text-center text-lg font-medium transition duration-150 ease-in-out flex items-center justify-center`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiTrendingUp className="mr-2 text-xl" /> Progress
              </Link>
              <Link
                to="/settings"
                className={`${isMobileActive(
                  "/settings"
                )}  px-6 py-4 rounded-xl text-center text-lg font-medium transition duration-150 ease-in-out flex items-center justify-center`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiSettings className="mr-2 text-xl" /> Settings
              </Link>
              <Link
                to="/help"
                className={`${isMobileActive(
                  "/help"
                )}  px-6 py-4 rounded-xl text-center text-lg font-medium transition duration-150 ease-in-out flex items-center justify-center`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiHelpCircle className="mr-2 text-xl" /> Help
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className=" px-6 py-4 rounded-xl text-center text-lg font-medium bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition duration-150 ease-in-out shadow-lg flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiShield className="mr-2 text-xl" /> Admin
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full mt-8 px-6 py-4 rounded-xl text-center text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition duration-150 ease-in-out shadow-lg flex items-center justify-center"
              >
                <FiLogOut className="mr-2 text-xl" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
