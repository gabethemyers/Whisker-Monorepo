package com.example.Project3Backend.Services;

import com.example.Project3Backend.Entities.Likes;
import com.example.Project3Backend.Repositories.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostService postService;

    // CREATE (like a post)
    public Likes createLike(Likes like) {
        like.setCreatedAt(OffsetDateTime.now());
        Likes savedLike = likeRepository.save(like);
        
        postService.incrementLikes(like.getPostId());
        return savedLike;
    }

    // READ ALL
    public List<Likes> getAllLikes() {
        return likeRepository.findAll();
    }

    // READ ONE by ID
    public Likes getLikeById(Long id) {
        return likeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Like not found with id: " + id));
    }

    // READ likes for a specific post
    public List<Likes> getLikesByPostId(Long postId) {
        return likeRepository.findByPostId(postId);
    }

    // DELETE by like ID
    public void deleteLike(Long id) {
        Likes like = getLikeById(id);
        likeRepository.delete(like);
        postService.decrementLikes(like.getPostId());
    }
}
