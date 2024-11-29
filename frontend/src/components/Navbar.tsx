import '../styles.css';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getUsernameFromToken} from "../service/utils.ts";
import announcementsPage from "../pages/auth/AnnouncementsPage.tsx";

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
      <div className="mt-0 shadow-lg">
        <div className="bg-gray-800 text-white py-2 px-4 flex justify-between items-center ">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img src="logo.png" alt="Logo" className="w-8 mr-2"/>
            <div>
              <div className="font-bold">Politechnika Łódzka</div>
              <div>I Dom Studenta</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div>{currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}</div>
            <a href="https://outlook.office.com/mail/" target="_blank" className="hover:underline">Poczta</a>
            {isLoggedIn && (
                <button
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => navigate("/admin-panel")}
                >
                  Panel Administratora
                </button>
            )}
            {!isLoggedIn && <>
              <a onClick={() => navigate("/login")} className="hover:underline cursor-pointer">Zaloguj</a>
              <a onClick={() => navigate("/register")} className="hover:underline cursor-pointer">Rejestracja</a>
            </>}

            <div className="flex items-center">
              <div className="border-l border-gray-400 h-6 mx-2"></div>
              <div className="relative">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <a href="/" className="h-8 text-white flex items-center justify-center">
                    PL
                  </a>
                  <a href="/" className="h-8 text-white flex items-center justify-center">
                    EN
                  </a>
                </div>
              </div>
              {isLoggedIn && <div className="relative">
                  <div onClick={toggleUserDropdown} className="flex items-center space-x-2 cursor-pointer">
                      <div className="border-l border-gray-400 h-6 mx-2"></div>

                      <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center">
                          JK
                      </div>
                      <div>{getUsernameFromToken()}</div>
                  </div>
                {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                      <a onClick={() => navigate("/edit-profile")}
                         className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">Edytuj profil</a>
                      <a onClick={logout}
                         className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">Wyloguj</a>
                      <a onClick={() => navigate("/announcements")}
                         className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">Ogłoszenia</a>
                  <a onClick={() => navigate("/announcements/add")}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">Dodaj ogłoszenie</a>
                </div>
                )}
              </div>}
            </div>
          </div>
        </div>
        <div className="bg-gray-700 text-white py-2 px-4 flex space-x-4">
          <a onClick={() => navigate("/annoucements")} className="hover:underline cursor-pointer">Ogłoszenia</a>
          <a href="/link2" className="hover:underline">Link2</a>
          <a href="/link3" className="hover:underline">Link3</a>
          <a href="/link4" className="hover:underline">Link4</a>
        </div>
      </div>
  );
}

export default Navbar;