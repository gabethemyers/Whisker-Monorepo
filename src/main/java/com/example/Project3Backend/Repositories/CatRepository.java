package com.example.Project3Backend.Repositories;

import com.example.Project3Backend.Entities.Cat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CatRepository extends JpaRepository<Cat, Long> {
    List<Cat> findByUserId(Long userId);
}
