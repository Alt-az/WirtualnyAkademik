package main.security.model;

import jakarta.persistence.*;

@Entity
@Table(name = "announcement")
public class Announcement {

    @Id
    @GeneratedValue
    private int id;

    @ManyToOne
    @JoinColumn(name = "creator_id", referencedColumnName = "id", nullable = false)
    private User creator;

    private String title;
    private String content;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "Announcement{" +
                "id=" + id +
                ", creator=" + (creator != null ? creator.getUsername() : null) +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
