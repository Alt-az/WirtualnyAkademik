package main.security.controller;

import main.security.service.UserService;
import main.security.service.ValidationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
public class EmailController {
    ValidationCodeService validationCodeService;
    UserService userService;

    @Autowired
    public EmailController(ValidationCodeService validationCodeService, UserService userService) {
        this.validationCodeService = validationCodeService;
        this.userService = userService;
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateEmail(@RequestParam("token") String token) {
        userService.activateUser(token);
        System.out.println("Email validated");
        return ResponseEntity.ok("Email validated");

    }
}
