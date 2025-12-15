package com.example.Project3Backend.Services;

import com.example.Project3Backend.Entities.Posts;
import com.example.Project3Backend.Repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // CREATE
    public Posts createPost(Posts post) {
        post.setCreatedAt(OffsetDateTime.now());
        return postRepository.save(post);
    }

    // READ ALL
    public List<Posts> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Posts> getPostsByAuthorId(Long authorId) {
        return postRepository.findAllByAuthorIdOrderByCreatedAtDesc(authorId);
    }

    public List<Posts> getPostsByCatId(Long catId) {
        return postRepository.findAllByCatIdOrderByCreatedAtDesc(catId);
    }

    // READ ONE
    public Posts getPostById(long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post Not Found"));
    }

    // UPDATE
    public Posts updatePost(long id, Posts postDetails) {
        Posts existingPost = getPostById(id);

        existingPost.setCaption(postDetails.getCaption());
        existingPost.setImageUrl(postDetails.getImageUrl());

        return postRepository.save(existingPost);
    }

    // DELETE
    public void deletePost(long id) {
        Posts post = getPostById(id);
        postRepository.delete(post);
    }

    // Helper methods for counts
    public void incrementLikes(Long postId) {
        Posts post = getPostById(postId);
        post.setLikesCount(post.getLikesCount() + 1);
        postRepository.save(post);
    }

    public void decrementLikes(Long postId) {
        Posts post = getPostById(postId);
        if (post.getLikesCount() != null && post.getLikesCount() > 0) {
            post.setLikesCount(post.getLikesCount() - 1);
            postRepository.save(post);
        }
    }

    public void incrementComments(Long postId) {
        Posts post = getPostById(postId);
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);
    }

    public void decrementComments(Long postId) {
        Posts post = getPostById(postId);
        if (post.getCommentCount() != null && post.getCommentCount() > 0) {
            post.setCommentCount(post.getCommentCount() - 1);
            postRepository.save(post);
        }
    }
}