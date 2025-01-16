package main.security.repo;

import main.security.model.UserLaundry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserLaundryRepo extends JpaRepository<UserLaundry, Long> {

    List<UserLaundry> findByUser_Id(int userId);

    void deleteById(Long id);


}
