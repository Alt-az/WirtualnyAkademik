import React, { useEffect, useState } from 'react';
import AdminService from '../../service/admin.service.ts';
import { IAnnouncement } from "../../model/IAnnouncement.ts";
import AnnouncementService from "../../service/announcement.service.ts";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [pageSize] = useState(10);
    const [offset, setOffset] = useState(0);
    const [field] = useState('id');
    const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedSection, setSelectedSection] = useState('users');

    useEffect(() => {
        if (selectedSection === 'announcements') {
            AnnouncementService.findAllAnnouncements(currentPage)
                .then(response => {
                    const data = response.data;
                    setTotalPages(data.totalPages);
                    setAnnouncements(data.announcements);
                })
                .catch(console.error);
        }
    }, [currentPage, selectedSection]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await AdminService.getUsers(pageSize, offset, field, token || '');
            setUsers(data);
            setError('');
        } catch (err) {
            setError('Nie udało się pobrać listy użytkowników.');
            console.error(err);
        }
    };

    useEffect(() => {
        if (selectedSection === 'users') fetchUsers();
    }, [offset, selectedSection]);

    const nextPage = () => setOffset((prev) => prev + pageSize);
    const prevPage = () => setOffset((prev) => Math.max(0, prev - pageSize));

    const renderUsers = () => (
        <>
            <h1 className="text-2xl font-bold mb-4">Panel Administratora - Użytkownicy</h1>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                <thead>
                <tr>
                    <th className="border border-gray-300 px-2 py-1">ID</th>
                    <th className="border border-gray-300 px-2 py-1">Nazwa użytkownika</th>
                    <th className="border border-gray-300 px-2 py-1">Email</th>
                    <th className="border border-gray-300 px-2 py-1">Aktywowany</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="border border-gray-300 px-2 py-1">{user.id}</td>
                        <td className="border border-gray-300 px-2 py-1">{user.username}</td>
                        <td className="border border-gray-300 px-2 py-1">{user.email}</td>
                        <td className="border border-gray-300 px-2 py-1">
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
        </>
    );

    const renderAnnouncements = () => {
        const formatDate = (dateString) => {
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
                        </div>
                    ))}
                </div>
            </>
        );
    };


    return (
        <div className="flex flex-col  overflow-hidden">
            <header className="bg-gray-600 text-white p-4 flex-shrink-0">
                <h1 className="text-xl">Panel Administratora</h1>
            </header>
            <div className="flex flex-grow overflow-hidden">
                <aside className="w-64 h-full bg-gray-100 p-4 border-r flex-shrink-0">
                    <div className="space-y-4">
                        <button
                            className={`block w-fit text-left px-4 py-2 rounded ${selectedSection === 'users' ? 'bg-gray-300' : ''}`}
                            onClick={() => setSelectedSection('users')}
                        >
                            Zarządzaj użytkownikami
                        </button>
                        <button
                            className={`block w-fit text-left px-4 py-2 rounded ${selectedSection === 'announcements' ? 'bg-gray-300' : ''}`}
                            onClick={() => setSelectedSection('announcements')}
                        >
                            Zarządzaj ogłoszeniami
                        </button>
                    </div>
                </aside>
                <main className="flex-grow p-4 overflow-hidden">
                    {selectedSection === 'users' ? renderUsers() : renderAnnouncements()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
