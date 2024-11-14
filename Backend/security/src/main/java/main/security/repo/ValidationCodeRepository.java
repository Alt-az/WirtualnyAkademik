package main.security.repo;

import main.security.model.Users;
import main.security.model.ValidationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValidationCodeRepository extends JpaRepository<ValidationCode, Long> {
    ValidationCode deleteById(long id);
    ValidationCode findByCode(String code);
    ValidationCode findByUser(Users user);
    List<ValidationCode> findAllByisActivatedIsFalse();
}
