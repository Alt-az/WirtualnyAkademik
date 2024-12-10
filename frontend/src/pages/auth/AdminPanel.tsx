import React, { useEffect, useState } from 'react';
import AdminService from '../../service/admin.service.ts';
import { IAnnouncement } from "../../model/IAnnouncement.ts";
import AnnouncementService from "../../service/announcement.service.ts";



const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [pageSize] = useState(10); // Liczba użytkowników na stronę
    const [offset, setOffset] = useState(0); // Obecny offset (dla paginacji)
    const [field] = useState('id'); // Pole do sortowania
    const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncement | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editAnnouncement, setEditAnnouncement] = useState<IAnnouncement | null>(null);

    useEffect(() => {
        AnnouncementService.findAllAnnouncements(currentPage)
            .then(response => {
                const data = response.data;
                setTotalPages(data.totalPages);
                setAnnouncements(data.announcements);
            })
            .catch(console.error);
    }, [currentPage]);

    const handleEdit = (announcement: IAnnouncement) => {
        setEditAnnouncement(announcement);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditAnnouncement(null);
    };

    const handleSaveEdit = () => {
        if (editAnnouncement) {
            AnnouncementService.togglePinAnnouncement(editAnnouncement, editAnnouncement.pinned).then(() => {
                setAnnouncements(announcements.map(a => a.id === editAnnouncement.id ? editAnnouncement : a));
                handleCloseEditModal();
            }).catch(console.error);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) {
            AnnouncementService.deleteAnnouncement(id).then(() => {
                setAnnouncements(announcements.filter(a => a.id !== id));
            }).catch(console.error);
        }
    };

    const handlePinToggle = (id: number) => {
        const announcement = announcements.find(a => a.id === id);
        if (announcement) {
            AnnouncementService.togglePinAnnouncement(announcement, !announcement.pinned).then(() => {
                setAnnouncements(announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
            }).catch(console.error);
        }
    };


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
            <h2 className="text-xl font-bold mt-8 mb-4">Ogłoszenia</h2>
            {announcements.length === 0 && <p>Brak ogłoszeń</p>}

            <div className="space-y-4">
                {announcements.map(announcement => (
                    <div key={announcement.id}
                         className={`p-4 border rounded-lg shadow-md bg-white ${announcement.pinned ? 'bg-yellow-100' : ''}`}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">{announcement.title}</h3>
                            <div className="flex space-x-2">
                                <button onClick={() => handlePinToggle(announcement.id)}
                                        className="text-yellow-500 hover:text-yellow-700 transition duration-200">
                                    {announcement.pinned ? 'Odepnij' : 'Przypnij'}
                                </button>
                                <button onClick={() => handleEdit(announcement)}
                                        className="text-blue-500 hover:text-blue-700 transition duration-200">
                                    Edytuj
                                </button>
                                <button onClick={() => handleDelete(announcement.id)}
                                        className="text-red-500 hover:text-red-700 transition duration-200">
                                    Usuń
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-600">{announcement.createdAt} - {announcement.creator}</p>
                        {announcement.pinned && <p className="text-red-500 font-bold">Przypięte</p>}
                        <p className="mt-2">{announcement.content.length > 100 ? `${announcement.content.substring(0, 100)}...` : announcement.content}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-4">
                {Array.from({length: totalPages}, (_, index) => (
                    <button key={index + 1} onClick={() => setCurrentPage(index + 1)}
                            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}>
                        {index + 1}
                    </button>
                ))}
            </div>
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-semibold">Edytuj ogłoszenie</h2>
                        <input type="text" value={editAnnouncement?.title} onChange={(e) => setEditAnnouncement({ ...editAnnouncement, title: e.target.value })} className="w-full p-2 border rounded mt-2" />
                        <textarea value={editAnnouncement?.content} onChange={(e) => setEditAnnouncement({ ...editAnnouncement, content: e.target.value })} className="w-full p-2 border rounded mt-2" />
                        <div className="flex justify-end space-x-2 mt-4">
                            <button onClick={handleCloseEditModal} className="text-gray-500 hover:text-gray-700 transition duration-200">Anuluj</button>
                            <button onClick={handleSaveEdit} className="text-blue-500 hover:text-blue-700 transition duration-200">Zapisz</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminPanel;
