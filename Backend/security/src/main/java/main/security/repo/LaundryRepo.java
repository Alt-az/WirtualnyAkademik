package main.security.repo;

import main.security.model.Laundry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LaundryRepo extends JpaRepository<Laundry, Integer> {
    public Laundry findByStartTime(LocalDateTime dateOfLaundry);
    public Laundry findById(Long id);
    @Query("SELECT l FROM Laundry l WHERE MONTH(l.startTime) = :month AND YEAR(l.startTime) = :year")
    List<Laundry> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    void deleteById(Long id);
}
