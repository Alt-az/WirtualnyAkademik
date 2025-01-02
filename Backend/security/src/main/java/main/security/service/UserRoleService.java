package main.security.service;

import main.security.model.UserRole;
import main.security.repo.UserRepo;
import main.security.repo.UserRoleRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserRoleService {
    UserRoleRepo userRoleRepo;

    public UserRoleService(UserRoleRepo userRoleRepo) {
        this.userRoleRepo = userRoleRepo;
    }
    @Transactional
    public void addUserRole(String name) {
        UserRole userRole = new UserRole(name);
        userRoleRepo.save(userRole);
    }
    @Transactional
    public void deleteUserRole(String name) {
        userRoleRepo.deleteByName(name);
    }
    public List<UserRole> getAllRoles() {
        return userRoleRepo.findAll();
    }
}
