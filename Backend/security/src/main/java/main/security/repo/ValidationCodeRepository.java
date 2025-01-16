package main.security.repo;

import main.security.model.User;
import main.security.model.ValidationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ValidationCodeRepository extends JpaRepository<ValidationCode, Long> {
    ValidationCode deleteById(long id);
    ValidationCode findByCode(String code);
    ValidationCode findByUser(User user);
    List<ValidationCode> findAllByisActivatedFalse();
}
