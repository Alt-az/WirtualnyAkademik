package main.security.controller;

import jakarta.servlet.http.HttpServletRequest;
import main.security.dto.AnnouncementDTO;
import main.security.dto.response.FindAllAnnouncementsResponse;
import main.security.model.Announcement;
import main.security.model.User;
import main.security.repo.UserRepo;
import main.security.service.AnnouncementService;
import main.security.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/announcement")
public class AnnouncementController {

    @Autowired
    AnnouncementService announcementService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JWTService jwtService;

    private ResponseEntity<User> getUserFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String token = authHeader.substring(7);
        String username;
        try {
            username = jwtService.extractUserName(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        User user = userRepo.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAnnouncement(@RequestBody AnnouncementDTO announcementDTO, HttpServletRequest request) {
        ResponseEntity<User> userResponse = getUserFromRequest(request);
        if (userResponse.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(userResponse.getStatusCode()).body("Token is missing, invalid, or user not found");
        }

        User creator = userResponse.getBody();
        if (creator == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        }

        Announcement announcement = new Announcement();
        announcement.setTitle(announcementDTO.getTitle());
        announcement.setContent(announcementDTO.getContent());
        announcement.setCreator(creator);
        announcement.setPinned(false);

        announcementService.addAnnouncement(announcement);

        String responseMessage = String.format(
                "Announcement added correctly by %s %s",
                creator.getName(),
                creator.getSurname()
        );

        return ResponseEntity.ok(responseMessage);
    }

    @PutMapping("/edit")
    public ResponseEntity<?> editAnnouncement(@RequestBody AnnouncementDTO announcementDTO, HttpServletRequest request) {
        ResponseEntity<User> userResponse = getUserFromRequest(request);
        if (userResponse.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(userResponse.getStatusCode()).body("Token is missing, invalid, or user not found");
        }

        User editor = userResponse.getBody();
        if (editor == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        }

        try {
            Announcement updatedAnnouncement = announcementService.editAnnouncement(
                    announcementDTO.getId(),
                    announcementDTO.getTitle(),
                    announcementDTO.getContent(),
                    editor.getId(),
                    announcementDTO.isPinned()
            );

            String responseMessage = String.format(
                    "Announcement with ID %d updated successfully by %s %s",
                    updatedAnnouncement.getId(),
                    editor.getName(),
                    editor.getSurname()
            );

            return ResponseEntity.ok(responseMessage);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable int id, HttpServletRequest request) {
        ResponseEntity<User> userResponse = getUserFromRequest(request);
        if (userResponse.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(userResponse.getStatusCode()).body("Token is missing, invalid, or user not found");
        }

        User user = userResponse.getBody();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        }

        try {
            announcementService.deleteAnnouncement(id, user.getId());
            return ResponseEntity.ok(String.format("Announcement with ID %d deleted successfully.", id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/show/page/{pageNum}")
    public ResponseEntity<?> getAllAnnouncements(
            @PathVariable int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        try {
            FindAllAnnouncementsResponse response = announcementService.getAllAnnouncements(pageNum, pageSize);

            if (response.announcements().isEmpty()) {
                return ResponseEntity.ok("No announcements found.");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
