import axiosInstance from './axiosInstance';

export interface AnnouncementDTO {
    title: string;
    content: string;
}

class AnnouncementService {
    addAnnouncement(announcementData: AnnouncementDTO) {
        console.log('Wysyłanie żądania POST do /announcement/add:', announcementData);
        return axiosInstance.post('/announcement/add', announcementData);
    }
}

export default new AnnouncementService();
