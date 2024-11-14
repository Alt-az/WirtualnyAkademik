import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import AuthService from '../../service/auth.service.ts';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const RegisterPage = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const [recaptchaTouched, setRecaptchaTouched] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      surname: ""
    },
    onSubmit: async (values) => {
      const recaptchaValue = recaptchaRef.current.getValue();
      if (!recaptchaValue) {
        setRecaptchaTouched(true);
        alert("Please complete the reCAPTCHA");
        return;
      }

      try {
        const response = await AuthService.register(
            values.username,
            values.password,
            values.email,
            values.name,
            values.surname,
            recaptchaValue
        );
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } catch (error) {
        console.error("Response data:", error.response?.data);

        if (error.response && error.response.status === 400) {
          const errorMessages = error.response.data;
          setServerErrors(errorMessages);

          formik.setErrors(errorMessages);
          formik.setTouched({
            username: true,
            password: true,
            email: true,
            name: true,
            surname: true
          });
        } else {
          alert("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
        }
      }
    },
  });

  return (
      <div className="flex items-center justify-center pt-4">
        <div className="bg-white p-8 rounded shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Rejestracja</h2>
          <form onSubmit={formik.handleSubmit}>

            {/* Username Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Login
              </label>
              <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      serverErrors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  id="username"
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  placeholder="Nazwa użytkownika"
              />
              {serverErrors.username && (
                  <div className="mt-2 p-3 bg-red-100 border border-red-500 rounded text-red-700 text-sm">
                    {serverErrors.username}
                  </div>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                E-mail
              </label>
              <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      serverErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  id="email"
                  type="text"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  placeholder="E-mail"
              />
              {serverErrors.email && (
                  <div className="mt-2 p-3 bg-red-100 border border-red-500 rounded text-red-700 text-sm">
                    {serverErrors.email}
                  </div>
              )}
            </div>

            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Imię
              </label>
              <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      serverErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  id="name"
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  placeholder="Imię"
              />
              {serverErrors.name && (
                  <div className="mt-2 p-3 bg-red-100 border border-red-500 rounded text-red-700 text-sm">
                    {serverErrors.name}
                  </div>
              )}
            </div>

            {/* Surname Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                Nazwisko
              </label>
              <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      serverErrors.surname ? 'border-red-500' : 'border-gray-300'
                  }`}
                  id="surname"
                  type="text"
                  name="surname"
                  value={formik.values.surname}
                  onChange={formik.handleChange}
                  placeholder="Nazwisko"
              />
              {serverErrors.surname && (
                  <div className="mt-2 p-3 bg-red-100 border border-red-500 rounded text-red-700 text-sm">
                    {serverErrors.surname}
                  </div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Hasło
              </label>
              <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      serverErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  id="password"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  placeholder="Hasło"
              />
              {serverErrors.password && (
                  <div className="mt-2 p-3 bg-red-100 border border-red-500 rounded text-red-700 text-sm">
                    {serverErrors.password}
                  </div>
              )}
            </div>

            {/* reCAPTCHA */}
            <div className="mb-6">
              <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LdSuX0qAAAAAI2IQpPxdzOKRuAZHl82c4KtARlA"
                  onChange={() => setRecaptchaTouched(true)}
              />
              {recaptchaTouched && !recaptchaRef.current.getValue() && (
                  <div className="mt-2 p-3 bg-red-100 border border-red-500 rounded text-red-700 text-sm">
                    Proszę zaznaczyć reCAPTCHA.
                  </div>
              )}
            </div>

            {/* Submit Button */}
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
