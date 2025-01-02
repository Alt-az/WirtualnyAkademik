package main.security.service;

import main.security.dto.response.FindAllAnnouncementsResponse;
import main.security.mapper.AnnouncementMapper;
import main.security.model.Announcement;
import main.security.model.UserRole;
import main.security.repo.AnnouncementRepo;
import main.security.repo.UserRepo;
import main.security.repo.UserRoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    @Autowired
    AnnouncementRepo announcementRepo;

    @Autowired
    UserRoleRepo userRoleRepo;

    public Announcement addAnnouncement(Announcement announcement){

        System.out.println(announcement);

        announcementRepo.save(announcement);
        return announcement;
    }

    public Announcement editAnnouncement(int id, String newTitle, String newContent, int userId, boolean newIsPinned) {

        Announcement announcement = announcementRepo.findById(id).orElse(null);


        List<UserRole> userRoles = userRoleRepo.findByUserId(userId);
        if (announcement == null) {
            throw new IllegalArgumentException("Announcement not found with id: " + id);
        }

        //todo: Usunąć poniższe alternatywy kiedy zdecydujemy się na konkretną formę Admina
        boolean isAdmin = userRoles.stream()
                .anyMatch(role -> "Admin".equals(role.getName()) || "ROLE_ADMIN".equals(role.getName()) || "ADMIN".equals(role.getName()));

        if (!isAdmin) {
            throw new IllegalArgumentException("You are not authorized to edit this announcement.");
        }

        if (newTitle != null && !newTitle.isEmpty()) {
            announcement.setTitle(newTitle);
        }
        if (newContent != null && !newContent.isEmpty()) {
            announcement.setContent(newContent);
        }

        announcement.setPinned(newIsPinned);

        return announcementRepo.save(announcement);
    }

    public void deleteAnnouncement(int id, int userId) {
        Announcement announcement = announcementRepo.findById(id).orElse(null);
        List<UserRole> userRoles = userRoleRepo.findByUserId(userId);
        if (announcement == null) {
            throw new IllegalArgumentException("Announcement not found with id: " + id);
        }

        //todo: Usunąć poniższe alternatywy kiedy zdecydujemy się na konkretną formę Admina
        boolean isAdmin = userRoles.stream()
                .anyMatch(role -> "Admin".equals(role.getName()) || "ROLE_ADMIN".equals(role.getName()) || "ADMIN".equals(role.getName()));

        if (!isAdmin) {
            throw new IllegalArgumentException("You are not authorized to edit this announcement.");
        }

        announcementRepo.delete(announcement);
    }

    public FindAllAnnouncementsResponse getAllAnnouncements(int pageNum, int pageSize) {
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize);

        Page<Announcement> announcements = announcementRepo.findAllByOrderByPinnedDescIdDesc(pageable);

        return new FindAllAnnouncementsResponse(
                announcements.getTotalPages(),
                AnnouncementMapper.mapAnnoucementListToAnoucementResponseList(announcements.getContent())
        );
    }
}
