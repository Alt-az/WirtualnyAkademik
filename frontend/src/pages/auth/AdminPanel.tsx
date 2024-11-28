import React, { useEffect, useState } from 'react';
import AdminService from '../../service/admin.service.ts';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [pageSize] = useState(10); // Liczba użytkowników na stronę
    const [offset, setOffset] = useState(0); // Obecny offset (dla paginacji)
    const [field] = useState('id'); // Pole do sortowania

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token'); // Pobranie tokena
            const data = await AdminService.getUsers(pageSize, offset, field, token || '');
            setUsers(data); // Zakładam, że API zwraca listę użytkowników
            setError('');
        } catch (err) {
            setError('Nie udało się pobrać listy użytkowników.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [offset]); // Przeładuj dane, gdy zmienia się offset

    const nextPage = () => setOffset((prev) => prev + pageSize);
    const prevPage = () => setOffset((prev) => Math.max(0, prev - pageSize));

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Panel Administratora</h1>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Nazwa użytkownika</th>
                    <th className="border border-gray-300 px-4 py-2">Email</th>
                    <th className="border border-gray-300 px-4 py-2">Aktywowany</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            {user.isActivated ? 'Tak' : 'Nie'}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-between">
                <button
                    onClick={prevPage}
                    disabled={offset === 0}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50"
                >
                    Poprzednia strona
                </button>
                <button
                    onClick={nextPage}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                >
                    Następna strona
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;
