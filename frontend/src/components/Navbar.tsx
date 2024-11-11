import '../styles.css';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const Navbar = () => {

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token") !== null;
  const [currentTime, setCurrentTime] = useState(new Date());

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
          <div className="flex items-center">
            <img src="logo.png" alt="Logo" className="w-8 mr-2"/>
            <div>
              <div className="font-bold">Politechnika Łódzka</div>
              <div>I Dom Studenta</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div>{currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}</div>
            <a href="/" className="hover:underline">Profil</a>
            <a onClick={() => navigate("/login")} className="hover:underline cursor-pointer">Zaloguj</a>
            <a onClick={() => navigate("/register")} className="hover:underline cursor-pointer">Rejestracja</a>
            <a href="/" className="hover:underline">Poczta</a>
            <div className="flex items-center">
              <div className="border-l border-gray-400 h-6 mx-2"></div>
              <div>Jan Kowalski</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 text-white py-2 px-4 flex space-x-4">
          <a href="/link1" className="hover:underline">Link1</a>
          <a href="/link2" className="hover:underline">Link2</a>
          <a href="/link3" className="hover:underline">Link3</a>
          <a href="/link4" className="hover:underline">Link4</a>
        </div>
      </div>
  );
}

export default Navbar;