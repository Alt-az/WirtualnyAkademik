package main.security.service;

import main.security.model.UserRole;
import main.security.repo.UserRepo;
import main.security.repo.UserRoleRepo;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserRoleService {
    UserRoleRepo userRoleRepo;
    private final JdbcTemplate jdbcTemplate;
    public UserRoleService(UserRoleRepo userRoleRepo, JdbcTemplate jdbcTemplate) {
        this.userRoleRepo = userRoleRepo;
        this.jdbcTemplate = jdbcTemplate;
    }
    @Transactional
    public void addUserRole(String name) {
        UserRole userRole = new UserRole(name);
        userRoleRepo.save(userRole);
    }
    @Transactional
    public void deleteUserRole(String name) {
        UserRole role = userRoleRepo.findByName(name);
        jdbcTemplate.update("DELETE FROM user_roles WHERE role_id = ?", role.getId());
        userRoleRepo.deleteByName(name);
    }
    public List<UserRole> getAllRoles() {
        return userRoleRepo.findAll();
    }
}
