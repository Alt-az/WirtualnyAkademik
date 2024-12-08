import {IAnnouncement} from "./IAnnouncement.ts";

export interface IFindAllAnnouncementsResponse {
    totalPages: number;
    announcements: IAnnouncement[];
}