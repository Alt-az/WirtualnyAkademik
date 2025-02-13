package main.security.validator;

import main.security.model.User;
import main.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.regex.Pattern;

@Component
public class UserValidator implements Validator {

    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    @Autowired
    private UserService userService;

    @Override
    public boolean supports(Class<?> clazz) {
        return User.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        User user = (User) target;

        if (user.getUsername() == null || user.getUsername().length() < 5) {
            errors.rejectValue("username", "user.username.tooShort", "Login musi mieć co najmniej 5 znaków.");
        } else if (userService.existsByUsername(user.getUsername())) {
            errors.rejectValue("username", "user.username.exists", "Login jest już zajęty.");
        }

        if (user.getPassword() == null || !PASSWORD_PATTERN.matcher(user.getPassword()).matches()) {
            errors.rejectValue("password", "user.password.invalid", "Hasło musi mieć co najmniej 8 znaków, zawierać małą i dużą literę oraz cyfrę.");
        }

        if (user.getName() == null || user.getName().isEmpty()) {
            errors.rejectValue("name", "user.name.empty", "Imię nie może być puste.");
        }

        if (user.getSurname() == null || user.getSurname().isEmpty()) {
            errors.rejectValue("surname", "user.surname.empty", "Nazwisko nie może być puste.");
        }

        if (user.getEmail() == null || !EMAIL_PATTERN.matcher(user.getEmail()).matches()) {
            errors.rejectValue("email", "user.email.invalid", "Podaj poprawny adres email.");
        } else if (userService.existsByEmail(user.getEmail())) {
            errors.rejectValue("email", "user.email.exists", "Email jest już zajęty.");
        }
    }
}
