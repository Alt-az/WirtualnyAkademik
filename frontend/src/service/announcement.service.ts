import axiosInstance from './axiosInstance';
import {IAnnouncement} from "../model/IAnnouncement.ts";
import {IFindAllAnnouncementsResponse} from "../dto/response/IFindAllAnnouncementsResponse.ts";

export interface AnnouncementDTO {
    title: string;
    content: string;
}

class AnnouncementService {
    addAnnouncement(announcementData: AnnouncementDTO) {
        console.log('Wysyłanie żądania POST do /announcement/add:', announcementData);
        return axiosInstance.post('/announcement/add', announcementData);
    }

    findAllAnnouncements(pageNum: number) {
        return axiosInstance.get<IFindAllAnnouncementsResponse>(`/announcement/show/page/${pageNum}`);
    }

    deleteAnnouncement(id: number) {
        return axiosInstance.delete(`/announcement/delete/${id}`);
    }

    togglePinAnnouncement(announcement: IAnnouncement, pinned: boolean) {
        const body = {
            ...announcement,
            pinned: pinned,
        };

        return axiosInstance.put(`/announcement/edit`, body);
    }
}

export default new AnnouncementService();
