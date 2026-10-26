package com.example.Project3Backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Project3Backend.Entities.Posts;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;


@Repository
public interface PostRepository extends JpaRepository<Posts, Long> {
    List<Posts> findAllByOrderByCreatedAtDesc();

    List<Posts> findAllByAuthorIdOrderByCreatedAtDesc(Long authorId);

    List<Posts> findAllByCatIdOrderByCreatedAtDesc(Long catId);

    @Query(value="SELECT p.* FROM posts p " +
                 "JOIN post_cats pc ON pc.post_id = p.id " +
                 "WHERE pc.cat_id = :catId " +
                 "ORDER BY p.created_at DESC",
            nativeQuery = true)
    List<Posts> findPostsByCatId(@Param("catId") Long catId);
}
