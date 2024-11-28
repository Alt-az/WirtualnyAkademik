
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../service/axiosInstance';
import Announcement from "../../components/Announcement";

interface Creator {
    username: string;
    email: string;
}

interface AnnouncementData {
    id: number;
    title: string;
    content: string;
    creator: Creator;
    // createdAt?: string;
}

const AnnouncementsPage: React.FC = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
    const [pageNum, setPageNum] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get<AnnouncementData[]>(
                    `/announcement/show/page/${pageNum}`
                );

                const data = response.data;

                setAnnouncements(data);

                if (data.length < pageSize) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            } catch (error: any) {
                console.error('Błąd podczas pobierania ogłoszeń:', error);
                setAnnouncements([]);
                setHasMore(false);

                if (error.response && error.response.status === 401) {
                    alert("Twoja sesja wygasła. Proszę zalogować się ponownie.");
                    window.location.href = "/login";
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnnouncements();
    }, [pageNum]);

    const handleNextPage = () => {
        if (hasMore && !isLoading) {
            setPageNum(prevPageNum => prevPageNum + 1);
        }
    };

    const handlePrevPage = () => {
        if (pageNum > 1 && !isLoading) {
            setPageNum(prevPageNum => prevPageNum - 1);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ogłoszenia</h1>
            {isLoading ? (
                <p>Ładowanie...</p>
            ) : (
                <>
                    {announcements.length === 0 ? (
                        <p>Brak ogłoszeń.</p>
                    ) : (
                        announcements.map(announcement => (
                            <Announcement key={announcement.id} data={announcement} />
                        ))
                    )}
                </>
            )}
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                    onClick={handlePrevPage}
                    disabled={pageNum === 1 || isLoading}
                >
                    Poprzednia strona
                </button>
                <span>Strona {pageNum}</span>
                <button
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                    onClick={handleNextPage}
                    disabled={!hasMore || isLoading}
                >
                    Następna strona
                </button>
            </div>
            {!hasMore && announcements.length > 0 && (
                <p className="mt-4 text-center text-gray-500">Nie ma więcej ogłoszeń.</p>
            )}
        </div>
    );
};

export default AnnouncementsPage;
