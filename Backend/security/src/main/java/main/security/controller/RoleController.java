package main.security.controller;

import main.security.model.UserRole;
import main.security.service.UserRoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
public class RoleController {
    UserRoleService userRoleService;


    public RoleController(UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    @PostMapping("/add")
   public ResponseEntity<String> addRole(@RequestParam("role") String role) {
    userRoleService.addUserRole(role);
    return ResponseEntity.ok("Role added");
    }

    @GetMapping("/delete")
    public ResponseEntity<String> deleteRole() {
        return ResponseEntity.ok("Role removed");
    }

    @GetMapping("/get")
    public ResponseEntity<List<UserRole>> getRole() {
        return ResponseEntity.ok(userRoleService.getAllRoles());
    }
}
