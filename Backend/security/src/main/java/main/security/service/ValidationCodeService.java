package main.security.service;

import main.security.model.User;
import main.security.model.ValidationCode;
import main.security.repo.UserRepo;
import main.security.repo.ValidationCodeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ValidationCodeService {

    Logger LOG = LoggerFactory.getLogger(ValidationCodeService.class);

    private final ValidationCodeRepository validationCodeRepository;
    private final UserRepo userRepository;

    ValidationCodeService(ValidationCodeRepository validationCodeRepository, UserRepo userRepository) {
        this.validationCodeRepository = validationCodeRepository;
        this.userRepository = userRepository;
    }

    public void removeValidationCode(long id) {
        validationCodeRepository.deleteById(id);
    }

    public void addValidationCode(User user) {
        ValidationCode c = new ValidationCode();
        c.setCode(generateActivationCode());
        c.setUser(user);

        LocalDateTime now = LocalDateTime.now();
        c.setCreatedAt(now);
        c.setExpiresAt(now.plusMinutes(1));

        validationCodeRepository.save(c);
    }

    public ValidationCode getValidationCode(User user) {
        return validationCodeRepository.findByUser(user);
    }

    public ValidationCode findByCode(String code) {
        return validationCodeRepository.findByCode(code);
    }

    public void save(ValidationCode validationCode) {
        validationCodeRepository.save(validationCode);
    }

    @Scheduled(fixedRate = 60 * 1000)
    public void deleteExpiredValidationCodes() {
        List<ValidationCode> toDelete = validationCodeRepository.findAllByisActivatedFalse();

        for (ValidationCode c : toDelete) {
            if (c.getExpiresAt().isBefore(LocalDateTime.now())) {
                User userToDelete = c.getUser();
                LOG.info("Deleting expired validation code: " + c);
                validationCodeRepository.delete(c);

                LOG.info("Deleting not activated user: " + userToDelete);
                userRepository.delete(userToDelete);
            }
        }

    }

    public static String generateActivationCode() {
        return UUID.randomUUID().toString();
    }

    public boolean isCodeExpired(ValidationCode validationCode) {
        return validationCode.getExpiresAt().isBefore(LocalDateTime.now());
    }
    public boolean deleteValidationCodeByUser(User user) {
        ValidationCode validationCode = validationCodeRepository.findByUser(user);
        validationCodeRepository.delete(validationCode);
        return true;
    }
}
