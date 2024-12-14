import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
      <div className="w-full h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/dormitory.jpg')" }}>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-gray-200 backdrop-blur-md">
          <h1 className="text-5xl font-bold mb-6">Witamy w Wirtualnym Akademiku</h1>
          <p className="text-xl text-gray-300 mb-8 text-center max-w-2xl">
            Doświadcz wygody zarządzania życiem w akademiku online. Od grafików pralni po ogłoszenia, wszystko jest na wyciągnięcie ręki.
          </p>
          <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 text-white font-bold py-3 px-6 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
          >
            Rozpocznij
          </button>
        </div>
      </div>
  );
};

export default LandingPage;