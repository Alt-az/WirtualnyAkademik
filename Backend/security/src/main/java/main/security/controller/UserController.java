package main.security.controller;

import main.security.model.User;
import main.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("modify-user")
    public ResponseEntity<?> changeSettings(@RequestBody User user){
        userService.changeSettings(user);
        return ResponseEntity.ok("Settings changed");
    }
    @PostMapping("change-password")
    public ResponseEntity<?> changePassword(@RequestBody User user){
        userService.changePassword(user);
        return ResponseEntity.ok("Password changed");
    }
    @GetMapping("get-user")
    public ResponseEntity<?> getSettings(@RequestParam("username") String username){
        return ResponseEntity.ok(userService.getSettings(username));
    }
}
