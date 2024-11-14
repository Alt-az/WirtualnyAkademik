package main.security.service;

import main.security.model.Users;
import main.security.model.ValidationCode;
import main.security.repo.ValidationCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
@Service
public class ValidationCodeService {
    @Autowired
    private ValidationCodeRepository validationCodeRepository;

    ValidationCodeService(ValidationCodeRepository validationCodeRepository) {
        this.validationCodeRepository = validationCodeRepository;
    }

    public void removeValidationCode(long id) {
        validationCodeRepository.deleteById(id);
    }

    public void addValidationCode(Users user) {
        ValidationCode c = new ValidationCode();
        c.setCode(generateActivationCode());
        c.setUser(user);

        LocalDateTime now = LocalDateTime.now();
        c.setCreatedAt(now);
        c.setExpiresAt(now.plusMinutes(1));

        validationCodeRepository.save(c);
    }
    public ValidationCode getValidationCode(Users user) {
        return validationCodeRepository.findByUser(user);
    }
    public ValidationCode findByCode(String code) {
        return validationCodeRepository.findByCode(code);
    }

    public void save(ValidationCode validationCode) {
        validationCodeRepository.save(validationCode);
    }

    @Scheduled(fixedRate = 30 * 1000)
    public void deleteExpiredValidationCodes()
    {
        List<ValidationCode> toDelete = validationCodeRepository.findAllByisActivatedIsFalse();
        System.out.println(toDelete);
        for(ValidationCode c:toDelete)
        {
            if(c.getExpiresAt().isBefore(LocalDateTime.now()))
            {
                validationCodeRepository.delete(c);
            }
        }

    }
    public static String generateActivationCode() {
        return UUID.randomUUID().toString();
    }
}
