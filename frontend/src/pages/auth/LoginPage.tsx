import React, { useState } from 'react';
import { useFormik } from 'formik';
import AuthService from '../../service/auth.service.ts';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await AuthService.login(values.username, values.password);

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setLoginError('');
          navigate("/");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setLoginError(error.response.data.error || "Niepoprawne dane logowania. Spróbuj ponownie.");
        } else {
          setLoginError("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
        }
      }
    },
  });

  return (
      <div className="flex items-center justify-center pt-48">
        <div className="bg-white p-8 rounded shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Logowanie</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Login
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  placeholder="Nazwa użytkownika"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Hasło
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  placeholder="Hasło"
              />
            </div>

            {loginError && (
                <div className="mb-4 text-red-600 bg-red-100 border border-red-500 p-3 rounded">
                  {loginError}
                </div>
            )}

            <div className="flex items-center justify-end">
              <button
                  className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
              >
                Zaloguj się
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginPage;
