package main.security.service;

import main.security.model.Delivery;
import main.security.repo.DeliveryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepo deliveryRepo;


    public List<Delivery> getDeliveriesByUserId(Long userId) {
        return deliveryRepo.findByUser_Id(userId);
    }


    public Delivery pickUpPackage(Long deliveryId) {

        Delivery delivery = deliveryRepo.findById(deliveryId).orElse(null);
        if (delivery != null) {

            delivery.setDeliveredToStudentAt(LocalDateTime.now());
            return deliveryRepo.save(delivery);
        }
        return null;
    }
}