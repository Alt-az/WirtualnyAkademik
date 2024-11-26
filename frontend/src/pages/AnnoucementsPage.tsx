import React, { useState, useEffect } from 'react';
import { generateMockedAnnouncements } from "../utils/generateMockedAnnoucements.ts";

//TODO: add types when model is ready
const AnnouncementsPage = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage, setAnnouncementsPerPage] = useState(3);
  const [announcements, setAnnouncements] = useState(generateMockedAnnouncements());

  useEffect(() => {
    const calculateAnnouncementsPerPage = () => {
      const announcementHeight = 150; // Approximate height of one announcement in pixels
      const availableHeight = window.innerHeight - 450; // Subtract some space for header, footer, etc.
      const perPage = Math.floor(availableHeight / announcementHeight);
      setAnnouncementsPerPage(perPage);
    };

    calculateAnnouncementsPerPage();
    window.addEventListener('resize', calculateAnnouncementsPerPage);

    return () => {
      window.removeEventListener('resize', calculateAnnouncementsPerPage);
    };
  }, []);

  const handleShowMore = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleCloseModal = () => {
    setSelectedAnnouncement(null);
  };

  //TODO: implement
  const handleEdit = (id) => {
    console.log(`Edit announcement with id: ${id}`);
  };

  //TODO: implement
  const handleDelete = (id) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== id));
  };

  const handlePinToggle = (id) => {
    setAnnouncements(announcements.map(announcement =>
        announcement.id === id ? { ...announcement, pinned: !announcement.pinned } : announcement
    ));
  };

  const sortedAnnouncements = announcements.sort((a, b) => b.pinned - a.pinned);

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = sortedAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const totalPages = Math.ceil(sortedAnnouncements.length / announcementsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tablica ogłoszeń</h1>
        <div className="space-y-4">
          {currentAnnouncements.map(announcement => (
              <div key={announcement.id} className={`p-4 border rounded-lg shadow-md bg-white ${announcement.pinned ? 'bg-yellow-100' : ''}`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{announcement.title}</h2>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(announcement.id)} className="text-blue-500 hover:underline">Edytuj</button>
                    <button onClick={() => handleDelete(announcement.id)} className="text-red-500 hover:underline">Usuń</button>
                    <button onClick={() => handlePinToggle(announcement.id)} className="text-yellow-500 hover:underline">
                      {announcement.pinned ? 'Odepnij' : 'Przypnij'}
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">{announcement.date} - {announcement.user}</p>
                {announcement.pinned && <p className="text-red-500 font-bold">Przypięte</p>}
                <p className="mt-2">{announcement.content.length > 200 ? `${announcement.content.substring(0, 100)}...` : announcement.content}</p>
                <button
                    onClick={() => handleShowMore(announcement)}
                    className="mt-2 text-blue-500 hover:underline"
                >
                  Pokaż więcej
                </button>
              </div>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
              <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
              >
                {index + 1}
              </button>
          ))}
        </div>

        {selectedAnnouncement && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-semibold">{selectedAnnouncement.title}</h2>
                <p className="text-gray-600">{selectedAnnouncement.date} - {selectedAnnouncement.user}</p>
                <p className="mt-2">{selectedAnnouncement.content}</p>
                <button
                    onClick={handleCloseModal}
                    className="mt-4 text-blue-500 hover:underline"
                >
                  Zamknij
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default AnnouncementsPage;