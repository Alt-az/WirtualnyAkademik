import '../styles.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUsernameFromToken } from "../service/utils.ts";
import {MdAnnouncement, MdCalendarMonth, MdEmail} from "react-icons/md";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token") !== null;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
      <div className="shadow-md bg-gradient-to-r from-slate-900 to-slate-800">
        {/* Top Navbar */}
        <div className="py-3 px-6 flex justify-between items-center text-white">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img src="logo.png" alt="Logo" className="w-10 h-10 mr-3 rounded-full shadow-md" />
            <div className="text-sm">
              <div className="font-bold text-lg">Politechnika Łódzka</div>
              <div className="opacity-80 text-sm">I Dom Studenta</div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div
                className="font-medium text-gray-300">{currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}</div>
            <a
                href="https://outlook.office.com/mail/"
                target="_blank"
                className="text-gray-300 hover:text-white transition duration-200 font-medium cursor-pointer flex items-center space-x-2"
            >
              Poczta
            </a>

            {isLoggedIn && (
                <button
                    className="bg-gray-700 text-white font-medium py-2 px-4 rounded-md shadow-md hover:bg-gray-600 transition duration-200"
                    onClick={() => navigate("/admin-panel")}
                >
                  Panel Administratora
                </button>
            )}

            {!isLoggedIn && (
                <>
                  <a
                      onClick={() => navigate("/login")}
                      className="hover:underline cursor-pointer transition duration-200 text-gray-300"
                  >
                    Zaloguj
                  </a>
                  <a
                      onClick={() => navigate("/register")}
                      className="hover:underline cursor-pointer transition duration-200 text-gray-300"
                  >
                    Rejestracja
                  </a>
                </>
            )}

            {/* Language Options */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-300 hover:text-white transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM2 12h20M12 2c2.703 2.763 4 5.793 4 10s-1.297 7.237-4 10c-2.703-2.763-4-5.793-4-10s1.297-7.237 4-10z"
                />
              </svg>
              <select
                  className="bg-gray-700 text-white text-sm rounded-md px-2 py-1 hover:bg-gray-600 transition focus:outline-none"
                  defaultValue="PL"
              >
                <option value="PL">PL</option>
                <option value="EN">EN</option>
              </select>
            </div>


            {/* User Dropdown */}
            {isLoggedIn && (
                <div className="relative">
                  <div
                      onClick={toggleUserDropdown}
                      className="flex items-center cursor-pointer space-x-2"
                  >
                    <div className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center">
                      JK
                    </div>
                    <div className="font-medium text-gray-300">{getUsernameFromToken()}</div>
                  </div>

                  {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-gray-700 rounded-md shadow-lg z-20">
                        <a
                            onClick={() => navigate("/edit-profile")}
                            className="block px-4 py-2 text-gray-300 hover:bg-gray-600 cursor-pointer"
                        >
                          Edytuj profil
                        </a>
                        <a
                            onClick={logout}
                            className="block px-4 py-2 text-gray-300 hover:bg-gray-600 cursor-pointer"
                        >
                          Wyloguj
                        </a>
                        <a
                            onClick={() => navigate("/announcements")}
                            className="block px-4 py-2 text-gray-300 hover:bg-gray-600 cursor-pointer"
                        >
                          Ogłoszenia
                        </a>
                        <a
                            onClick={() => navigate("/announcements/add")}
                            className="block px-4 py-2 text-gray-300 hover:bg-gray-600 cursor-pointer"
                        >
                          Dodaj ogłoszenie
                        </a>
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>

        {/* Bottom Navbar */}
        <div
            className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-gray-300 py-3 px-6 flex space-x-6 text-sm">
          <a
              onClick={() => navigate("/announcements")}
              className="hover:text-white transition duration-200 font-medium cursor-pointer flex items-center space-x-2"
          >
            <MdAnnouncement/>
            <span>Ogłoszenia</span>
          </a>
          <a
              onClick={() => {navigate("/laundry-timetable")
              }}
              className="hover:text-white transition duration-200 font-medium cursor-pointer flex items-center space-x-2"
          >
            <MdCalendarMonth/>
            <span>Pralnia</span>
          </a>
          <a
              onClick={() => {
              }}
              className="hover:text-white transition duration-200 font-medium cursor-pointer flex items-center space-x-2"
          >
            <MdEmail />
            <span>Kontakt</span>
          </a>
        </div>
      </div>
  );
};

export default Navbar;
