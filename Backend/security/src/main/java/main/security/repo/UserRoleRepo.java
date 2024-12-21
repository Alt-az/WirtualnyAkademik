package main.security.repo;

import main.security.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRoleRepo extends JpaRepository<UserRole, Long> {
    void deleteByName(String name);

    @Query("SELECT ur FROM UserRole ur JOIN ur.users u WHERE u.id = :userId")
    List<UserRole> findByUserId(@Param("userId") Integer userId);
}
