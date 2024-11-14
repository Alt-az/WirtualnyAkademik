package main.security.controller;

import jakarta.mail.MessagingException;
import main.security.model.UserRegistrationRequest;
import main.security.model.Users;
import main.security.service.EmailService;
import main.security.service.MyUserDetailsService;
import main.security.service.UserService;
import main.security.service.ValidationCodeService;
import main.security.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.validation.DataBinder;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/security")
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private ValidationCodeService validationCodeService;

    @Autowired
    private EmailService emailService;

    @Autowired
    MyUserDetailsService userDetailsService;

    @Autowired
    private UserValidator validator;


    //@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationRequest request) throws MessagingException {
        System.out.println("register");

        DataBinder binder = new DataBinder(request.getUser());
        binder.addValidators(validator);
        binder.validate();

        BindingResult result = binder.getBindingResult();

        if (result.hasErrors()) {
            Map<String, String> errorMessages = new HashMap<>();
            result.getFieldErrors().forEach(error -> {
                System.out.println(error.getField() + ": " + error.getDefaultMessage());
                errorMessages.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errorMessages);
        }

        Users registeredUser = service.register(request.getUser(), request.getRecaptchaToken());
        String token = service.generateToken(registeredUser);
        validationCodeService.addValidationCode(registeredUser);
        emailService.sendMail("Test",validationCodeService.getValidationCode(registeredUser).getCode(),"");
        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    //@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user) {
        System.out.println("login");
        String token = service.verify(user);

        if ("fail".equals(token)) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Niepoprawne dane logowania. Spróbuj ponownie.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        return ResponseEntity.ok("{\"token\": \"" + token + "\"}");
    }


    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        // Token w postaci "Bearer xyz"
        String jwt = token.substring(7);
        String username = service.extractUserName(jwt);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        try {
            if(service.validateToken(jwt, userDetails)){
                return ResponseEntity.ok().body("Token valid");
            } else{
                throw new Exception();
            }
        } catch (Exception e) {
            // Token niepoprawny, zwróć błąd
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }


    }

}
