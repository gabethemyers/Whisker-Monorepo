package com.example.Project3Backend.Controllers;

import com.example.Project3Backend.Entities.Posts;
import com.example.Project3Backend.Services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping("/ping")
    public String ping() {
        return "This is the Post Controller (Instagram-like API)";
    }

    @Autowired
    private com.example.Project3Backend.Services.ImageService imageService;

    // CREATE a post
    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Posts> createPost(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("caption") String caption,
            @RequestParam("authorId") Long authorId,
            @RequestParam("catId") Long catId) {
        try {
            String imageUrl = imageService.uploadImage(file);

            Posts post = new Posts();
            post.setCaption(caption);
            post.setAuthorId(authorId);
            post.setCatId(catId);
            post.setImageUrl(imageUrl);
            post.setCreatedAt(java.time.OffsetDateTime.now());
            // likes and comments count are default 0 in entity

            Posts createdPost = postService.createPost(post);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (java.io.IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ all posts
    @GetMapping
    public ResponseEntity<List<Posts>> getAllPosts() {
        List<Posts> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // READ posts by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Posts>> getPostsByUserId(@PathVariable Long userId) {
        List<Posts> posts = postService.getPostsByAuthorId(userId);
        return ResponseEntity.ok(posts);
    }

    // READ posts by Cat ID
    @GetMapping("/cat/{catId}")
    public ResponseEntity<List<Posts>> getPostsByCatId(@PathVariable Long catId) {
        List<Posts> posts = postService.getPostsByCatId(catId);
        return ResponseEntity.ok(posts);
    }

    // READ one post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Posts> getPostById(@PathVariable long id) {
        Posts post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    // UPDATE a post
    @PutMapping("/{id}")
    public ResponseEntity<Posts> updatePost(@PathVariable long id, @RequestBody Posts postDetails) {
        Posts updatedPost = postService.updatePost(id, postDetails);
        return ResponseEntity.ok(updatedPost);
    }

    // DELETE a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}