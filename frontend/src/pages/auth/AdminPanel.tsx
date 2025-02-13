import React, { useEffect, useState } from 'react';
import AdminService from '../../service/admin.service';
import { IAnnouncement } from "../../model/IAnnouncement";
import { API_URL } from "../../../const";
import AnnouncementService from "../../service/announcement.service";
import { MdDelete, MdEdit, MdPushPin } from "react-icons/md";


const fetchRolesFromApi = async (token: string): Promise<string[]> => {
    const response = await fetch(`http://localhost:8082/security/get-roles`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
    }

    return await response.json();
};

interface IRole {
    id: number;
    name: string;
}

interface IUser {
    id: number;
    username: string;
    email: string;
    isActivated: boolean;
    roles: IRole[];
}

const AdminPanel: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    const [users, setUsers] = useState<IUser[]>([]);
    const [error, setError] = useState('');
    const [pageSize] = useState(10);
    const [offset, setOffset] = useState(0);
    const [field] = useState('id');

    const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedSection, setSelectedSection] = useState<'users' | 'announcements' | 'permissions'>('users');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editAnnouncement, setEditAnnouncement] = useState<IAnnouncement | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

    const [roles, setRoles] = useState<string[]>([]);
    const [newRole, setNewRole] = useState('');

    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<IUser | null>(null); // user do edycji
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setHasAccess(false);
            setIsLoading(false);
            return;
        }

        fetchRolesFromApi(token)
            .then((fetchedRoles) => {
                if (fetchedRoles.includes("ROLE_ADMIN")) {
                    setHasAccess(true);
                } else {
                    setHasAccess(false);
                }
            })
            .catch((err) => {
                console.error("Błąd przy pobieraniu ról:", err);
                setHasAccess(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!hasAccess) return;

        if (selectedSection === 'announcements') {
            AnnouncementService.findAllAnnouncements(currentPage)
                .then(response => {
                    const data = response.data;
                    setTotalPages(data.totalPages);
                    setAnnouncements(data.announcements);
                })
                .catch(console.error);
        }

        if (selectedSection === 'permissions') {
            fetchRoles();
        }
    }, [hasAccess, currentPage, selectedSection]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await AdminService.getUsers(pageSize, offset, field, token || '');
            setUsers(data);
            setFilteredUsers(data);
            setError('');
        } catch (err) {
            setError('Nie udało się pobrać listy użytkowników.');
            console.error(err);
        }
    };


    useEffect(() => {
        if (!hasAccess) return;
        if (selectedSection === 'users') {
            fetchUsers();
        }
    }, [hasAccess, offset, selectedSection]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const filtered = users.filter((user) =>
            user.username.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleDeleteUser = (id: number) => {
        if (window.confirm("Czy na pewno chcesz usunąć trwale konto tego użytkownika?")) {
            const token = localStorage.getItem('token');
            AdminService.deleteUser(id, token || '')
                .then(() => {
                    setFilteredUsers((prev) => prev.filter(u => u.id !== id));
                })
                .catch(console.error);
        }
    };

    const handleEditUser = async (user: IUser) => {
        setEditUser(user);

        try {
            await fetchRoles();
            const available = roles.filter((roleString) =>
                !user.roles.some((r) => r.name === roleString)
            );
            setAvailableRoles(available);
        } catch (error) {
            console.error('Błąd podczas pobierania ról:', error);
        }
        setIsEditUserModalOpen(true);
    };

    const handleSaveUserEdit = async () => {
        if (!editUser) return;
        try {
            const token = localStorage.getItem('token');
            const updatedUser = {
                id: editUser.id,
                username: editUser.username,
                email: editUser.email,
                roles: editUser.roles, // array of { id, name }
            };
            await fetch(`${API_URL}/user/edit-user?user-id=${editUser.id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            setIsEditUserModalOpen(false);
            await fetchUsers();
        } catch (error) {
            console.error('Błąd podczas zapisywania zmian użytkownika:', error);
        }
    };

    const toggleUserRole = (roleName: string) => {
        if (!editUser) return;

        const hasRole = editUser.roles.some((r) => r.name === roleName);

        if (hasRole) {
            const updatedRoles = editUser.roles.filter((r) => r.name !== roleName);
            setEditUser({ ...editUser, roles: updatedRoles });
            setAvailableRoles((prev) => [...prev, roleName]);
        } else {
            const newRoleObj: IRole = { id: Date.now(), name: roleName };
            const updatedRoles = [...editUser.roles, newRoleObj];
            setEditUser({ ...editUser, roles: updatedRoles });
            setAvailableRoles((prev) => prev.filter((r) => r !== roleName));
        }
    };

    const nextPage = () => setOffset((prev) => prev + pageSize);
    const prevPage = () => setOffset((prev) => Math.max(0, prev - pageSize));

    const handleDelete = (id: number) => {
        if (window.confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) {
            AnnouncementService.deleteAnnouncement(id)
                .then(() => {
                    setAnnouncements((prev) => prev.filter(a => a.id !== id));
                })
                .catch(console.error);
        }
    };

    // PRZYPINANIE/ODPINANIE OGŁOSZENIA
    const handlePinToggle = (id: number) => {
        const announcement = announcements.find(a => a.id === id);
        if (!announcement) return;

        AnnouncementService.togglePinAnnouncement(announcement, !announcement.pinned)
            .then(() => {
                setAnnouncements((prev) =>
                    prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a)
                );
            })
            .catch(console.error);
    };

    const handleEdit = (announcement: IAnnouncement) => {
        setEditAnnouncement(announcement);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (!editAnnouncement) return;
        AnnouncementService.togglePinAnnouncement(editAnnouncement, editAnnouncement.pinned)
            .then(() => {
                setAnnouncements((prev) =>
                    prev.map(a => (a.id === editAnnouncement.id ? editAnnouncement : a))
                );
                handleCloseEditModal();
            })
            .catch(console.error);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditAnnouncement(null);
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/role/get`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            // zamieniamy np. [{name: "ROLE_ADMIN"}, ...] na ["ROLE_ADMIN", ...]
            const rolesFromApi = data.map((role: { name: string }) => role.name);
            setRoles(rolesFromApi);
        } catch (error) {
            console.error('Błąd podczas pobierania ról:', error);
        }
    };

    const handleDeleteRole = async (role: string) => {
        if (window.confirm(`Czy na pewno chcesz usunąć rolę "${role}"?`)) {
            const token = localStorage.getItem('token');
            try {
                await fetch(`${API_URL}/role/delete?role=${role}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRoles((prev) => prev.filter((r) => r !== role));
            } catch (error) {
                console.error('Błąd podczas usuwania roli:', error);
            }
        }
    };

    const handleAddRole = async () => {
        if (!newRole) return;
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_URL}/role/add?role=${newRole}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setNewRole('');
            fetchRoles();
        } catch (error) {
            console.error('Błąd podczas dodawania roli:', error);
        }
    };

    const renderUsers = () => (
        <>
            <input
                type="text"
                placeholder="Wyszukaj użytkownika po nazwie..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            />
            <h1 className="text-2xl font-bold mb-4">Panel Administratora - Użytkownicy</h1>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Nazwa użytkownika</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Aktywowany</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Akcje</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700">{user.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{user.username}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                            {user.isActivated ? 'Tak' : 'Nie'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700 space-x-2">
                            <button
                                onClick={() => handleEditUser(user)}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                                Edytuj
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                                Usuń
                            </button>
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
        </>
    );

    const renderAnnouncements = () => {
        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        };

        return (
            <>
                <h2 className="text-xl font-bold mb-4">Ogłoszenia</h2>
                {announcements.length === 0 && <p>Brak ogłoszeń</p>}
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className={`p-6 border rounded-lg shadow-md bg-white ${
                                announcement.pinned ? 'bg-yellow-50 border-yellow-400' : 'border-gray-300'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                                {announcement.pinned && (
                                    <span className="px-3 py-1 text-sm font-bold text-yellow-700 bg-yellow-100 rounded">
                    Przypięte
                  </span>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                                <strong>Dodano:</strong> {formatDate(announcement.createdAt)}
                            </p>
                            <p className="text-gray-600 text-sm mb-4">
                                <strong>Autor:</strong> {announcement.creator}
                            </p>
                            <p className="text-gray-700">{announcement.content}</p>
                            <div className="flex space-x-4 mt-4">
                                <button
                                    onClick={() => handlePinToggle(announcement.id)}
                                    className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition duration-300"
                                >
                                    <MdPushPin className="mr-2"/>
                                    {announcement.pinned ? 'Odepnij' : 'Przypnij'}
                                </button>
                                <button
                                    onClick={() => handleEdit(announcement)}
                                    className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-300"
                                >
                                    <MdEdit className="mr-2"/> Edytuj
                                </button>
                                <button
                                    onClick={() => handleDelete(announcement.id)}
                                    className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition duration-300"
                                >
                                    <MdDelete className="mr-2"/> Usuń
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`mx-1 px-3 py-1 border rounded ${
                                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </>
        );
    };

    const renderPermissions = () => (
        <div className="flex">
            {/* Lista ról */}
            <div className="w-1/3 p-4 bg-gray-100">
                <h3 className="text-lg font-semibold mb-4">Role</h3>
                <ul>
                    {roles.map((role, index) => (
                        <li key={index} className="mb-2 flex justify-between items-center">
                            <span>{role}</span>
                            <button
                                onClick={() => handleDeleteRole(role)}
                                className="text-red-500 hover:text-red-700 transition duration-200"
                            >
                                Usuń
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Dodawanie nowej roli */}
            <div className="w-2/3 p-4">
                <h3 className="text-lg font-semibold mb-4">Dodaj rolę</h3>
                <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                    placeholder="Nowa rola"
                />
                <button
                    onClick={handleAddRole}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Dodaj rolę
                </button>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="p-4">
                <h2>Ładowanie...</h2>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="p-4 text-red-600">
                <h2>Brak dostępu do tej strony.</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-hidden">
            <header className="bg-gray-600 text-white p-4 flex-shrink-0">
                <h1 className="text-xl">Panel Administratora</h1>
            </header>
            <div className="flex flex-grow overflow-hidden">
                <aside className="w-64 h-full bg-gray-100 p-4 border-r flex-shrink-0">
                    <div className="space-y-4">
                        <button
                            className={`block w-fit text-left px-4 py-2 rounded ${
                                selectedSection === 'users' ? 'bg-gray-300' : ''
                            }`}
                            onClick={() => setSelectedSection('users')}
                        >
                            Zarządzaj użytkownikami
                        </button>
                        <button
                            className={`block w-fit text-left px-4 py-2 rounded ${
                                selectedSection === 'announcements' ? 'bg-gray-300' : ''
                            }`}
                            onClick={() => setSelectedSection('announcements')}
                        >
                            Zarządzaj ogłoszeniami
                        </button>
                        <button
                            className={`block w-fit text-left px-4 py-2 rounded ${
                                selectedSection === 'permissions' ? 'bg-gray-300' : ''
                            }`}
                            onClick={() => setSelectedSection('permissions')}
                        >
                            Zarządzaj uprawnieniami
                        </button>
                    </div>
                </aside>

                <main className="flex-grow p-4 overflow-hidden">
                    {selectedSection === 'permissions'
                        ? renderPermissions()
                        : selectedSection === 'users'
                            ? renderUsers()
                            : renderAnnouncements()}

                    {/* Modal do edycji użytkownika */}
                    {isEditUserModalOpen && editUser && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                <h2 className="text-xl font-bold mb-4">Edytuj Użytkownika</h2>
                                <p className="mb-4">Nazwa użytkownika: {editUser.username}</p>
                                <div className="flex">
                                    {/* Role użytkownika */}
                                    <div className="w-1/2 p-4 border-r">
                                        <h3 className="font-semibold mb-2">Role użytkownika:</h3>
                                        <ul>
                                            {editUser.roles.map((role) => (
                                                <li key={role.id} className="flex justify-between items-center">
                                                    <span>{role.name}</span>
                                                    <button
                                                        onClick={() => toggleUserRole(role.name)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Usuń
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Dostępne role */}
                                    <div className="w-1/2 p-4">
                                        <h3 className="font-semibold mb-2">Dostępne role:</h3>
                                        <ul>
                                            {availableRoles
                                                .filter((roleName) => !editUser.roles.some((r) => r.name === roleName))
                                                .map((roleName) => (
                                                    <li key={roleName} className="flex justify-between items-center">
                                                        <span>{roleName}</span>
                                                        <button
                                                            onClick={() => toggleUserRole(roleName)}
                                                            className="text-green-500 hover:text-green-700"
                                                        >
                                                            Dodaj
                                                        </button>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => setIsEditUserModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        Anuluj
                                    </button>
                                    <button
                                        onClick={handleSaveUserEdit}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Zapisz
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal do edycji ogłoszenia */}
                    {isEditModalOpen && editAnnouncement && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                <h2 className="text-xl font-bold mb-4">Edytuj Ogłoszenie</h2>
                                <input
                                    type="text"
                                    value={editAnnouncement.title}
                                    onChange={(e) =>
                                        setEditAnnouncement({ ...editAnnouncement, title: e.target.value })
                                    }
                                    className="w-full p-2 border rounded mt-2"
                                />
                                <textarea
                                    value={editAnnouncement.content}
                                    onChange={(e) =>
                                        setEditAnnouncement({ ...editAnnouncement, content: e.target.value })
                                    }
                                    className="w-full p-2 border rounded mt-2"
                                />
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 transition duration-200"
                                    >
                                        Anuluj
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                                    >
                                        Zapisz
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
