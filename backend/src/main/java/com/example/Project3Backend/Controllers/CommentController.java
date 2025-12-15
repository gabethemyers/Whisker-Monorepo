package com.example.Project3Backend.Controllers;

import com.example.Project3Backend.Entities.Comments;
import com.example.Project3Backend.Services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/ping")
    public String ping() {
        return "This is the Comment Controller (handles post comments)";
    }

    // CREATE a comment
    @PostMapping
    public ResponseEntity<Comments> createComment(@RequestBody Comments comment) {
        Comments createdComment = commentService.createComment(comment);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    // READ all comments
    @GetMapping
    public ResponseEntity<List<Comments>> getAllComments() {
        List<Comments> comments = commentService.getAllComments();
        return ResponseEntity.ok(comments);
    }

    // READ comments for a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comments>> getCommentsByPostId(@PathVariable Long postId) {
        List<Comments> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // READ one comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Comments> getCommentById(@PathVariable Long id) {
        try {
            Comments comment = commentService.getCommentById(id);
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE a comment
    @PutMapping("/{id}")
    public ResponseEntity<Comments> updateComment(@PathVariable Long id, @RequestBody Comments commentDetails) {
        try {
            Comments updatedComment = commentService.updateComment(id, commentDetails);
            return ResponseEntity.ok(updatedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
