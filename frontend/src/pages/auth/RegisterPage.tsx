import React from 'react';
import { useFormik } from 'formik';
import AuthService from '../../service/auth.service.ts';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        AuthService.register(values.login, values.password).then((response) => {
          localStorage.setItem("token", response.data.token);
        });
        navigate("/");
      } catch (error) {}
    },
  });

  return (
      <div className="flex items-center justify-center pt-48">
        <div className="bg-white p-8 rounded shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Rejestracja</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login">
                Login
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="login"
                  type="text"
                  name="login"
                  value={formik.values.login}
                  onChange={formik.handleChange}
                  placeholder="Login"
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
            <div className="flex items-center justify-end">
              <button
                  className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
              >
                Zarejestruj się
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default RegisterPage;