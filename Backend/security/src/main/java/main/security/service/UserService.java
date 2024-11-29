package main.security.service;


import main.security.model.User;
import main.security.model.ValidationCode;
import main.security.repo.UserRepo;
import main.security.repo.ValidationCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private CaptchaService captchaService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ValidationCodeService validationCodeService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User register(User user, String recaptchaToken) {
        if (!captchaService.verifyCaptcha(recaptchaToken)) {
            throw new RuntimeException("Invalid reCAPTCHA");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        return user;
    }

    public String verify(User user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        } else {
            return "fail";
        }
    }

    public String generateToken(User user) {
        return jwtService.generateToken(user.getUsername());
    }

    public String extractUserName(String token) {
        return jwtService.extractUserName(token);
    }

    public boolean validateJWTToken(String token, UserDetails user) {
        return jwtService.validateToken(token, user);
    }

    public boolean activateUser(String code){
        ValidationCode validationCode = validationCodeService.findByCode(code);
        if(validationCode == null){
            return false;
        }
        if(!validationCode.isActivated() && !validationCodeService.isCodeExpired(validationCode)){
            User user = validationCode.getUser();
            System.out.println(user);
            user.setIsActivated(true);
            userRepo.save(user);
            validationCode.setActivated(true);
            validationCodeService.save(validationCode);
        }
        return true;
    }
    public boolean existsByUsername(String username) {
        return userRepo.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }

    public boolean changeSettings(User user){
        User u = userRepo.findByUsername(user.getUsername());
        u.setEmail(user.getEmail());
        u.setName(user.getName());
        u.setSurname(user.getSurname());
        userRepo.save(u);
        return true;
    }

    public boolean changePassword(User user){
        User u = userRepo.findByUsername(user.getUsername());
        u.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(u);
        return true;
    }
    public User getSettings(String username){
        return userRepo.findByUsername(username);
    }

    public List<User> getAllUsers(String field, int offset, int pageSize){
        List <User> p = userRepo.findAll();
        return p;
    }

    public boolean deleteUser(int id)
    {
        userRepo.deleteById(id);
        return true;
    }

}
