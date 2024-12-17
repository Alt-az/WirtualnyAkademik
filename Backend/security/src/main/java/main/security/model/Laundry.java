package main.security.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Laundry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String color;

    public String material;

    public String temperature;

    public LocalDateTime dateOfLaundry;

    public Integer LimitOfClothes;

    public Boolean isAvailable;

    public String TypeOfClothes;

    public String placeOfLaundry;

    @OneToMany(mappedBy = "laundry", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserLaundry> userLaundries = new HashSet<>();


}
