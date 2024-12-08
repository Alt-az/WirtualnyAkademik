package main.security.dto.response;

import java.time.LocalDateTime;

public record AnnouncementResponse(int id, String title, String content, String creator, LocalDateTime createdAt, boolean pinned) {
}
