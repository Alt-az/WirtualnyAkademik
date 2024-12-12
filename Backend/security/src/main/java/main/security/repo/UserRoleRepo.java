package main.security.repo;

import main.security.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepo extends JpaRepository<UserRole, Long> {
    void deleteByName(String name);
}
