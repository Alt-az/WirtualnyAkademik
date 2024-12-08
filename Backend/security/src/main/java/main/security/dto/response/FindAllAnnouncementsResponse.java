package main.security.dto.response;

import java.util.List;

public record FindAllAnnouncementsResponse(int totalPages, List<AnnouncementResponse> announcements) {
}
