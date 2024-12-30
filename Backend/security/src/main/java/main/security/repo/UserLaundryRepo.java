package main.security.repo;

import main.security.model.UserLaundry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserLaundryRepo extends JpaRepository<UserLaundry, Long> {

}
