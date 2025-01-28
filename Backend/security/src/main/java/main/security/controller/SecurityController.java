package main.security.controller;

import jakarta.mail.MessagingException;
import main.security.model.UserRegistrationRequest;
import main.security.model.User;
import main.security.model.UserRole;
import main.security.service.*;
import main.security.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.validation.DataBinder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/security")
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SecurityController {

    private final UserService service;

    private final ValidationCodeService validationCodeService;

    private final EmailService emailService;

    MyUserDetailsService userDetailsService;

    private final UserValidator validator;

    private final UserRoleService userRoleService;

    private final UserService userService;


    @Autowired
    public SecurityController(UserService userService, UserRoleService userRoleService, UserService service, ValidationCodeService validationCodeService, EmailService emailService, MyUserDetailsService userDetailsService, UserValidator validator) {
        this.service = service;
        this.validationCodeService = validationCodeService;
        this.emailService = emailService;
        this.userDetailsService = userDetailsService;
        this.validator = validator;
        this.userRoleService = userRoleService;
        this.userService = userService;
    }

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

        User registeredUser = service.register(request.getUser(), request.getRecaptchaToken());
        String token = service.generateToken(registeredUser);
        validationCodeService.addValidationCode(registeredUser);
        emailService.sendMail("Test",validationCodeService.getValidationCode(registeredUser).getCode(),"");
        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    //@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        System.out.println("login");
        if(service.existsByUsername(this.userDetailsService.loadUserByUsername(user.getUsername()).getUsername()))
        {
            if(!service.getSettings(user.getUsername()).getIsActivated())
            {
                Map<String, String> response = new HashMap<>();
                System.out.println("test");
                response.put("error", "Konto nie zostało jeszcze aktywowane.Aktywuj je by się zalogować");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        }
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
            if(service.validateJWTToken(jwt, userDetails)){
                return ResponseEntity.ok().body("Token valid");
            } else{
                throw new Exception();
            }
        } catch (Exception e) {
            // Token niepoprawny, zwróć błąd
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @GetMapping("/get-roles")
    public ResponseEntity<List<String>> getRoles(@RequestHeader("Authorization") String token){
        String jwt = token.substring(7);
        String username = service.extractUserName(jwt);
        User user  = userService.getUserByName(username);
        List<UserRole> userRoles = userRoleService.getUserRoles(user.getId());
        List<String> roleNames = userRoles.stream()
                .map(UserRole::getName)
                .toList();

        System.out.println("Role użytkownika: " + roleNames);

        return ResponseEntity.ok(roleNames);
    }

}
