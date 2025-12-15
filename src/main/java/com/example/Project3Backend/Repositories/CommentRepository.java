package com.example.Project3Backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Project3Backend.Entities.Comments;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comments, Long>{
    List<Comments> findByPostId(Long postId);
}
