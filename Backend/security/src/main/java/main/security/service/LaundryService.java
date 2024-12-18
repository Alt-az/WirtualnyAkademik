package main.security.service;

import jakarta.persistence.Access;
import main.security.model.Laundry;
import main.security.repo.LaundryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LaundryService {

    LaundryRepo laundryRepo;

    @Autowired
    public LaundryService(LaundryRepo laundryRepo) {
        this.laundryRepo = laundryRepo;
    }

    public void addLaundry(Laundry laundry) {
        laundryRepo.save(laundry);
    }
    public void updateLaundry(LocalDateTime dateTime) {
        Laundry laundry = laundryRepo.findByDateOfLaundry(dateTime);
        laundryRepo.save(laundry);
    }
    public void updateLaundry(Long id) {
        Laundry laundry = laundryRepo.findById(id);
        laundryRepo.save(laundry);
    }
    public List<Laundry> getLaundriesByMonth(int month, int year) {
        return laundryRepo.findByMonthAndYear(month, year);
    }
}
