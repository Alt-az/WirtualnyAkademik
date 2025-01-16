package main.security.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import javax.security.auth.callback.LanguageCallback;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Laundry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;

    private LocalDateTime stopTime;

    private Integer peopleLimit;

    private Boolean isAvailable;

    private String location;

    private String room;

    @JsonIgnore
    @OneToMany(mappedBy = "laundry", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserLaundry> userLaundries = new HashSet<>();

    public Laundry(Laundry laundry) {
        this.id = laundry.id;
        this.startTime = laundry.startTime;
        this.stopTime = laundry.stopTime;
        this.peopleLimit = laundry.peopleLimit;
        this.isAvailable = laundry.isAvailable;
        this.location = laundry.location;
        this.userLaundries = laundry.userLaundries;
        this.room = laundry.room;
    }
    public Laundry() {
    }

    @Override
    public String toString() {
        return "Laundry{" +
                "location='" + location + '\'' +
                ", isAvailable=" + isAvailable +
                ", peopleLimit=" + peopleLimit +
                ", stopTime=" + stopTime +
                ", startTime=" + startTime +
                ", id=" + id +
                '}';
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getStopTime() {
        return stopTime;
    }

    public void setStopTime(LocalDateTime stopTime) {
        this.stopTime = stopTime;
    }

    public Integer getPeopleLimit() {
        return peopleLimit;
    }

    public void setPeopleLimit(Integer peopleLimit) {
        this.peopleLimit = peopleLimit;
    }

    public Boolean getAvailable() {
        return isAvailable;
    }

    public void setAvailable(Boolean available) {
        isAvailable = available;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<UserLaundry> getUserLaundries() {
        return userLaundries;
    }

    public void setUserLaundries(Set<UserLaundry> userLaundries) {
        this.userLaundries = userLaundries;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }
}
