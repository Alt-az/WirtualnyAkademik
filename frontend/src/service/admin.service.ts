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
const deleteUser = async (id: number,token: string) =>{
    const response = await fetch(`${API_URL}/user/delete-user?user-id=${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
    }
}
const editUser = async() =>{

}

const AdminService = {
    getUsers,
    deleteUser,
    editUser,
};

export default AdminService;
