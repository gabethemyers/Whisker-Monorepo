package com.example.Project3Backend.Entities;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "comments")
public class Comments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "post_id", nullable = false)
    private Long postId; // posts.id

    @Column(name = "user_id", nullable = false)
    private Long userId; // users.id (who commented)

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", columnDefinition = "TIMESTAMPTZ")
    private OffsetDateTime createdAt;

    // Constructors
    public Comments() {
    }

    public Comments(Long postId, Long userId, String content, OffsetDateTime createdAt) {
        this.postId = postId;
        this.userId = userId;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}