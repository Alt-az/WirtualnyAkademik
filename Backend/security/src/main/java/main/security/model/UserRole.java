package main.security.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class UserRole   {
    @Id
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
    //private String role;
    //private Users user;
}
