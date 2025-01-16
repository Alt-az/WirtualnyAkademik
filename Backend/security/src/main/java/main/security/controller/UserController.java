package main.security.controller;

import main.security.model.User;
import main.security.repo.UserRepo;
import main.security.service.UserService;
import main.security.service.ValidationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ValidationCodeService validationCodeService;
    private final UserRepo userRepo;

    @Autowired
    public UserController(UserService userService, ValidationCodeService validationCodeService, UserRepo userRepo) {
        this.validationCodeService = validationCodeService;
        this.userService = userService;
        this.userRepo = userRepo;
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
    @PostMapping("/edit-user")
    public ResponseEntity<?> editUser(
            @RequestParam("user-id") Long userId,
            @RequestBody User user) {
        System.out.println("test");
        userService.editUser(user);
        return ResponseEntity.ok("User updated successfully");
    }
    @PostMapping("/delete-user")
    public ResponseEntity<?> deleteUser(@RequestParam("user-id") Integer userId)
    {
        System.out.println("test usuwania");
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }


    @GetMapping("get-user")
    public ResponseEntity<?> getSettings(@RequestParam("username") String username){
        return ResponseEntity.ok(userService.getSettings(username));
    }
    @GetMapping("get-users")
    public ResponseEntity<?> getUsers(@RequestParam("pagesize") int pageSize, @RequestParam("offset") int offset, @RequestParam("field") String field){
        return ResponseEntity.ok(userService.getAllUsers(field, pageSize, offset));
    }

}
