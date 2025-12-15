package com.example.Project3Backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Project3Backend.Entities.Posts;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Posts, Long> {
    List<Posts> findAllByOrderByCreatedAtDesc();

    List<Posts> findAllByAuthorIdOrderByCreatedAtDesc(Long authorId);

    List<Posts> findAllByCatIdOrderByCreatedAtDesc(Long catId);
}
