import { API_URL } from "../../const.ts";

const getUsers = async (pageSize: number, offset: number, field: string, token: string) => {
    const response = await fetch(`${API_URL}/user/get-users?pagesize=${pageSize}&offset=${offset}&field=${field}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
    }

    return response.json(); // Zwraca listę użytkowników
};

const AdminService = {
    getUsers,
};

export default AdminService;
