import React from 'react';
import {useFormik} from "formik";
import {useNavigate} from "react-router-dom";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      repeatPassword: ""
    },
    onSubmit: async (values) => {

    },
  });

  return (
      <div className="flex items-center justify-center pt-48">
        <div className="bg-white p-8 rounded shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Zmień hasło</h2>
          <form onSubmit={formik.handleSubmit}>
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
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Powtórz hasło
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="repeatPassword"
                  type="password"
                  name="repeatPassword"
                  value={formik.values.repeatPassword}
                  onChange={formik.handleChange}
                  placeholder="Hasło"
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                  className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
              >
                Zmień hasło
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default EditProfilePage;