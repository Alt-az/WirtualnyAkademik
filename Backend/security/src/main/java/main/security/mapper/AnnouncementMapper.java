package main.security.mapper;

import main.security.dto.response.AnnouncementResponse;
import main.security.model.Announcement;

import java.util.List;

public class AnnouncementMapper {

    public static List<AnnouncementResponse> mapAnnoucementListToAnoucementResponseList(List<Announcement> announcementList) {
        return announcementList.stream()
                .map(AnnouncementMapper::mapAnnouncementToAnnouncementResponse)
                .toList();
    }

    public static AnnouncementResponse mapAnnouncementToAnnouncementResponse(Announcement announcement) {
        return new AnnouncementResponse(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getCreator().getUsername(),
                announcement.getCreatedAt(),
                announcement.isPinned()
        );
    }
}
