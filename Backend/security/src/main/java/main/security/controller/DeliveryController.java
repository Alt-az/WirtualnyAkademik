package main.security.controller;

import main.security.model.Delivery;
import main.security.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Delivery>> getDeliveriesByUserId(@PathVariable Long userId) {
        List<Delivery> deliveries = deliveryService.getDeliveriesByUserId(userId);
        return ResponseEntity.ok(deliveries);
    }


    @PutMapping("/pickup/{deliveryId}")
    public ResponseEntity<Delivery> pickUpPackage(@PathVariable Long deliveryId) {
        Delivery delivery = deliveryService.pickUpPackage(deliveryId);
        if (delivery == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(delivery);
    }
}