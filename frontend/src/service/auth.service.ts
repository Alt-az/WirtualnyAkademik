import axios from "axios";
import {AUTH_URL} from "../../const.ts";

const login = (login: string, password: string) => {
  return axios
      .post(AUTH_URL + "/login", {login, password})
};

const register = (
    login: string,
    password: string,
) => {
  return axios.post(
      AUTH_URL + `/register`,
      {login, password},
  );
};

const AuthService = {
  login,
  register
}

export default AuthService;
