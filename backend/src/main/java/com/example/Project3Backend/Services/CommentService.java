package com.example.Project3Backend.Services;

import com.example.Project3Backend.Entities.Comments;
import com.example.Project3Backend.Repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostService postService;

    // CREATE
    public Comments createComment(Comments comment) {
        comment.setCreatedAt(OffsetDateTime.now());
        Comments savedComment = commentRepository.save(comment);
        postService.incrementComments(comment.getPostId());
        return savedComment;
    }

    // READ ALL
    public List<Comments> getAllComments() {
        return commentRepository.findAll();
    }

    // READ ONE by ID
    public Comments getCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
    }

    // READ all comments for a specific post
    public List<Comments> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    // UPDATE
    public Comments updateComment(Long id, Comments commentDetails, Long userId) {
        Comments existingComment = getCommentById(id);
        if (!existingComment.getUserId().equals(userId)) {
            throw new RuntimeException("Not your comment");
        }
        existingComment.setContent(commentDetails.getContent());
        return commentRepository.save(existingComment);
    }

    // DELETE
    public void deleteComment(Long id, Long userId) {
        Comments comment = getCommentById(id);
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Not your comment");
        }
        commentRepository.delete(comment);
        postService.decrementComments(comment.getPostId());
    }
}
