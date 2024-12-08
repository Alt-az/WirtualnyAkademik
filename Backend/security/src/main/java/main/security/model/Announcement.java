package main.security.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "announcement")
@Data
@ToString
public class Announcement {

    @Id
    @GeneratedValue
    private int id;

    @ManyToOne
    @JoinColumn(name = "creator_id", referencedColumnName = "id", nullable = false)
    private User creator;

    private String title;
    private String content;

    @CreationTimestamp
    private LocalDateTime createdAt;
    private boolean pinned;
}
