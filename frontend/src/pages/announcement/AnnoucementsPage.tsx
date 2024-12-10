import React, { useState, useEffect } from 'react';
import { MdDelete, MdEdit, MdPushPin } from "react-icons/md";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './styles.css';
import { IAnnouncement } from "../../model/IAnnouncement.ts";
import AnnouncementService from "../../service/announcement.service.ts";

const AnnouncementsPage = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState<IAnnouncement | null>(null);

  useEffect(() => {
    AnnouncementService.findAllAnnouncements(currentPage).then(response => {
      const data = response.data;
      setTotalPages(data.totalPages);
      setAnnouncements(data.announcements);
    }).catch(console.error);
  }, [currentPage]);

  const handleShowMore = (announcement: IAnnouncement) => setSelectedAnnouncement(announcement);
  const handleCloseShowMoreModal = () => setSelectedAnnouncement(null);
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
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tablica ogłoszeń</h1>
        {announcements.length === 0 && <p>Brak ogłoszeń</p>}

        <TransitionGroup className="space-y-4">
          {announcements?.map(announcement => (
              <CSSTransition key={announcement.id} timeout={300} classNames="announcement">
                <div className={`p-4 border rounded-lg shadow-md bg-white ${announcement.pinned ? 'bg-yellow-100' : ''}`}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{announcement.title}</h2>
                    <div className="flex space-x-2">
                      {/*<button onClick={() => handlePinToggle(announcement.id)}
                              className="text-yellow-500 hover:text-yellow-700 transition duration-200">
                        <MdPushPin className="inline-block mr-1" /> {announcement.pinned ? 'Odepnij' : 'Przypnij'}
                      </button>
                      <button onClick={() => handleEdit(announcement)}
                              className="text-blue-500 hover:text-blue-700 transition duration-200">
                        <MdEdit className="inline-block mr-1" /> Edytuj
                      </button>
                      <button onClick={() => handleDelete(announcement.id)}
                              className="text-red-500 hover:text-red-700 transition duration-200">
                        <MdDelete className="inline-block mr-1" /> Usuń
                      </button>*/}
                    </div>
                  </div>
                  <p className="text-gray-600">{announcement.createdAt} - {announcement.creator}</p>
                  {announcement.pinned && <p className="text-red-500 font-bold">Przypięte</p>}
                  <p className="mt-2">{announcement.content.length > 200 ? `${announcement.content.substring(0, 100)}...` : announcement.content}</p>
                  <button onClick={() => handleShowMore(announcement)}
                          className="mt-2 text-blue-500 hover:text-blue-700 transition duration-200">Pokaż więcej
                  </button>
                </div>
              </CSSTransition>
          ))}
        </TransitionGroup>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}>
                {index + 1}
              </button>
          ))}
        </div>
        <CSSTransition
            in={!!selectedAnnouncement}
            timeout={300}
            classNames="modal"
            unmountOnExit
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-semibold">{selectedAnnouncement?.title}</h2>
              <p className="text-gray-600">{selectedAnnouncement?.createdAt} - {selectedAnnouncement?.creator}</p>
              <p className="mt-2">{selectedAnnouncement?.content}</p>
              <button onClick={handleCloseShowMoreModal} className="mt-4 text-blue-500 hover:text-blue-700 transition duration-200">Zamknij</button>
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
            in={isEditModalOpen}
            timeout={300}
            classNames="modal"
            unmountOnExit
        >
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
        </CSSTransition>
      </div>
  );
};

export default AnnouncementsPage;