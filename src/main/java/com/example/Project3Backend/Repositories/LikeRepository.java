package com.example.Project3Backend.Repositories;

import com.example.Project3Backend.Entities.Likes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Likes, Long> {
    List<Likes> findByPostId(Long postId);
}
