package main.security.repo;

import main.security.model.ValidationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ValidationCodeRepository extends JpaRepository<ValidationCode, Long> {
}
