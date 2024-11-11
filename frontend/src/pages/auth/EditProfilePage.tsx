import React from 'react';
import {useFormik} from "formik";
import {useNavigate} from "react-router-dom";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      login: "",
    },
    onSubmit: async (values) => {
    },
  });

  return (
      <div className="flex items-center justify-center pt-48">
        <div className="bg-white p-8 rounded shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Edycja profilu</h2>
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

            <div className="flex items-center justify-end">
              <a
                  onClick={() => navigate("/change-password")}
                  className="text-blue-500 hover:underline mr-4 cursor-pointer"
              >
                Zmień hasło
              </a>
              <button
                  className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
              >
                Edytuj profil
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default EditProfilePage;