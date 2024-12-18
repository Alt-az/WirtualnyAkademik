package main.security.controller;

import jakarta.persistence.Entity;
import main.security.model.Laundry;
import main.security.service.LaundryService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LaundryController {

    LaundryService laundryService;

    @PostMapping("/laundry")
    public ResponseEntity<String> addLaundry() {
        Laundry laundry = new Laundry();
        laundryService.addLaundry(laundry);
        return ResponseEntity.ok("Laundry added successfully");
    }

    @PostMapping("/laundry/{id}")
    public ResponseEntity<String> updateLaundry(Long id) {
        laundryService.updateLaundry(id);
        return ResponseEntity.ok("Laundry updated successfully");
    }

    @GetMapping("/laundries")
    public ResponseEntity<List<Laundry>> getLaundriesByMonth(@RequestParam String month, @RequestParam String year) {
        laundryService.getLaundriesByMonth(Integer.parseInt(month), Integer.parseInt(year));
        return ResponseEntity.ok(laundryService.getLaundriesByMonth(Integer.parseInt(month), Integer.parseInt(year)));
    }

}
