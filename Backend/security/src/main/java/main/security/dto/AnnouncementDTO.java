package main.security.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnnouncementDTO {
    private int id;
    private String title;
    private String content;
    private boolean pinned;
}
