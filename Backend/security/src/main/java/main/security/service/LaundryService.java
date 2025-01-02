package main.security.service;

import jakarta.persistence.Access;
import main.security.model.Laundry;
import main.security.model.UserLaundry;
import main.security.repo.LaundryRepo;
import main.security.repo.UserLaundryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LaundryService {

    LaundryRepo laundryRepo;

    UserLaundryRepo userLaundryRepo;

    @Autowired
    public LaundryService(LaundryRepo laundryRepo, UserLaundryRepo userLaundryRepo) {
        this.laundryRepo = laundryRepo;
        this.userLaundryRepo = userLaundryRepo;
    }

    public void addLaundry(Laundry laundry) {
        laundryRepo.save(laundry);
    }
    public void updateLaundry(LocalDateTime dateTime) {
        Laundry laundry = laundryRepo.findByStartTime(dateTime);
        laundryRepo.save(laundry);
    }
    public void updateLaundry(Long id) {
        Laundry laundry = laundryRepo.findById(id);
        laundryRepo.save(laundry);
    }
    public List<Laundry> getLaundriesByMonth(int month, int year) {
        return laundryRepo.findByMonthAndYear(month, year);
    }

    public void addUserLaundry(UserLaundry userLaundry) {
        userLaundryRepo.save(userLaundry);
    }

    public Laundry getLaundryByStartTime(LocalDateTime dateTime) {
        return laundryRepo.findByStartTime(dateTime);
    }
}
