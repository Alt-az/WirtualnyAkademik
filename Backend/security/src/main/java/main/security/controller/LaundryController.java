package main.security.controller;

import jakarta.persistence.Entity;
import main.security.model.Laundry;
import main.security.model.UserLaundry;
import main.security.service.JWTService;
import main.security.service.LaundryService;
import main.security.service.UserService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/laundry")
public class LaundryController {

    LaundryService laundryService;
    UserService userService;

    JWTService jwtService;

    public LaundryController(LaundryService laundryService, JWTService jwtService, UserService userService) {
        this.laundryService = laundryService;
        this.jwtService = jwtService;
        this.userService = userService;
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

}
