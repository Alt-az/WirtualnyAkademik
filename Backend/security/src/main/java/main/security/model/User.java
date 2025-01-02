package main.security.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;


@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private int id;
    private String email;
    private String name;
    private String surname;
    private String username;
    private String password;
    private boolean isActivated;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<UserRole> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserLaundry> userLaundries = new HashSet<>();

    public boolean addRole(UserRole role) {
        return roles.add(role);
    }
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Delivery> deliveries = new ArrayList<>();
}
