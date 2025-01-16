package main.security.controller;

import jakarta.persistence.Entity;
import main.security.model.Laundry;
import main.security.model.User;
import main.security.model.UserLaundry;
import main.security.model.UserRole;
import main.security.repo.UserRepo;
import main.security.service.JWTService;
import main.security.service.LaundryService;
import main.security.service.UserService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/laundry")
public class LaundryController {

    LaundryService laundryService;
    UserService userService;

    JWTService jwtService;

    UserRepo userRepo;

    public LaundryController(LaundryService laundryService, JWTService jwtService, UserService userService, UserRepo userRepo) {
        this.laundryService = laundryService;
        this.jwtService = jwtService;
        this.userService = userService;
        this.userRepo = userRepo;
    }

    @PostMapping("/updateLaundry/{id}")
    public ResponseEntity<String> updateLaundry(Long id) {
        laundryService.updateLaundry(id);
        return ResponseEntity.ok("Laundry updated successfully");
    }

    @GetMapping("/laundry-slots")
    public ResponseEntity<List<Laundry>> getLaundriesByMonth(@RequestParam String month, @RequestParam String year) {
        System.out.println(month + " " + year);
        laundryService.getLaundriesByMonth(Integer.parseInt(month), Integer.parseInt(year));
        return ResponseEntity.ok(laundryService.getLaundriesByMonth(Integer.parseInt(month), Integer.parseInt(year)));
    }

    @PostMapping("/laundry-slots")
    public ResponseEntity<String> addLaundry(@RequestBody Laundry laundry, @RequestHeader("Authorization") String token) {
        System.out.println(laundry);
        System.out.println(token);
        System.out.println(jwtService.extractUserName(token.replaceAll("Bearer ", "")));
        Laundry laundryDC = new Laundry(laundry);
        UserLaundry userLaundry = new UserLaundry();
        String username = jwtService.extractUserName(token.replaceAll("Bearer ", ""));
        userLaundry.setUser(userService.getUserByName(username));
        laundryService.addLaundry(laundryDC);
        userLaundry.setLaundry(laundryService.getLaundryByStartTime(laundryDC.getStartTime()));
        userLaundry.setUser(userService.getUserByName(username));
        laundryService.addUserLaundry(userLaundry);
        return ResponseEntity.ok("Laundry added successfully");
    }

    @GetMapping("/user-laundries")
    public ResponseEntity<List<UserLaundry>> userLaundries(@RequestHeader("Authorization") String token){
        System.out.println("Weszliśmy");
        String username = jwtService.extractUserName(token.replaceAll("Bearer ", ""));

        User user = userRepo.findByUsername(username);

        List<UserLaundry> userLaundries =laundryService.getLaundryForUser(user.getId());

        return ResponseEntity.ok(userLaundries);
    }

    @DeleteMapping("/cancelReservation")
    public ResponseEntity<String> cancelLaundry(
            @RequestHeader("Authorization") String token,
            @RequestParam("id") Long userLaundryId) {

        String username = jwtService.extractUserName(token.replace("Bearer ", ""));

        User user = userRepo.findByUsername(username);

        boolean isDeleted = laundryService.deleteUserLaundry(user.getId(), userLaundryId);

        if (isDeleted) {
            return ResponseEntity.ok("Laundry reservation removed");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized to delete this reservation");
        }
    }

}
