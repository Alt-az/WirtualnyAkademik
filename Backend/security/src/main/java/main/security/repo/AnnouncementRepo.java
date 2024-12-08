package main.security.repo;

import main.security.model.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepo extends JpaRepository<Announcement, Integer> {
    Page<Announcement> findAllByOrderByPinnedDescIdDesc(Pageable pageable);
}