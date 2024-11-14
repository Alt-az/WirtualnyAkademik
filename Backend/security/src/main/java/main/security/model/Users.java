package main.security.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.util.Set;

@Entity
public class Users {
    @Id
    @GeneratedValue
    private int id;
    private String email;
    @Column(name = "name",nullable = false)
    @Size(min = 3)
    private String username;
    @JsonIgnore
    private String password;
    //@JsonBackReference
    //@ManyToMany(mappedBy = "user")
    //private Set<UserRole> roles;
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Users{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
