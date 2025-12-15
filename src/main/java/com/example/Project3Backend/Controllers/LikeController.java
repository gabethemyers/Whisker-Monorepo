package com.example.Project3Backend.Controllers;

import com.example.Project3Backend.Entities.Likes;
import com.example.Project3Backend.Services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @GetMapping("/ping")
    public String ping() {
        return "This is the Like Controller (handles post likes)";
    }

    // CREATE a like
    @PostMapping
    public ResponseEntity<?> createLike(@RequestBody Likes like) {
        try {
            Likes createdLike = likeService.createLike(like);
            return new ResponseEntity<>(createdLike, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("You have already liked this post", HttpStatus.CONFLICT);
        }
    }

    // READ all likes
    @GetMapping
    public ResponseEntity<List<Likes>> getAllLikes() {
        List<Likes> likes = likeService.getAllLikes();
        return ResponseEntity.ok(likes);
    }

    // READ likes for a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Likes>> getLikesByPostId(@PathVariable Long postId) {
        List<Likes> likes = likeService.getLikesByPostId(postId);
        return ResponseEntity.ok(likes);
    }

    // READ one like by ID
    @GetMapping("/{id}")
    public ResponseEntity<Likes> getLikeById(@PathVariable Long id) {
        try {
            Likes like = likeService.getLikeById(id);
            return ResponseEntity.ok(like);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE a like (unlike)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLike(@PathVariable Long id) {
        try {
            likeService.deleteLike(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
