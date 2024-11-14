import axios from "axios";
import {AUTH_URL} from "../../const.ts";

const login = (username: string, password: string) => {
    return axios.post(AUTH_URL + "/login", { username, password });
};

const register = (username, password, email, name, surname, recaptchaToken) => {
    return axios.post(
        AUTH_URL + `/register`,
        {
            user: {
                username,
                password,
                email,
                name,
                surname
            },
            recaptchaToken
        }
    );
};

const AuthService = {
    login,
    register
};

export default AuthService;
