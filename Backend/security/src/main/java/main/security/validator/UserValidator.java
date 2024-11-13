package main.security.validator;

import main.security.model.Users;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.regex.Pattern;

@Component
public class UserValidator implements Validator {

    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$");

    @Override
    public boolean supports(Class<?> clazz) {
        return Users.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        Users user = (Users) target;

        if (user.getUsername() == null || user.getUsername().length() < 5) {
            errors.rejectValue("username", "user.username.tooShort", "Login musi mieć co najmniej 5 znaków.");
        }

        if (user.getPassword() == null || !PASSWORD_PATTERN.matcher(user.getPassword()).matches()) {
            errors.rejectValue("password", "user.password.invalid",
                    "Hasło musi mieć co najmniej 8 znaków, zawierać małą i dużą literę oraz cyfrę.");
        }
    }

}
