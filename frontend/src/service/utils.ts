import { jwtDecode } from "jwt-decode"

export const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

export const getUsernameFromToken = () => {
    try {
        const token = localStorage.getItem("token")
        if (token == null) return "";
        const decodedToken = jwtDecode(token);
        // console.log(decodedToken)
        return decodedToken.sub; // Adjust this based on your token's payload structure
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};