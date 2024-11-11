import axios from "axios";
import {AUTH_URL} from "../../const.ts";

const login = (username: string, password: string) => {
  return axios
      .post(AUTH_URL + "/login", {username, password})
};

const register = (
    username: string,
    password: string,
) => {
  return axios.post(
      AUTH_URL + `/register`,
      {username, password},
  );
};

const AuthService = {
  login,
  register
}

export default AuthService;
