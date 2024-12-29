package main.security.controller;

import jakarta.persistence.Entity;
import main.security.model.Laundry;
import main.security.service.JWTService;
import main.security.service.LaundryService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/laundry")
public class LaundryController {

    LaundryService laundryService;

    JWTService jwtService;

    public LaundryController(LaundryService laundryService, JWTService jwtService) {
        this.laundryService = laundryService;
        this.jwtService = jwtService;
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

        laundryService.addLaundry(laundryDC);
        return ResponseEntity.ok("Laundry added successfully");
    }

}
